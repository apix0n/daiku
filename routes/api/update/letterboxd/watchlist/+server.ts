import { boxdWatchList } from "$lib/server/letterboxd/watchList.js";
import { json } from '@sveltejs/kit';
import { accounts } from "$lib/server/config.js";
import { setValue } from "$lib/server/redisInteractions";
import { cacheStore } from "$lib/server/stores/cache.js";
import { replaceByTmdb } from "$lib/server/tmdb/replaceByTmdb.js";

export async function GET({ request, url }) {
    try {
        const boxdData = await boxdWatchList(accounts.letterboxdLid)
        let moviesData = await replaceByTmdb(boxdData.watched);
        const data = {
            ...boxdData,
            watched: undefined,
            movies: moviesData,
        };
        await setValue("lbWatchlist", data);
        cacheStore.set("lbWatchlist", { data });
        return json({ success: true });
    } catch (error) {
        console.error(error);
        return json({
            success: false
        }, { status: 500 });
    }
}