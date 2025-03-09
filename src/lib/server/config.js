import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

const env = { ...publicEnv, ...privateEnv };

export let config = {
    apiCacheTime: parseInt(env.DAIKU_API_CACHE_TIME) || 1800,
    alCacheTime: parseInt(env.DAIKU_ANILIST_CACHE_TIME) || 300,
    mangaLangRegex: env.DAIKU_REGEX_MANGA_LANGUAGE ?? "lang:([^\s]+)",
    appAccent: env.DAIKU_APP_ACCENT || "#e8794e",
    appAccentDark: env.DAIKU_APP_ACCENT_SECOND || "#62544e"
};

export let accounts = {
    anilistId: env.ANILIST_ID ? parseInt(env.ANILIST_ID) : null,
    mangacollecUsername: env.MANGACOLLEC_USERNAME ?? null,
    letterboxdUsername: env.LETTERBOXD_USERNAME ?? null,
};

export let secrets = {
    tmdbApiKey: env.TMDBAPIKEY ?? null
};