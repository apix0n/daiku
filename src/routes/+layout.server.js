/** @type {import('./$types').PageServerLoad} */

import { combineMoviesLists } from "$lib/server/combineMoviesLists";
import { allRecentActivity } from "$lib/allRecentActivity";

export async function load({ fetch }) {
    const now = new Date();
    const recentActivityDate = new Date(now.getTime());
    recentActivityDate.setHours(0, 0, 0, 0);
    const recentActivityThreshold = Math.floor(recentActivityDate.getTime() / 1000) - 6 * 24 * 60 ** 2;

    try {
        // Exécuter toutes les requêtes en parallèle
        const [
            animeData,
            mangaData,
            plannedData,
            mangaCollection,
            watchedMovies,
            watchedAnimeMovies,
            recentActivityData,
            alFavouritesData,
            lbFavouritesData
        ] = await Promise.all([
            fetch('/api/get/anilist/anime').then(r => r.json()),
            fetch('/api/get/anilist/manga').then(r => r.json()),
            fetch('/api/get/anilist/planning').then(r => r.json()),
            fetch('/api/get/mangacollec').then(r => r.json()),
            fetch('/api/get/letterboxd').then(r => r.json()),
            fetch('/api/get/anilist/movies').then(r => r.json()),
            fetch(`/api/get/anilist/recent/${recentActivityThreshold}`).then(r => r.json()),
            fetch(`/api/get/anilist/favourites`).then(r => r.json()),
            fetch(`/api/get/letterboxd/favourites`).then(r => r.json())
        ]);

        const watchedMoviesFinal = combineMoviesLists(watchedMovies, watchedAnimeMovies);
        const recentActivity = allRecentActivity(recentActivityData, mangaCollection, watchedMoviesFinal, recentActivityThreshold);
        const favouritesData = {
            updatedAt: new Date().toISOString(),
            favourites: [
                alFavouritesData.favourites[0],
                lbFavouritesData.favourites[0],
                ...alFavouritesData.favourites.slice(1),
            ].filter(item => item && Array.isArray(item.favourites) && item.favourites.length > 0)
        };

        return {
            animeData,
            mangaData,
            plannedData,
            mangaCollection,
            watchedMovies: watchedMoviesFinal,
            recentActivity,
            favouritesData
        };

    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);

        // Retourner des données par défaut en cas d'erreur
        return {
            animeData: [],
            mangaData: [],
            plannedData: [],
            mangaCollection: [],
            watchedMovies: [],
            recentActivity: allRecentActivity([], [], [], recentActivityThreshold),
            favouritesData: [],
        };
    }
}