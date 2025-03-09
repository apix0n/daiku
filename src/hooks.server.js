import { config } from '$lib/server/config';

export const handle = async ({ event, resolve }) => {
    return await resolve(event, {
        transformPageChunk: ({ html }) => {
            return html
                .replace('%sveltekit.config.appAccent%', config.appAccent)
                .replace('%sveltekit.config.appAccentDark%', config.appAccentDark);
        }
    });
};