import { createI18n } from 'vue-i18n'
import fr from './locales/fr'
import ht from './locales/ht'

// Get saved language from localStorage, défaut: français
const savedLocale = localStorage.getItem('locale')
const defaultLocale = (savedLocale === 'fr' || savedLocale === 'ht') ? savedLocale : 'fr'

const i18n = createI18n({
    legacy: false,
    locale: defaultLocale,
    fallbackLocale: 'fr',
    messages: {
        fr,
        ht,
    },
})

export default i18n
