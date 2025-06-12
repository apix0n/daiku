import { loadMovieData } from '$lib/client/data.js';
import type { MovieRequest } from '$lib/types/requests.js';

export const load = async ({ fetch }) => {
    const watchedMovies = (await loadMovieData()).watchedMovies as MovieRequest;
    return { watchedMovies };
};