export const supportedLocales = ['en', 'es', 'fr', 'de', 'fi'] as const;
export type SupportedLocale = typeof supportedLocales[number];
export const defaultLocale = 'en';
