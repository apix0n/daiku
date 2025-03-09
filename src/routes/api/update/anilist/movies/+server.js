import { fetchWatchedAnimeMovies } from "$lib/server/anilist/watchedMovies.js";
import { accounts } from "$lib/server/config.js";
import { json } from '@sveltejs/kit';
import { replaceByTmdb } from "$lib/server/tmdb/replaceByTmdb";
import { setValue } from "$lib/server/redisInteractions";

export async function GET() {
    try {
        let data = await replaceByTmdb(await fetchWatchedAnimeMovies(accounts.anilistId));
        await setValue("alMovies", data)
        return json({ success: true });
    } catch (error) {
        return json({
            success: false
        }, { status: 500 });
    }
}