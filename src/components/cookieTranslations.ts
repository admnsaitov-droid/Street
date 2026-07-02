interface CookieData {
  title: string
  description: string
  privacyPolicy: string
  decline: string
  accept: string
}

const cookieTranslations: Record<string, CookieData> = {
  en: {
    title: 'We respect your privacy',
    description:
      'This website uses cookies to improve your browsing experience, analyze traffic, and remember your preferences. To learn more, please read our',
    privacyPolicy: 'Privacy Policy',
    decline: 'DECLINE',
    accept: 'ACCEPT',
  },
  es: {
    title: 'Respetamos tu privacidad',
    description:
      'Este sitio web utiliza cookies para mejorar tu experiencia de navegación, analizar el tráfico y recordar tus preferencias. Para obtener más información, lee nuestra',
    privacyPolicy: 'Política de privacidad',
    decline: 'RECHAZAR',
    accept: 'ACEPTAR',
  },
  fi: {
    title: 'Kunnioitamme yksityisyyttäsi',
    description:
      'Tämä verkkosivusto käyttää evästeitä parantaakseen selauskokemustasi, analysoidakseen liikennettä ja muistaakseen mieltymyksesi. Lisätietoja saat lukemalla',
    privacyPolicy: 'Tietosuojakäytäntömme',
    decline: 'HYLKÄÄ',
    accept: 'HYVÄKSY',
  },
  fr: {
    title: 'Nous respectons votre vie privée',
    description:
      'Ce site utilise des cookies pour améliorer votre expérience de navigation, analyser le trafic et mémoriser vos préférences. Pour en savoir plus, veuillez lire notre',
    privacyPolicy: 'Politique de confidentialité',
    decline: 'REFUSER',
    accept: 'ACCEPTER',
  },
  de: {
    title: 'Wir respektieren Ihre Privatsphäre',
    description:
      'Diese Website verwendet Cookies, um Ihr Surferlebnis zu verbessern, den Datenverkehr zu analysieren und Ihre Einstellungen zu speichern. Weitere Informationen finden Sie in unserer',
    privacyPolicy: 'Datenschutzrichtlinie',
    decline: 'ABLEHNEN',
    accept: 'AKZEPTIEREN',
  },
}

export default cookieTranslations
