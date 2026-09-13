import { createI18n } from 'vue-i18n'
import fr from './locales/fr'
import en from './locales/en'

let savedLocale = localStorage.getItem('userLanguage') || 'fr'
if (savedLocale !== 'fr' && savedLocale !== 'en') {
  savedLocale = savedLocale.startsWith('en') ? 'en' : 'fr'
}

const i18n = createI18n({
    legacy: false,
    locale: savedLocale,
    fallbackLocale: 'fr',
    messages: {
        fr,
        en,
    },
})

export default i18n
