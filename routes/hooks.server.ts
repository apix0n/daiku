import { config } from '$lib/config';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
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