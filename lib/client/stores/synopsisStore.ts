import type { MediaSynopsis } from '$lib/types/media';
import { writable } from 'svelte/store';

export const synopsisCache = writable<Record<number, MediaSynopsis>>({});

export function cacheSynopsis(malId: number, synopsis: MediaSynopsis) {
    synopsisCache.update(cache => ({
        ...cache,
        [malId]: synopsis
    }));
}