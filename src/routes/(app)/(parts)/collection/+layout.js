import { loadCollectionData } from '$lib/client/data.js';

export const load = async ({ fetch }) => {
    const mangaCollection = (await loadCollectionData()).mangaCollection;
    return { mangaCollection };
};