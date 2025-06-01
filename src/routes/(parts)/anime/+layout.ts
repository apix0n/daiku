import { loadAnimeData } from '$lib/client/data.js';
import type { AnimeRequest } from '$lib/types/requests';

export const load = async ({ fetch }) => {
    const animeData = (await loadAnimeData()).animeData as AnimeRequest;
    return { animeData };
};