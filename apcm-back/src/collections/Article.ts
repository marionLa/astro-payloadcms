import { CollectionConfig, PayloadRequest } from 'payload'
import { HTMLConverterFeature, lexicalEditor, lexicalHTML } from '@payloadcms/richtext-lexical'

const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCES_TOKEN as string
const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID as string
const PAYLOAD_PUBLIC_SERVER_URL = process.env.PAYLOAD_PUBLIC_SERVER_URL as string

const extractLinks = (html: string): { text: string; links: string[] } => {
  const urlRegex = /https?:\/\/[^\s]+/g
  const links = html.match(urlRegex) || []
  const textWithoutLinks = html.replace(urlRegex, '').trim()
  return { text: textWithoutLinks, links }
}

// Convertir le contenu en texte brut avec mise en forme adaptée
const cleanHtml = (html: string): string => {
  return html
    .replace(/<br>/g, '\n') // Remplace les balises <br> par des sauts de ligne
    .replace(/<[^>]*>/g, '') // Supprime les autres balises HTML
}


interface FbMedia {
  id: string;
  url?: string | null;
}

const Article: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      defaultValue: () => new Date(),
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          HTMLConverterFeature({}),
        ],
      }),
    },
    lexicalHTML('content', { name: 'content_html' }),
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'tag', type: 'text' }],
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
  hooks: {
    afterChange: [
      async ({ req, doc, operation }: { req: PayloadRequest; doc: any; operation: string }) => {

        //if (operation !== 'create' && !doc.published) return
        try {
          const imageId: string | undefined = doc.image
          let imageUrl: string | null = null

          if (imageId) {
            const media: FbMedia | null = await req.payload.findByID({
              collection: 'media',
              id: imageId,
            })

            if (media && media.url) {
              imageUrl = PAYLOAD_PUBLIC_SERVER_URL + media.url
            }
          }

          let imageFbId: string | null = null
          if (imageUrl) {
            const uploadImageResponse = await fetch(
              `https://graph.facebook.com/${FACEBOOK_PAGE_ID}/photos`,
              {
                method: 'POST',
                body: new URLSearchParams({
                  url: imageUrl,
                  published: 'false',
                  access_token: FACEBOOK_ACCESS_TOKEN,
                }),
              },
            )

            const imageData = await uploadImageResponse.json()
            if (imageData.id) {
              imageFbId = imageData.id
            }
          }

          const {
            text: contentText,
            links,
          } = extractLinks(cleanHtml(doc.content_html || 'Nouvel article disponible !'))
          const formattedLinks = links.length > 0 ? `\n\n🔗 Liens utiles :\n${links.join('\n')}` : ''

          const postData: Record<string, any> = {
            message: `📰 *${doc.title}* \n\n${contentText}${formattedLinks}`,
            access_token: FACEBOOK_ACCESS_TOKEN,
          }
          if (imageFbId) {
            postData.attached_media = [{ media_fbid: imageFbId }]
          }

          const postResponse = await fetch(
            `https://graph.facebook.com/${FACEBOOK_PAGE_ID}/feed`,
            {
              method: 'POST',
              body: new URLSearchParams(postData),
            },
          )

          const postResult = await postResponse.json()
          if (!postResult.id) {
            console.error('Erreur lors de la publication Facebook', postResult)
          }
        } catch (error) {
          console.error('Erreur dans le hook afterChange:', error)
        }
      },
    ],
  },
}

export default Article
