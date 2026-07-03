interface ErrorModalData {
  title: string
  description: string
  email: string
  button: string
}

const errorModalTranslations: Record<string, ErrorModalData> = {
  en: {
    title: 'Oops! Something went wrong.',
    description: 'Please try again later or contact us directly at',
    email: 'info@yourcompany.com',
    button: 'Try again',
  },
  es: {
    title: '¡Ups! Algo salió mal.',
    description: 'Por favor, inténtalo de nuevo más tarde o contáctenos directamente en',
    email: 'info@yourcompany.com',
    button: 'Intentar de nuevo',
  },
  fi: {
    title: 'Hups! Jotain meni pieleen.',
    description: 'Yritä myöhemmin uudelleen tai ota meihin suoraan yhteyttä osoitteessa',
    email: 'info@yourcompany.com',
    button: 'Yritä uudelleen',
  },
  fr: {
    title: "Oups ! Quelque chose s'est mal passé.",
    description: 'Veuillez réessayer plus tard ou nous contacter directement à',
    email: 'info@yourcompany.com',
    button: 'Réessayer',
  },
  de: {
    title: 'Hoppla! Etwas ist schiefgelaufen.',
    description:
      'Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt unter',
    email: 'info@yourcompany.com',
    button: 'Erneut versuchen',
  },
}

export default errorModalTranslations
