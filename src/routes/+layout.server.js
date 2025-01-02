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

// Define a cache object 
let cache = {};
let anilistCacheExpiration = 5 * 60 * 1000; // 5 minutes -- minutes to seconds to milliseconds
let mangacollecCacheExpiration = 120 * 60 * 1000; // 120 minutes -- minutes to seconds to milliseconds
let letterboxdCacheExpiration = 6 * 60 * 60 * 1000; // 6 hours -- minutes to seconds to milliseconds

export async function load({ fetch }) {
    const anilistUsername = 'replacethis';
    const mangacollecUsername = 'replacethis';
    const letterboxdUsername = 'replacethis';

    const now = new Date();

    let animeData, mangaData, plannedData, mangaCollection, watchedMovies, watchedAnimeMovies, recentActivity, watchedMoviesFinal;

    // Check if anilistUserId is cached
    if (!cache.anilistUserId) {
        cache.anilistUserId = await getUserId(anilistUsername);
    }
    const anilistUserId = cache.anilistUserId;

    // Check if cached data exists and is still valid 
    if (cache.animeData && cache.mangaData && cache.plannedData && (now - cache.anilistTimestamp < anilistCacheExpiration)) {
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

    if (cache.mangaCollection && (now - cache.mangacollecTimestamp < mangacollecCacheExpiration)) {
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

    if (cache.watchedMovies && (now - cache.letterboxdTimestamp < letterboxdCacheExpiration)) {
        console.log("[letterboxd] -- served cached data -----");
        watchedMovies = cache.watchedMovies;
    } else {
        try {
            watchedMovies = await fetchWatchedMovies(letterboxdUsername);

            if (watchedMovies) {
                console.log("[letterboxd] -- fetched & cached new data -----");
                cache.watchedMovies = watchedMovies;
                cache.letterboxdTimestamp = now;
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

    if (cache.watchedAnimeMovies && (now - cache.anilistMoviesTimestamp < anilistCacheExpiration)) {
        console.log("[alMovies] ---- served cached data -----");
        watchedAnimeMovies = cache.watchedAnimeMovies;
    } else {
        try {
            watchedAnimeMovies = await fetchWatchedAnimeMovies(anilistUsername);

            if (watchedAnimeMovies) {
                console.log("[alMovies] ---- fetched & cached new data -----");
                cache.watchedAnimeMovies = watchedAnimeMovies;
                cache.anilistMoviesTimestamp = now;
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

    try {
        const recentActivityDate = new Date(now.getTime());
        recentActivityDate.setHours(0, 0, 0, 0);
        const recentActivityThreshold = Math.floor(recentActivityDate.getTime() / 1000) - 6 * 24 * 60 ** 2; // So it fetches the 6 previous days, including all data from today 
        recentActivity = await fetchRecentActivity(anilistUserId, recentActivityThreshold);
        recentActivity = allRecentActivity(recentActivity, mangaCollection, watchedMoviesFinal, recentActivityThreshold)
    } catch (error) {
        console.error("[alActivity] -- Error fetching recent activity:", error);
        recentActivity = []; // Set to null if there's an error
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