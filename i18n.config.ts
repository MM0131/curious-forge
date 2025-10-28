import th from './i18n/locales/th.json'
import en from './i18n/locales/en.json'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'th',
  messages: {
    th,
    en
  }
}))
