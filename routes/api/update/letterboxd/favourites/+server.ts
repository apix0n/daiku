import { makeBoxdFavouritesList } from "$lib/server/letterboxd/userLikes";
import { accounts } from "$lib/server/config.js";
import { json } from '@sveltejs/kit';
import { setValue } from "$lib/server/redisInteractions.js";
import { cacheStore } from "$lib/server/stores/cache.js";

export async function GET({ request, url }) {
    try {
        let data = await makeBoxdFavouritesList(accounts.letterboxdLid);
        await setValue("lbFavourites", data);
        cacheStore.set("lbFavourites", { data });
        return json({ success: true });
    } catch (error) {
        console.error(error);
        return json({
            success: false
        }, { status: 500 });
    }
}