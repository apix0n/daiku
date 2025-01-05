/** @type {import('./$types').PageServerLoad} */

import { fetchAnimeData } from '$lib/server/anilist/animeData.js';
import { fetchMangaData } from '$lib/server/anilist/mangaData.js';
import { fetchPlannedData } from '$lib/server/anilist/planned.js';
import { fetchMangaCollection } from '$lib/server/mangacollec/mangaCollection.js';
import { fetchWatchedMovies } from '$lib/server/letterboxd/watchedMovies.js';
import { getUserId } from '$lib/server/anilist/global';
import { fetchRecentActivity } from '$lib/server/anilist/recentActivity.js';
import { fetchWatchedAnimeMovies } from '$lib/server/anilist/watchedMovies';
import { combineMoviesLists } from '$lib/server/combineMoviesLists';
import { replaceByTmdb } from '$lib/server/tmdb/replaceByTmdb';
import { allRecentActivity } from '$lib/server/allRecentActivity';

import { KV_REST_API_URL, KV_REST_API_TOKEN } from "$env/static/private";
import { Redis } from '@upstash/redis';
import { version } from '$app/environment';

// Initialize Redis
const redis = version !== "dev" ? new Redis({
    url: KV_REST_API_URL || "",
    token: KV_REST_API_TOKEN || ""
}) : null;

// Define a cache object 
let cache = redis ? await redis.get('cache') || {} : {};
let anilistCacheExpiration = 5 * 60 * 1000; // 5 minutes -- minutes to seconds to milliseconds
let mangacollecCacheExpiration = 120 * 60 * 1000; // 120 minutes -- minutes to seconds to milliseconds
let letterboxdCacheExpiration = 6 * 60 * 60 * 1000; // 6 hours -- minutes to seconds to milliseconds

const anilistUsername = 'replacethis';
const mangacollecUsername = 'replacethis';
const letterboxdUsername = 'replacethis';

export async function load({ fetch }) {
    const now = new Date();

    let animeData, mangaData, plannedData, mangaCollection, watchedMovies, watchedAnimeMovies, recentActivity, watchedMoviesFinal;

    // Check if anilistUserId is cached
    if (!cache.anilistUserId) {
        cache.anilistUserId = await getUserId(anilistUsername);
        if (redis) await redis.set(cacheKey, cache);
    }
    const anilistUserId = cache.anilistUserId;

    // Check if cached data exists and is still valid 
    if (cache.animeData && cache.mangaData && cache.plannedData && (now - new Date(cache.anilistTimestamp) < anilistCacheExpiration)) {
        console.log("[anilist] ----- served cached data -----");
        animeData = cache.animeData;
        mangaData = cache.mangaData;
        plannedData = cache.plannedData;
    } else {
        try {
            // Fetch new data for anilist
            animeData = await fetchAnimeData(anilistUsername);
            mangaData = await fetchMangaData(anilistUsername);
            plannedData = await fetchPlannedData(anilistUsername);

            if (animeData && mangaData && plannedData) {
                console.log("[anilist] ----- fetched & cached new data -----");
                cache.animeData = animeData;
                cache.mangaData = mangaData;
                cache.plannedData = plannedData;
                cache.anilistTimestamp = now;
                if (redis) await redis.set(cacheKey, cache);
            }
        } catch (error) {
            console.error('Error fetching anilist data:', error);
            if (cache.animeData && cache.mangaData && cache.plannedData) {
                console.log("[anilist] ----- error in fetching data, served cached instead -----");
                animeData = cache.animeData;
                mangaData = cache.mangaData;
                plannedData = cache.plannedData;
            } else {
                throw error;
            }
        }
    }

    if (cache.mangaCollection && (now - new Date(cache.mangacollecTimestamp) < mangacollecCacheExpiration)) {
        console.log("[mangacollec] - served cached data -----");
        mangaCollection = cache.mangaCollection;
    } else {
        try {
            // Fetch new data for mangacollec
            mangaCollection = await fetchMangaCollection(mangacollecUsername);

            if (mangaCollection) {
                console.log("[mangacollec] - fetched & cached new data -----");
                cache.mangaCollection = mangaCollection;
                cache.mangacollecTimestamp = now;
                if (redis) await redis.set(cacheKey, cache);
            }
        } catch (error) {
            console.error('Error fetching mangacollec data:', error);
            if (cache.mangaCollection) {
                console.log("[mangacollec] - error in fetching data, served cached instead -----");
                mangaCollection = cache.mangaCollection;
            } else {
                throw error;
            }
        }
    }

    if (cache.watchedMovies && (now - new Date(cache.letterboxdTimestamp) < letterboxdCacheExpiration)) {
        console.log("[letterboxd] -- served cached data -----");
        watchedMovies = cache.watchedMovies;
    } else {
        try {
            watchedMovies = await fetchWatchedMovies(letterboxdUsername);

            if (watchedMovies) {
                console.log("[letterboxd] -- fetched & cached new data -----");
                cache.watchedMovies = watchedMovies;
                cache.letterboxdTimestamp = now;
                if (redis) await redis.set(cacheKey, cache);
            }
        } catch (error) {
            console.error('Error fetching letterboxd data:', error);
            if (cache.watchedMovies) {
                console.log("[letterboxd] -- error in fetching data, served cached instead -----");
                watchedMovies = cache.watchedMovies;
            } else {
                throw error;
            }
        }
    }

    if (cache.watchedAnimeMovies && (now - new Date(cache.anilistMoviesTimestamp) < letterboxdCacheExpiration)) {
        console.log("[alMovies] ---- served cached data -----");
        watchedAnimeMovies = cache.watchedAnimeMovies;
    } else {
        try {
            watchedAnimeMovies = await fetchWatchedAnimeMovies(anilistUsername);

            if (watchedAnimeMovies) {
                console.log("[alMovies] ---- fetched & cached new data -----");
                cache.watchedAnimeMovies = watchedAnimeMovies;
                cache.anilistMoviesTimestamp = now;
                if (redis) await redis.set(cacheKey, cache);
            }
        } catch (error) {
            console.error('Error fetching anilist movie data:', error);
            if (cache.watchedAnimeMovies) {
                console.log("[alMovies] ---- error in fetching data, served cached instead -----");
                watchedAnimeMovies = cache.watchedAnimeMovies;
            } else {
                throw error;
            }
        }
    }

    try {
        watchedMoviesFinal = await replaceByTmdb(combineMoviesLists(watchedMovies, watchedAnimeMovies));
    } catch (error) {
        watchedMoviesFinal = combineMoviesLists(watchedMovies, watchedAnimeMovies)
    }
    
    const recentActivityDate = new Date(now.getTime());
    recentActivityDate.setHours(0, 0, 0, 0);
    const recentActivityThreshold = Math.floor(recentActivityDate.getTime() / 1000) - 6 * 24 * 60 ** 2; // So it fetches the 6 previous days, including all data from today 
    
    try {
        recentActivity = await fetchRecentActivity(anilistUserId, recentActivityThreshold);
        cache.recentActivity = recentActivity;
        console.log("[alActivity] -- fetched recent activity -----")
        if (redis) await redis.set(cacheKey, cache);
        recentActivity = allRecentActivity(recentActivity, mangaCollection, watchedMoviesFinal, recentActivityThreshold)
    } catch (error) {
        console.error("[alActivity] -- Error fetching recent activity:", error);
        recentActivity = cache.recentActivity || []; // Set to null if there's an error
        recentActivity = allRecentActivity(recentActivity, mangaCollection, watchedMoviesFinal, recentActivityThreshold)
    }

    return await {
        animeData,
        mangaData,
        plannedData,
        mangaCollection,
        watchedMovies: watchedMoviesFinal,
        recentActivity,
    };
};