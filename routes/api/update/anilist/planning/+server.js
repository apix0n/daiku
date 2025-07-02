import { fetchPlannedData } from "$lib/server/anilist/planned";
import { accounts } from "$lib/server/config.js";
import { json } from '@sveltejs/kit';
import { setValue } from "$lib/server/redisInteractions";
import { cacheStore } from "$lib/server/stores/cache.js";

export async function GET({ request, url }) {
    try {
        let data = await fetchPlannedData(accounts.anilistId);
        await setValue("alPlanning", data);
        cacheStore.set("alPlanning", { data });
        cacheStore.clear("planned");
        return json({ success: true });
    } catch (error) {
        console.error(error)
        return json({
            success: false
        }, { status: 500 });
    }
}