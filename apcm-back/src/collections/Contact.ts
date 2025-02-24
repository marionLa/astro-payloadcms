import { CollectionConfig, PayloadRequest } from 'payload'
import sanitizeHtml from 'sanitize-html'

async function verifyCaptcha(captcha: string) {


  const url = process.env.CLOUDFARE_VERIFY_URL

  if (!url) {
    throw new Error('URL de verification du CAPTCHA non configurée.')
  }

  const result = await fetch(url, {
    body: JSON.stringify({
      secret: process.env.CLOUDFARE_SECRET_KEY,
      response: captcha,
    }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const outcome = await result.json()
  return outcome.success

}

const requestCache = new Map<string, { count: number; timestamp: number }>()

const RATE_LIMIT_TIMEFRAME = 15 * 60 * 1000 // 15 minutes
const MAX_REQUESTS = 5 // Maximum 5 requêtes par IP dans la période

const Contact: CollectionConfig = {
  slug: 'contact',
  admin: {
    useAsTitle: 'email',
  },
  access: {
    create: ({ req }) => {
      const clientApiKey = req.headers.get('x-api-key')
      return clientApiKey === process.env.PAYLOAD_API_KEY
    },
  },
  fields: [
    {
      name: 'email',
      type: 'text',
      required: true,
    },
    {
      name: 'name',
      type: 'text',
      minLength: 3,
      required: true,
    },
    {
      name: 'message',
      type: 'text',
      minLength: 10,
      required: true,
    },
  ],
  hooks: {
    beforeOperation: [
      async ({ args, operation }) => {
        if (operation === 'create') {
          const req: PayloadRequest = args.req
          const userIP = req.headers.get('x-forwarded-for')?.toString()

          if (!userIP) {
            throw new Error('Impossible de récupérer l\'adresse IP.')
          }

          const currentTime = Date.now()
          const userRequests = requestCache.get(userIP) || { count: 0, timestamp: currentTime }

          // Vérifie si la fenêtre de temps est dépassée (reset du compteur)
          if (currentTime - userRequests.timestamp > RATE_LIMIT_TIMEFRAME) {
            requestCache.set(userIP, { count: 1, timestamp: currentTime })
          } else {
            // Si encore dans la fenêtre de temps, on incrémente
            if (userRequests.count >= MAX_REQUESTS) {
              throw new Error('Trop de requêtes. Veuillez réessayer plus tard.')
            }
            requestCache.set(userIP, { count: userRequests.count + 1, timestamp: userRequests.timestamp })
          }
        }
      }
      ,
    ],
    beforeChange: [
      async ({ data }) => {
        if (!(await verifyCaptcha(data.captcha))) {
          throw new Error('Échec du CAPTCHA')
        }
        data.message = sanitizeHtml(data.message, {
          allowedTags: [],
          allowedAttributes: {},
        })

        if (data.name.length < 3) {
          throw new Error('Le nom doit contenir au moins 3 caractères.')
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
          throw new Error('L\'email est invalide.')
        }
        if (data.message.length < 10) {
          throw new Error('Le message doit contenir au moins 10 caractères.')
        }

        return data
      },
    ],
    afterChange:
      [
        async ({ req, doc, operation }) => {
          if (operation === 'create') {
            try {
              console.log('📧 Envoi de l\'email...')

              // 🔹 Envoi du mail au destinataire principal
              await req.payload.sendEmail({
                to: process.env.SMTP_USER,
                from: process.env.SMTP_EXPEDITEUR,
                subject: `[FORMULAIRE DE CONTACT] Nouveau message`,
                text: `De: ${doc.name} (${doc.email})\n\n${doc.message}`,
                html: `<p><strong>De :</strong> ${doc.name} (<a href="mailto:${doc.email}">${doc.email}</a>)</p><p>${doc.message}</p>`,
              })

              console.log('✅ Email envoyé au destinataire principal !')

              // 🔹 Envoi d'une copie à l'expéditeur
              await req.payload.sendEmail({
                to: doc.email, // 🔹 Envoi à l'expéditeur
                from: process.env.SMTP_USER,
                subject: `Confirmation de votre message`,
                text: `Bonjour ${doc.name},\n\nNous avons bien reçu votre message :\n\n"${doc.message}"\n\nNous vous répondrons dès que possible.\n\nCordialement,\nL'équipe de contact@monsite.com`,
                html: `<p>Bonjour ${doc.name},</p><p>Nous avons bien reçu votre message :</p><blockquote>${doc.message}</blockquote><p>Nous vous répondrons dès que possible.</p><p>Cordialement,<br>L'équipe de contact@monsite.com</p>`,
              })

              console.log('✅ Copie envoyée à l\'expéditeur !')

              console.log('🗑️ Suppression de l\'entrée en base...')
              await req.payload.delete({
                collection: 'contact',
                id: doc.id,
              })

              console.log('✅ Enregistrement supprimé !')
            } catch (error) {
              console.error('❌ Erreur lors de l\'envoi ou suppression :', error)
            }
          }
        },
      ],
  },
}

export default Contact


