import { loadMovieData } from '$lib/client/data.js';

export const load = async ({ fetch }) => {
    const watchedMovies = (await loadMovieData()).watchedMovies;
    return { watchedMovies };
};