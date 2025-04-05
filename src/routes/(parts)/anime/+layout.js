import { loadAnimeData } from '$lib/data.js';

export const load = async ({ fetch }) => {
    const animeData = (await loadAnimeData()).animeData;
    return { animeData };
};