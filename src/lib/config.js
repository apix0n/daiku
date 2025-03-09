import { env } from "$env/dynamic/public"

export const clientConfig = {
    defaultMangaLang: env.DAIKU_DEFAULT_MANGA_LANG ?? "en"
}