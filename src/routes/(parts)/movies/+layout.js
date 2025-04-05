import { combineMoviesLists } from '$lib/combineMoviesLists';
import { dataStore } from '$lib/stores/dataStore';

export const load = async ({ fetch }) => {
    // Check store first
    const storedMovies = dataStore.get('watchedMovies');
    if (storedMovies) {
        return { watchedMovies: storedMovies };
    }

    // If not in store, fetch and store
    const [letterboxdData, anilistData] = await Promise.all([
        fetch('/api/get/letterboxd').then(r => r.json()),
        fetch('/api/get/anilist/movies').then(r => r.json())
    ]);

    const watchedMovies = combineMoviesLists(letterboxdData, anilistData);
    dataStore.set('watchedMovies', watchedMovies);

    return { watchedMovies };
};