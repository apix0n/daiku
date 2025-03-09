import { fetchAnimeData } from "$lib/server/anilist/animeData";
import { accounts } from "$lib/server/config.js";
import { json } from '@sveltejs/kit';
import { setValue } from "$lib/server/redisInteractions.js";

export async function GET() {
    try {
        let data = await fetchAnimeData(accounts.anilistId);
        await setValue("anime", data);
        return json({ success: true });
    } catch (error) {
        return json({
            success: false
        }, { status: 500 });
    }
}