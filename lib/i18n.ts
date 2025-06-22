import { getLocaleFromNavigator, init, register } from 'svelte-i18n'
import { browser } from '$app/environment'
import * as cookie from 'cookie'

export const locales = {
    'en-GB': ['English', 'en'],
    'fr': ['Français', 'fr'],
    'tr': ['Türkçe', 'tr'],
}

export const defaultLocale = 'en-GB'

function registerLocales() {
    if (!browser) return

    Object.entries(locales).forEach(([locale, value]) => {
        const [name, fileName] = value
        register(locale, () => import(`$locales/${fileName}.json`))
        console.log(`i18n | registered ${name} (${locale})`)
    })
}

function getLanguagePreference() {
    if (!browser) return defaultLocale

    const cookies = cookie.parse(document.cookie)
    const uiLanguage = cookies.uiLanguage

    if (!uiLanguage || uiLanguage === '_system') {
        console.log('i18n | using browser language')
        return getLocaleFromNavigator()
    }

    console.log('i18n | using language preference:', uiLanguage)
    return uiLanguage
}

if (browser) {
    registerLocales()

    init({
        fallbackLocale: defaultLocale,
        initialLocale: getLanguagePreference(),
    })
}
