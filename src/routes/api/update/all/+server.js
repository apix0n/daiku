import { json } from "@sveltejs/kit"

export async function GET({ request, url }) {
    const baseUrl = url.origin;
    console.log(baseUrl)

    const endpoints = [
        "/api/update/anilist/anime",
        "/api/update/anilist/manga",
        "/api/update/anilist/movies",
        "/api/update/anilist/planning",
        "/api/update/letterboxd",
        "/api/update/mangacollec"
    ];

    const results = await Promise.allSettled(
        endpoints.map(async endpoint => {
            console.log(baseUrl + endpoint);
            const response = await fetch(baseUrl + endpoint);
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