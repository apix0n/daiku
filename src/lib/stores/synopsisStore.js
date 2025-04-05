import { writable } from 'svelte/store';

export const synopsisCache = writable({});

export function cacheSynopsis(malId, synopsis) {
    synopsisCache.update(cache => ({
        ...cache,
        [malId]: synopsis
    }));
}