import { loadMangaData } from '$lib/client/data.js';
import type { MangaRequest } from '$lib/types/requests';

export const load = async ({ fetch }) => {
    const mangaData = (await loadMangaData()).mangaData as MangaRequest;
    return { mangaData };
};