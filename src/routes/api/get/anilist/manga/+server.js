import { fetchMangaData } from "$lib/server/anilist/mangaData";
import { json } from '@sveltejs/kit';
import { getValue } from "$lib/server/redisInteractions.js";
import { config, accounts } from "$lib/server/config.js";

console.log("anilist manga | initialised cache")
const cache = {
    maxTimestamp: null,
    data: null
}

export async function GET() {
    const time = Date.now()

    if ((cache.maxTimestamp && cache.data) && time < cache.maxTimestamp) {
        console.log("anilist manga | found & served cache")
        return json(cache.data)
    }

    try {
        let data;
        data = await fetchMangaData(accounts.anilistId);
        cache.maxTimestamp = time + (config.alCacheTime * 1000);
        cache.data = data;
        console.log("anilist manga | updated & served new cache")
        return json(data);
    } catch (error) {
        try {
            const data = await getValue("manga");
            // Vérifier si le cache existe avant d'accéder à updatedAt
            if (!cache.data || new Date(cache.data.updatedAt) < time) {
                cache.maxTimestamp = time + (config.alCacheTime * 1000);
                cache.data = data;
            }
            console.log("anilist manga | error fetching, served from db")
            return json(data)
        } catch (error) {
            console.error(error)
            return json({
                success: false
            }, { status: 500 });
        }
    }
}