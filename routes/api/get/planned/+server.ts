import { json } from '@sveltejs/kit';
import { getValue } from "$lib/server/redisInteractions";
import { cacheStore } from "$lib/server/stores/cache.js";
import { combineMoviesLists } from '$lib/server/utils/combineMoviesLists';
import type { PlannedRequest } from '$lib/types/requests';

const CACHE_KEY = "planned";

export async function GET({ request, url }) {
    const cached = cacheStore.get(CACHE_KEY);
    if (cached?.data) {
        console.log("planned | found & served cache");
        return json(cached.data);
    }

    try {
        const [letterboxdData, anilistData] = await Promise.all([
            getValue("lbWatchlist"),
            getValue("alPlanning"),
        ]) as [PlannedRequest, PlannedRequest];

        const movieData = combineMoviesLists({ ...anilistData, watched: anilistData.movies }, { ...letterboxdData, watched: letterboxdData.movies });
        const data = {
            ...letterboxdData,
            ...anilistData,
            updatedAt: movieData.updatedAt,
            movies: movieData.watched
        }
        cacheStore.set(CACHE_KEY, { maxTimestamp: 0, data });
        console.log("planned | fetched & served from db");
        return json(data);
    } catch (error) {
        console.error(error);
        return json({ success: false }, { status: 500 });
    }
}