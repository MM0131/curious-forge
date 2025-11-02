import th from './i18n/locales/th.json'
import en from './i18n/locales/en.json'

export default defineI18nConfig(() => ({
  legacy: false,
  // Switch default locale to English
  locale: 'en',
  fallbackLocale: 'en',
  messages: { th, en }
}))
