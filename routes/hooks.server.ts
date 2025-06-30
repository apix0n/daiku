import { config } from '$lib/config';
import { secrets } from '$lib/server/config';
import { json } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    // Middleware for /api/update/*
    if (event.url.pathname.startsWith('/api/update/')) {
        const authHeader = event.request.headers.get("authorization");
        if (!secrets.apiAuthKey || authHeader !== `Bearer ${secrets.apiAuthKey}`) {
            return json({ success: false, error: "Forbidden" }, {
                status: 403
            });
        }
    }

    return await resolve(event, {
        transformPageChunk: ({ html }) => {
            return html
                .replace('%sveltekit.config.appAccent%', config.appAccent)
                .replace('%sveltekit.config.appAccentDark%', config.appAccentDark)
                .replace('%sveltekit.config.appAccentContrast%', config.appAccentContrast)
                .replace('%sveltekit.config.appAccentDarkContrast%', config.appAccentDarkContrast)
        }
    });
};