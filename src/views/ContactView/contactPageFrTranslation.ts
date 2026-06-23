// Hardcoded French fallback for the contact page.
// Actual data fields (phone, email, address, map coordinates) are left empty
// so they are always taken from Strapi when available.
const contactPageFrTranslation = {
  title: 'Contactez-nous',
  description: 'Nous sommes là pour vous aider. N\'hésitez pas à nous contacter pour toute question.',
  buttonText: 'Envoyer',
  contactForm: {
    firstNamePlaceholder: 'Prénom',
    lastNamePlaceholder: 'Nom de famille',
    mailPlaceholder: 'Adresse e-mail',
    phonePlaceholder: 'Numéro de téléphone',
    messagePlaceholder: 'Votre message',
    firstNameErrorText: 'Veuillez entrer votre prénom',
    lastNameErrorText: 'Veuillez entrer votre nom de famille',
    mailErrorText: 'Veuillez entrer un e-mail valide',
    phoneErrorText: 'Numéro de téléphone invalide',
    messageErrorText: 'Veuillez entrer votre message',
    checkboxText: "J'accepte la",
    policyText: 'Politique de confidentialité',
    policyErrorText: 'Veuillez accepter la politique de confidentialité',
  },
  getInTouchBlock: {
    title: 'Nous contacter',
    description: 'Notre équipe est disponible pour répondre à toutes vos questions.',
    phoneText: 'Téléphone',
    unquiriesText: 'Demandes',
    supportText: 'Support',
    addressText: 'Adresse',
    hoursText: "Heures d'ouverture",
  },
}

export default contactPageFrTranslation
