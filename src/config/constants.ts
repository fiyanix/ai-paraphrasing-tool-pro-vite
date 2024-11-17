export const MAX_WORDS = 1000;
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' }
] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number]['code'];