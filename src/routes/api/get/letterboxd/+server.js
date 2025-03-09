import { json } from '@sveltejs/kit';
import { getValue } from "$lib/server/redisInteractions";
import { config } from '$lib/server/config';

console.log("letterboxd | initialised cache")
const cache = {
    maxTimestamp: null,
    data: null
}

export async function GET() {
    const time = Date.now()

    if ((cache.maxTimestamp && cache.data) && time < cache.maxTimestamp) {
        console.log("letterboxd | found & served cache")
        return json(cache.data)
    }

    try {
        const data = await getValue("lbMovies");
        // Vérifier si le cache existe avant d'accéder à updatedAt
        if (!cache.data || new Date(cache.data.updatedAt) < time) {
            cache.maxTimestamp = time + (config.apiCacheTime * 1000);
            cache.data = data;
        }
        console.log("letterboxd | fetched & served from db")
        return json(data)
    } catch (error) {
        console.error(error)
        return json({
            success: false
        }, { status: 500 });
    }
}