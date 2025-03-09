import { fetchRecentActivity } from "$lib/server/anilist/recentActivity";
import { accounts } from "$lib/server/config.js";
import { json } from "@sveltejs/kit";
import { config } from '$lib/server/config';

console.log("anilist activity | initialised cache")
const cache = {
    maxTimestamp: null,
    data: null
}

export async function GET({ params }) {
    const { threshold } = await params;
    const time = Date.now()

    if ((cache.maxTimestamp && cache.data) && time < cache.maxTimestamp) {
        console.log("anilist activity | found & served cache")
        return json(cache.data)
    }

    try {
        const recentActivity = await fetchRecentActivity(accounts.anilistId, threshold);
        // Vérifier si le cache existe avant d'accéder à updatedAt
        if (!cache.data) {
            cache.maxTimestamp = time + (config.alCacheTime * 1000);
            cache.data = recentActivity;
        }
        console.log("anilist activity | updated & served new cache")
        return json(recentActivity)
    } catch (error) {
        console.error(error)
        return json({
            success: false
        }, { status: 500 });
    }
}