import { fetchAnimeData } from "$lib/server/anilist/animeData";
import { json } from '@sveltejs/kit';
import { getValue } from "$lib/server/redisInteractions.js";
import { config, accounts, secrets } from "$lib/server/config.js";
import { cacheStore } from "$lib/server/stores/cache";

const CACHE_KEY = "anime";

export async function GET({ request, url }) {
    const now = Date.now();

    if (cacheStore.isFresh(CACHE_KEY, now)) {
        console.log("anilist anime | found & served cache");
        return json(cacheStore.get(CACHE_KEY)?.data);
    }
    
    try {
        const data = await fetchAnimeData(accounts.anilistId);
        cacheStore.updateWithTTL(CACHE_KEY, data, config.alCacheTime * 1000);
        console.log("anilist anime | updated & served new cache");
        return json(data);
    } catch (error) {
        try {
            const data = await getValue("anime");
            const existing = cacheStore.get(CACHE_KEY);
            const updatedAt = new Date(data?.updatedAt ?? 0).getTime();
            const prevUpdatedAt = new Date(existing?.data?.updatedAt ?? 0).getTime();

            if (!existing?.data || prevUpdatedAt < updatedAt) {
                cacheStore.updateWithTTL(CACHE_KEY, data, config.alCacheTime * 1000);
            }

            console.log("anilist anime | error fetching, served from db");
            return json(data);
        } catch (error) {
            console.error(error);
            return json({ updatedAt: null, watched: [], current: [], dropped: [] }, { status: 500 });
        }
    }
}