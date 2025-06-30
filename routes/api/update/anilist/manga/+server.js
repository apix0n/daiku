import { fetchMangaData } from "$lib/server/anilist/mangaData.js";
import { accounts, config } from "$lib/server/config.js";
import { json } from '@sveltejs/kit';
import { setValue } from "$lib/server/redisInteractions.js";
import { cacheStore } from "$lib/server/stores/cache.js";

export async function GET({ request, url }) {
    try {
        let data = await fetchMangaData(accounts.anilistId);
        await setValue("manga", data);
        cacheStore.set("manga", {
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