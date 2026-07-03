interface ContactFormData {
  data: {
    title: {
      textFirst: string
      textSecond: string
    }
    note: string
    policyText: string
    button: {
      text: string
    }
    contactForm: {
      nameText: string
      namePlaceholder: string
      nameErrorText: string
      mailText: string
      mailPlaceholder: string
      mailErrorText: string
      phoneText: string
      phonePlaceholder: string
      phoneErrorMessage: string
      subjectText: string
      subjectPlaceholder: string
      subjectErrorText: string
      questionText: string
      questionPlaceholder: string
      messageErrorText: string
      policyText: string
      policyErrorText: string
    }
  }
}

const contactFormTranslations: Record<string, ContactFormData> = {
  en: {
    data: {
      title: { textFirst: 'Contact', textSecond: 'Us' },
      note: 'Fill out the form below and we will get back to you as soon as possible.',
      policyText: 'I agree with the',
      button: { text: 'Send message' },
      contactForm: {
        nameText: 'Your name',
        namePlaceholder: 'Full name',
        nameErrorText: 'Please enter your name',
        mailText: 'Email',
        mailPlaceholder: 'Email address',
        mailErrorText: 'Please enter a valid email',
        phoneText: 'Phone',
        phonePlaceholder: 'Phone number',
        phoneErrorMessage: 'Please enter a valid phone number',
        subjectText: 'Subject',
        subjectPlaceholder: 'Subject',
        subjectErrorText: 'Please enter a subject',
        questionText: 'Message',
        questionPlaceholder: 'Your message',
        messageErrorText: 'Please enter your message',
        policyText: 'Privacy policy',
        policyErrorText: 'Please accept the privacy policy',
      },
    },
  },

  de: {
    data: {
      title: { textFirst: 'Kontakt', textSecond: 'aufnehmen' },
      note: 'Füllen Sie das Formular aus und wir melden uns so schnell wie möglich bei Ihnen.',
      policyText: 'Ich stimme der',
      button: { text: 'Nachricht senden' },
      contactForm: {
        nameText: 'Ihr Name',
        namePlaceholder: 'Vollständiger Name',
        nameErrorText: 'Bitte geben Sie Ihren Namen ein',
        mailText: 'E-Mail',
        mailPlaceholder: 'E-Mail-Adresse',
        mailErrorText: 'Bitte geben Sie eine gültige E-Mail ein',
        phoneText: 'Telefon',
        phonePlaceholder: 'Telefonnummer',
        phoneErrorMessage: 'Ungültige Telefonnummer',
        subjectText: 'Betreff',
        subjectPlaceholder: 'Betreff',
        subjectErrorText: 'Bitte geben Sie einen Betreff ein',
        questionText: 'Nachricht',
        questionPlaceholder: 'Ihre Nachricht',
        messageErrorText: 'Bitte geben Sie Ihre Nachricht ein',
        policyText: 'Datenschutzrichtlinie',
        policyErrorText: 'Bitte akzeptieren Sie die Datenschutzrichtlinie',
      },
    },
  },

  es: {
    data: {
      title: { textFirst: 'Contáct', textSecond: 'enos' },
      note: 'Rellene el formulario y nos pondremos en contacto con usted lo antes posible.',
      policyText: 'Acepto la',
      button: { text: 'Enviar mensaje' },
      contactForm: {
        nameText: 'Su nombre',
        namePlaceholder: 'Nombre completo',
        nameErrorText: 'Por favor ingrese su nombre',
        mailText: 'Correo electrónico',
        mailPlaceholder: 'Dirección de correo',
        mailErrorText: 'Por favor ingrese un correo válido',
        phoneText: 'Teléfono',
        phonePlaceholder: 'Número de teléfono',
        phoneErrorMessage: 'Por favor ingrese un número válido',
        subjectText: 'Asunto',
        subjectPlaceholder: 'Asunto',
        subjectErrorText: 'Por favor ingrese un asunto',
        questionText: 'Mensaje',
        questionPlaceholder: 'Su mensaje',
        messageErrorText: 'Por favor ingrese su mensaje',
        policyText: 'Política de privacidad',
        policyErrorText: 'Acepte la política de privacidad',
      },
    },
  },

  fr: {
    data: {
      title: { textFirst: 'Contactez', textSecond: 'Nous' },
      note: 'Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.',
      policyText: "J'accepte la",
      button: { text: 'Envoyer' },
      contactForm: {
        nameText: 'Votre nom',
        namePlaceholder: 'Nom complet',
        nameErrorText: 'Veuillez entrer votre nom',
        mailText: 'E-mail',
        mailPlaceholder: 'Adresse e-mail',
        mailErrorText: 'Veuillez entrer un e-mail valide',
        phoneText: 'Téléphone',
        phonePlaceholder: 'Numéro de téléphone',
        phoneErrorMessage: 'Numéro de téléphone invalide',
        subjectText: 'Sujet',
        subjectPlaceholder: 'Sujet',
        subjectErrorText: 'Veuillez entrer un sujet',
        questionText: 'Message',
        questionPlaceholder: 'Votre message',
        messageErrorText: 'Veuillez entrer votre message',
        policyText: 'Politique de confidentialité',
        policyErrorText: 'Veuillez accepter la politique de confidentialité',
      },
    },
  },

  fi: {
    data: {
      title: { textFirst: 'Ota', textSecond: 'Yhteyttä' },
      note: 'Täytä alla oleva lomake ja palaamme sinulle mahdollisimman pian.',
      policyText: 'Hyväksyn',
      button: { text: 'Lähetä viesti' },
      contactForm: {
        nameText: 'Nimesi',
        namePlaceholder: 'Koko nimi',
        nameErrorText: 'Syötä nimesi',
        mailText: 'Sähköposti',
        mailPlaceholder: 'Sähköpostiosoite',
        mailErrorText: 'Syötä kelvollinen sähköposti',
        phoneText: 'Puhelin',
        phonePlaceholder: 'Puhelinnumero',
        phoneErrorMessage: 'Virheellinen puhelinnumero',
        subjectText: 'Aihe',
        subjectPlaceholder: 'Aihe',
        subjectErrorText: 'Syötä aihe',
        questionText: 'Viesti',
        questionPlaceholder: 'Viestisi',
        messageErrorText: 'Syötä viestisi',
        policyText: 'Tietosuojakäytäntö',
        policyErrorText: 'Hyväksy tietosuojakäytäntö',
      },
    },
  },
}

export default contactFormTranslations
