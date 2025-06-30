import { json } from '@sveltejs/kit';
import { replaceByTmdb } from "$lib/server/tmdb/replaceByTmdb";
import { accounts } from "$lib/server/config.js";
import { setValue } from "$lib/server/redisInteractions";
import { boxdWatchedMovies } from "$lib/server/letterboxd/watchedMovies";
import { cacheStore } from '$lib/server/stores/cache';

export async function GET({ request, url }) {
    try {
        const boxdData = await boxdWatchedMovies(accounts.letterboxdLid)
        const tmdbData = await replaceByTmdb(boxdData.watched);
        const data = {
            ...boxdData,
            watched: tmdbData
        }
        await setValue("lbMovies", data);
        cacheStore.set("lbMovies", { data });
        cacheStore.clear("movies");
        return json({ success: true });
    } catch (error) {
        console.error(error);
        return json({
            success: false
        }, { status: 500 });
    }
}