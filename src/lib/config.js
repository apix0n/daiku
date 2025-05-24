import * as env from "$env/static/public"
import { getContrastYIQ } from "$lib/utils/contrastColor"

export const config = {
    defaultMangaLang: env.DAIKU__DEFAULT_MANGA_LANG ?? "en",
    alternativesBaseUrl: env.DAIKU__ALTERNATIVES_BASE_URL || undefined,
    appAccent: env.DAIKU__APP_ACCENT || "#e8794e",
    appAccentContrast: getContrastYIQ(env.DAIKU__APP_ACCENT || "#000"),
    appAccentDark: env.DAIKU__APP_ACCENT_SECOND || "#62544e",
    appAccentDarkContrast: getContrastYIQ(env.DAIKU__APP_ACCENT_SECOND || "#fff"),
}