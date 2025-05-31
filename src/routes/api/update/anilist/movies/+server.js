import { fetchWatchedAnimeMovies } from "$lib/server/anilist/watchedMovies.js";
import { accounts, secrets } from "$lib/server/config.js";
import { json } from '@sveltejs/kit';
import { replaceByTmdb } from "$lib/server/tmdb/replaceByTmdb";
import { setValue } from "$lib/server/redisInteractions";
import { cacheStore } from "$lib/server/stores/cache.js";

export async function GET({ request, url }) {
    const authHeader = request.headers.get("authorization")
    if (!secrets.apiAuthKey || authHeader !== `Bearer ${secrets.apiAuthKey}`) {
        return json({ success: false, error: "Forbidden" }, {
            status: 403
        })
    }

    try {
        let data = await replaceByTmdb(await fetchWatchedAnimeMovies(accounts.anilistId));
        await setValue("alMovies", data);
        cacheStore.set("alMovies", {data});
        return json({ success: true });
    } catch (error) {
        console.error(error);
        return json({
            success: false
        }, { status: 500 });
    }
}