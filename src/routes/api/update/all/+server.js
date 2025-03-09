import { json } from "@sveltejs/kit"

export async function GET({ request, url }) {
    const host = request.headers.get('host');
    const protocol = url.protocol || 'http:'
    const baseUrl = protocol + "//" + host

    const endpoints = [
        "/api/update/anilist/anime",
        "/api/update/anilist/manga",
        "/api/update/anilist/movies",
        "/api/update/anilist/planning",
        "/api/update/letterboxd",
        "/api/update/mangacollec"
    ];

    const results = await Promise.allSettled(
        endpoints.map(endpoint => fetch(baseUrl + endpoint))
    );

    const summary = results.map((result, index) => ({
        endpoint: endpoints[index],
        status: result.status,
        error: result.status === 'rejected' ? result.reason.message : undefined
    }));

    return json({
        success: true,
        results: summary
    });
}