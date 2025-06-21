import { json } from '@sveltejs/kit';
import { getValue } from "$lib/server/redisInteractions";
import { secrets } from '$lib/server/config';
import { cacheStore } from "$lib/server/stores/cache.js";

const CACHE_KEY = "lbMovies";

export async function GET({ request, url }) {
    const cached = cacheStore.get(CACHE_KEY);
    if (cached?.data) {
        console.log("letterboxd movies | found & served cache");
        return json(cached.data);
    }

    try {
        const data = await getValue("lbMovies");
        cacheStore.set(CACHE_KEY, { maxTimestamp: 0, data });
        console.log("letterboxd movies | fetched & served from db");
        return json(data);
    } catch (error) {
        console.error(error);
        return json({ success: false }, { status: 500 });
    }
}