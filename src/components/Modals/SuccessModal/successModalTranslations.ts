interface SuccessModalData {
  title: string
  description: string
  button: string
}

const successModalTranslations: Record<string, SuccessModalData> = {
  en: {
    title: 'Thanks for your interest!',
    description:
      'One of our team members will carefully review your request and get back to you as soon as possible with all the necessary information.',
    button: 'Continue to discover',
  },
  es: {
    title: '¡Gracias por tu interés!',
    description:
      'Uno de los miembros de nuestro equipo revisará cuidadosamente tu solicitud y se pondrá en contacto contigo lo antes posible con toda la información necesaria.',
    button: 'Continuar explorando',
  },
  fi: {
    title: 'Kiitos kiinnostuksestasi!',
    description:
      'Yksi tiimimme jäsenistä käy huolellisesti läpi pyyntösi ja ottaa sinuun yhteyttä mahdollisimman pian kaikkine tarvittavine tietoineen.',
    button: 'Jatka tutustumista',
  },
  fr: {
    title: 'Merci de votre intérêt !',
    description:
      'Un membre de notre équipe examinera attentivement votre demande et vous recontactera dans les plus brefs délais avec toutes les informations nécessaires.',
    button: 'Continuer à découvrir',
  },
  de: {
    title: 'Vielen Dank für Ihr Interesse!',
    description:
      'Eines unserer Teammitglieder wird Ihre Anfrage sorgfältig prüfen und sich so schnell wie möglich mit allen notwendigen Informationen bei Ihnen melden.',
    button: 'Weiter entdecken',
  },
}

export default successModalTranslations
