import { json } from '@sveltejs/kit';
import { getValue } from "$lib/server/redisInteractions";
import { cacheStore } from "$lib/server/stores/cache.js";
import { combineMoviesLists, mergeMovieIds } from '$lib/server/utils/combineMoviesLists';

const CACHE_KEY = "movies";

export async function GET({ request, url }) {
    const cached = cacheStore.get(CACHE_KEY);
    if (cached?.data) {
        console.log("movies | found & served cache");
        return json(cached.data);
    }

    try {
        const [letterboxdData, anilistData] = await Promise.all([
            await getValue("lbMovies"),
            await getValue("alMovies"),
        ]);

        const combinedLists = combineMoviesLists(letterboxdData, anilistData)
        const data = {
            ...combinedLists,
            watched: mergeMovieIds(combinedLists.watched),
        };
        cacheStore.set(CACHE_KEY, { maxTimestamp: 0, data });
        console.log("movies | fetched & served from db");
        return json(data);
    } catch (error) {
        console.error(error);
        return json({ success: false }, { status: 500 });
    }
}