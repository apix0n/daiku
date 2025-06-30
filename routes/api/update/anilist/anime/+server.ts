import { fetchAnimeData } from "$lib/server/anilist/animeData";
import { accounts, config } from "$lib/server/config.js";
import { json } from '@sveltejs/kit';
import { setValue } from "$lib/server/redisInteractions.js";
import { cacheStore } from "$lib/server/stores/cache.js";

export async function GET({ request, url }) {
    try {
        if (typeof accounts.anilistId !== "number") throw new Error("Anilist ID is not set or is not a number");
        let data = await fetchAnimeData(accounts.anilistId, false);
        await setValue("anime", data);
        cacheStore.set("anime", {
            maxTimestamp: Date.now() + config.alCacheTime * 1000,
            data,
        });
        return json({ success: true });
    } catch (error) {
        console.error(error)
        return json({
            success: false
        }, { status: 500 });
    }
}