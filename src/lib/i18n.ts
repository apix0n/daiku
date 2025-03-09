import { getLocaleFromNavigator, init, register } from 'svelte-i18n'

export const defaultLocale = 'en'

register('en', () => import('../locales/en.json'))
register('fr', () => import('../locales/fr.json'))
register('tr', () => import('../locales/tr.json'))

init({
    fallbackLocale: defaultLocale,
    initialLocale: getLocaleFromNavigator(),
})