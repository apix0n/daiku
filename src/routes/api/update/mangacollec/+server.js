import { fetchMangaCollection } from "$lib/server/mangacollec/mangaCollection";
import { json } from "@sveltejs/kit";
import { accounts } from "$lib/server/config.js";
import { setValue } from "$lib/server/redisInteractions";

export async function GET() {
    try {
        let data = await fetchMangaCollection(accounts.mangacollecUsername);
        await setValue("mangaCollection", data)
        return json({ success: true });
    } catch (error) {
        return json({
            success: false,
        }, { status: 500 });
    }
}