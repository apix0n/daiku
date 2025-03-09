import { fetchWatchedMovies } from "$lib/server/letterboxd/watchedMovies";
import { json } from '@sveltejs/kit';
import { replaceByTmdb } from "$lib/server/tmdb/replaceByTmdb";
import { accounts } from "$lib/server/config.js";
import { setValue } from "$lib/server/redisInteractions";

export async function GET() {
    try {
        let data = await replaceByTmdb(await fetchWatchedMovies(accounts.letterboxdUsername));
        await setValue("lbMovies", data)
        return json({ success: true });
    } catch (error) {
        return json({
            success: false
        }, { status: 500 });
    }
}