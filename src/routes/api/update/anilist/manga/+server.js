import { fetchMangaData } from "$lib/server/anilist/mangaData.js";
import { accounts } from "$lib/server/config.js";
import { json } from '@sveltejs/kit';
import { setValue } from "$lib/server/redisInteractions.js";

export async function GET() {
    try {
        let data = await fetchMangaData(accounts.anilistId);
        await setValue("manga", data);
        return json({ success: true });
    } catch (error) {
        return json({
            success: false
        }, { status: 500 });
    }
}