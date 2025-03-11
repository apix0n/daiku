import { json } from '@sveltejs/kit';
import { getValue } from "$lib/server/redisInteractions";
import { config, secrets } from '$lib/server/config';

console.log("anilist movies | initialised cache")
const cache = {
    maxTimestamp: null,
    data: null
}

export async function GET({ request, url }) {
    const authHeader = request.headers.get("authorization")
    if (url.searchParams.has("clear") && (secrets.apiAuthKey && authHeader === `Bearer ${secrets.apiAuthKey}`)) {
        cache.maxTimestamp = null;
        cache.data = null;
        console.log("anilist movies | cleared cache")
        return json({ cleared: true })
    }

    const time = Date.now()

    if ((cache.maxTimestamp && cache.data) && time < cache.maxTimestamp) {
        console.log("anilist movies | found & served cache")
        return json(cache.data)
    }

    try {
        const data = await getValue("alMovies");
        // Vérifier si le cache existe avant d'accéder à updatedAt
        if (!cache.data || new Date(cache.data.updatedAt) < time) {
            cache.maxTimestamp = time + (config.apiCacheTime * 1000);
            cache.data = data;
        }
        console.log("anilist movies | fetched & served from db")
        return json(data)
    } catch (error) {
        console.error(error)
        return json({
            success: false
        }, { status: 500 });
    }
}