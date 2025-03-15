import { makeBoxdFavouritesList } from "$lib/server/letterboxd/userLikes";
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
        let data = await makeBoxdFavouritesList(accounts.letterboxdUsername);
        await setValue("lbFavourites", data);
        await fetch(url.origin + "/api/get/letterboxd/favourites?clear", {
            headers: createHeaders(request.headers)
        })
        return json({ success: true });
    } catch (error) {
        return json({
            success: false
        }, { status: 500 });
    }
}