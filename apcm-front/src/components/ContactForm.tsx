import { useEffect, useState } from 'react'
import DOMPurify from 'dompurify'
import { Turnstile } from '@marsidev/react-turnstile'


const ContactForm = ({ cloudflareSiteKey }: { cloudflareSiteKey: string }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [status, setStatus] = useState({ success: false, message: '' })
  const [valid, setValid] = useState({
    fields: { name: false, email: false, message: false },
    messages: { name: '', email: '', message: '' },
  })
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false);

  const validationMessages = {
    name: 'Le nom doit contenir au moins 3 caractères',
    email: 'Veuillez fournir une adresse email valide',
    message: 'Le message doit contenir au moins 10 caractères',
  }


  useEffect(() => {
    console.log('Status updated:', status)
  }, [valid, status])


  const sanitizeInput = (input: string) => DOMPurify.sanitize(input)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log(e.target.value + '  ' + e.target.name)
    setFormData({ ...formData, [e.target.name]: sanitizeInput(e.target.value) })
  }

  const validate = () => {
    console.log('Avant validation :', formData)

    setValid((prevState) => ({
      fields: {
        ...prevState.fields,
        name: formData.name.length >= 3,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
        message: formData.message.length >= 10,
      },
      messages: {
        name: formData.name.length < 3 ? validationMessages.name : '',
        email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? validationMessages.email : '',
        message: formData.message.length < 10 ? validationMessages.message : '',
      },
    }))

    console.log('Après validation :', valid) // Ne montre pas l’état mis à jour immédiatement
  }


  // Gérer l'envoi du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!captchaToken) {
      setStatus({ success: false, message: 'Veuillez valider le CAPTCHA.' })
      return
    }

    setIsLoading(true)
    setIsSuccess(false);

    try {
      const response: any = await fetch(`${import.meta.env.PUBLIC_API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, captcha: captchaToken }),
      })
      if (response.ok) {
        console.log('response ok')
        setStatus({ success: true, message: 'Message envoyé avec succès !' })
        setFormData({ name: '', email: '', message: '' }) // Réinitialiser le formulaire
        setIsSuccess(true)
      } else {
        console.log('response pas ok')
        setStatus({ success: false, message: 'Erreur lors de l\'envoi du message.' })
        throw new Error('Erreur lors de l\'envoi du message.')
      }
    } catch (error) {
      setStatus({ success: false, message: 'Échec de l\'envoi. Réessayez plus tard.' })
      console.log(status)
    } finally {
      setIsLoading(false)
      setTimeout(() => setIsSuccess(false), 3000);
    }
  }

  // @ts-ignore
  return (

    <div className={'form-container'}>

      <h1>Contactez-nous</h1>
      <p key={status.message} style={{ color: status.success ? 'green' : 'red' }}>
        {status.message}
      </p>
      <form className={'contact-form'} onSubmit={handleSubmit}>
        <label htmlFor="name">Nom</label>
        <input type="text" id="name" name="name" autoComplete="off"
               value={formData.name}
               onChange={handleChange}
               onBlur={validate}
               style={{ border: !valid.fields.name ? '2px solid red' : '2px solid green' }}
               required />
        {valid.messages.name && <p style={{ color: 'red' }}>{valid.messages.name}</p>}

        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" autoComplete="off"
               value={formData.email}
               onChange={handleChange}
               onBlur={validate}
               style={{ border: !valid.fields.email ? '2px solid red' : '2px solid green' }}
               required />
        {valid.messages.email && <p style={{ color: 'red' }}>{valid.messages.email}</p>}

        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" autoComplete="off"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={validate}
                  style={{ border: !valid.fields.message ? '2px solid red' : '2px solid green' }}
                  required />
        {valid.messages.message && <p style={{ color: 'red' }}>{valid.messages.message}</p>}

        <Turnstile siteKey={cloudflareSiteKey} onSuccess={setCaptchaToken} />

        <button type="submit" disabled={isLoading} style={{ opacity: isLoading ? 0.5 : 1 }}>
          {isLoading ? <span className="spinner"></span> : isSuccess ?
            <span className="success-check">✔️</span> : "Envoyer"}
        </button>

      </form>


    </div>
  )

}

export default ContactForm
