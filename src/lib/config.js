import { env } from "$env/dynamic/public"

export const clientConfig = {
    defaultMangaLang: env.DAIKU__DEFAULT_MANGA_LANG ?? "en"
}