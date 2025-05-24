import  * as privateEnv from '$env/static/private';
import * as publicEnv from '$env/static/public';

const env = { ...publicEnv, ...privateEnv };

export let config = {
    apiCacheTime: parseInt(env.DAIKU_API_CACHE_TIME) || 1800,
    alCacheTime: parseInt(env.DAIKU_ANILIST_CACHE_TIME) || 300,
    alLangRegex: env.DAIKU_ANILIST_LANG_REGEX ?? "lang:([^\s]+)",
    apiAuthKeyVariable: env.DAIKU_API_AUTH_KEY_VARIABLE || undefined,
    defaultTmdbLang: env.DAIKU_DEFAULT_TMDB_LANG || 'en-GB',
    pauseAfterDays: parseInt(env.DAIKU_PAUSE_AFTER_DAYS) || 30,
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