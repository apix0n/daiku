import { fetchFavouritesData} from "$lib/server/anilist/userFavourites.js"
import { accounts, secrets } from "$lib/server/config.js";
import { json } from '@sveltejs/kit';
import { setValue } from "$lib/server/redisInteractions";
import { createHeaders } from "$lib/server/apiHeaders";

export async function GET({ request, url }) {
    const authHeader = request.headers.get("authorization")
    if (!secrets.apiAuthKey || authHeader !== `Bearer ${secrets.apiAuthKey}`) {
        return json({ success: false, error: "Forbidden" }, {
            status: 403
        })
    }

    try {
        let data = await fetchFavouritesData(accounts.anilistId);
        await setValue("favourites", data);
        await fetch(url.origin + "/api/get/anilist/favourites?clear", {
            headers: createHeaders(request.headers)
        })
        return json({ success: true });
    } catch (error) {
        console.log(error)
        return json({
            success: false
        }, { status: 500 });
    }
}