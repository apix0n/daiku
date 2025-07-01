import { loadCollectionData } from '$lib/client/data.js';
import type { BookRequest } from '$lib/types/requests.js';

export const load = async ({ fetch }) => {
    const mangaCollection = (await loadCollectionData()).mangaCollection as BookRequest;
    return { mangaCollection };
};