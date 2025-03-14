import { json } from "@sveltejs/kit"
import { secrets } from "$lib/server/config.js";
import { createHeaders } from "$lib/server/apiHeaders.js";

export async function GET({ request, url }) {
    const baseUrl = url.origin;

    const authHeader = request.headers.get("authorization") 
    if (!secrets.apiAuthKey || authHeader !== `Bearer ${secrets.apiAuthKey}`) {
        return json({ success: false, error: "Forbidden" }, {
            status: 403
        })
    }

    const endpoints = [
        "/api/update/anilist/anime",
        "/api/update/anilist/manga",
        "/api/update/anilist/movies",
        "/api/update/anilist/favourites",
        "/api/update/anilist/planning",
        "/api/update/letterboxd",
        "/api/update/mangacollec"
    ];

    const results = await Promise.allSettled(
        endpoints.map(async endpoint => {
            const response = await fetch(baseUrl + endpoint, {
                headers: createHeaders(request.headers)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response;
        })
    );

    const summary = results.map((result, index) => ({
        endpoint: endpoints[index],
        status: result.status,
        statusCode: result.status === 'fulfilled' ? result.value.status : undefined,
        error: result.status === 'rejected' ? result.reason.message : undefined
    }));

    return json({
        success: true,
        results: summary
    });
}