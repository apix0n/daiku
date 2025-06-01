import { loadMangaData } from '$lib/client/data.js';

export const load = async ({ fetch }) => {
    const mangaData = (await loadMangaData()).mangaData;
    return { mangaData };
};