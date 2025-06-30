import { fetchFavouritesData } from "$lib/server/anilist/userFavourites.js"
import { accounts } from "$lib/server/config.js";
import { json } from '@sveltejs/kit';
import { setValue } from "$lib/server/redisInteractions";
import { cacheStore } from "$lib/server/stores/cache.js";

export async function GET({ request, url }) {
    try {
        let data = await fetchFavouritesData(accounts.anilistId);
        await setValue("favourites", data);
        cacheStore.set("favourites", { data })
        return json({ success: true });
    } catch (error) {
        console.error(error)
        return json({
            success: false
        }, { status: 500 });
    }
}