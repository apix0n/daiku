import { json } from "@sveltejs/kit"
import { parse as parseCookie } from 'cookie'

export async function GET({ request, url }) {
    const baseUrl = url.origin;

    const cookies = parseCookie(request.headers.get('cookie') || '');
    const forwardedCookies = ['_vercel_jwt'];

    const cookieHeader = forwardedCookies
        .filter(name => cookies[name])
        .map(name => `${name}=${cookies[name]}`)
        .join('; ');

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
            const response = await fetch(baseUrl + endpoint, {
                headers: {
                    'Cookie': cookieHeader
                }
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