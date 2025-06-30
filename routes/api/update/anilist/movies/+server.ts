import { fetchWatchedAnimeMovies } from "$lib/server/anilist/watchedMovies.js";
import { accounts } from "$lib/server/config.js";
import { json } from '@sveltejs/kit';
import { replaceByTmdb } from "$lib/server/tmdb/replaceByTmdb";
import { setValue } from "$lib/server/redisInteractions";
import { cacheStore } from "$lib/server/stores/cache";

export async function GET({ request, url }) {
    try {
        if (typeof accounts.anilistId !== "number") throw new Error("Anilist ID is not set or is not a number");
        const alData = await fetchWatchedAnimeMovies(accounts.anilistId);
        const tmdbData = await replaceByTmdb(alData.watched);
        const data = {
            ...alData,
            watched: tmdbData,
        }
        await setValue("alMovies", data);
        cacheStore.set("alMovies", { data });
        cacheStore.clear("movies");
        return json({ success: true });
    } catch (error) {
        console.error(error);
        return json({
            success: false
        }, { status: 500 });
    }
}