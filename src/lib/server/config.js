import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import {getContrastYIQ} from "$lib/contrastColor"

const env = { ...publicEnv, ...privateEnv };

export let config = {
    apiCacheTime: parseInt(env.DAIKU_API_CACHE_TIME) || 1800,
    alCacheTime: parseInt(env.DAIKU_ANILIST_CACHE_TIME) || 300,
    alLangRegex: env.DAIKU_ANILIST_LANG_REGEX ?? "lang:([^\s]+)",
    appAccent: env.DAIKU_APP_ACCENT || "#e8794e",
    appAccentContrast: getContrastYIQ(env.DAIKU_APP_ACCENT || "#000"),
    appAccentDark: env.DAIKU_APP_ACCENT_SECOND || "#62544e",
    appAccentDarkContrast: getContrastYIQ(env.DAIKU_APP_ACCENT_SECOND || "#fff"),
    apiAuthKeyVariable: env.DAIKU_API_AUTH_KEY_VARIABLE || undefined,
    alternativesBaseUrl: env.DAIKU_ALTERNATIVES_BASE_URL || undefined,
    defaultTmdbLang: env.DAIKU_DEFAULT_TMDB_LANG || 'en-GB',
};

export let accounts = {
    anilistId: env.ANILIST_ID ? parseInt(env.ANILIST_ID) : null,
    mangacollecUsername: env.MANGACOLLEC_USERNAME ?? null,
    letterboxdUsername: env.LETTERBOXD_USERNAME ?? null,
};

export let secrets = {
    tmdbApiKey: env.TMDBAPIKEY ?? null,
    apiAuthKey: env[config.apiAuthKeyVariable] || undefined
};