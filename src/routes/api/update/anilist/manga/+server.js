import { fetchMangaData } from "$lib/server/anilist/mangaData.js";
import { accounts, secrets } from "$lib/server/config.js";
import { json } from '@sveltejs/kit';
import { setValue } from "$lib/server/redisInteractions.js";
import { createHeaders } from "$lib/server/apiHeaders.js";

export async function GET({ request, url }) {
    const authHeader = request.headers.get("authorization")
    if (!secrets.apiAuthKey || authHeader !== `Bearer ${secrets.apiAuthKey}`) {
        return json({ success: false, error: "Forbidden" }, {
            status: 403
        })
    }
    
    try {
        let data = await fetchMangaData(accounts.anilistId);
        await setValue("manga", data);
        await fetch(url.origin + "/api/get/anilist/manga?clear", {
            headers: createHeaders(request.headers)
        })
        return json({ success: true });
    } catch (error) {
        return json({
            success: false
        }, { status: 500 });
    }
}