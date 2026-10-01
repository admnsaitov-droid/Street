export interface SameLineProductsData {
    title: { textFirst: string; textSecond: string }
    button: { text: string }
}

// Hardcoded, localized copy for the "Explore the Line" block on the product page.
const sameLineProductsTranslations: Record<string, SameLineProductsData> = {
    en: {
        title: { textFirst: 'Explore', textSecond: 'the Line' },
        button: { text: 'View the line' },
    },
    fi: {
        title: { textFirst: 'Tutustu', textSecond: 'sarjaan' },
        button: { text: 'Katso sarja' },
    },
    de: {
        title: { textFirst: 'Entdecke', textSecond: 'die Serie' },
        button: { text: 'Serie ansehen' },
    },
    es: {
        title: { textFirst: 'Explora', textSecond: 'la Línea' },
        button: { text: 'Ver la línea' },
    },
    fr: {
        title: { textFirst: 'Explorez', textSecond: 'la Gamme' },
        button: { text: 'Voir la gamme' },
    },
}

export const getSameLineProductsTranslations = (locale?: string): SameLineProductsData =>
    sameLineProductsTranslations[locale ?? 'en'] ?? sameLineProductsTranslations.en

export default sameLineProductsTranslations
