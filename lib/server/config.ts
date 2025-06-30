import  * as privateEnv from '$env/static/private';
import * as publicEnv from '$env/static/public';

const env: Record<string, string | undefined> = { ...publicEnv, ...privateEnv };

export let config = {
    apiCacheTime: parseInt(env.DAIKU_API_CACHE_TIME ?? '0') || 1800,
    alCacheTime: parseInt(env.DAIKU_ANILIST_CACHE_TIME ?? '0') || 300,
    alLangRegex: env.DAIKU_ANILIST_LANG_REGEX ?? "lang:([^\\s]+)",
    lastChapterServiceRegex: env.DAIKU_LAST_CHAPTER_REGEX ?? "lmc:([^\\s]+)",
    apiAuthKeyVariable: env.DAIKU_API_AUTH_KEY_VARIABLE || undefined,
    defaultTmdbLang: env.DAIKU_DEFAULT_TMDB_LANG || 'en-GB',
    pauseAfterDays: parseInt(env.DAIKU_PAUSE_AFTER_DAYS ?? '0') || 60,
};

export let accounts = {
    anilistId: env.ANILIST_ID ? parseInt(env.ANILIST_ID ?? '0') : null,
    mangacollecUsername: env.MANGACOLLEC_USERNAME ?? null,
    letterboxdUsername: env.LETTERBOXD_USERNAME ?? null,
    letterboxdLid: env.LETTERBOXD_LID ?? null,
};

export let secrets = {
    tmdbApiKey: env.TMDBAPIKEY ?? null,
    apiAuthKey: config.apiAuthKeyVariable ? env[config.apiAuthKeyVariable] : undefined
};

export let urls = {
    lmc: env.LMC_URL ?? null,
}