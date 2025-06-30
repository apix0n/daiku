import { fetchMangaCollection } from "$lib/server/mangacollec/mangaCollection";
import { json } from "@sveltejs/kit";
import { accounts } from "$lib/server/config.js";
import { setValue } from "$lib/server/redisInteractions";
import { cacheStore } from "$lib/server/stores/cache.js";

export async function GET({ request, url }) {
    try {
        let data = await fetchMangaCollection(accounts.mangacollecUsername);
        await setValue("mangaCollection", data);
        cacheStore.set("mangaCollection", { data });
        return json({ success: true });
    } catch (error) {
        console.error(error);
        return json({
            success: false,
        }, { status: 500 });
    }
}