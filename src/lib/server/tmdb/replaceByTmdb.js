import { getTmdbInfos } from "./getTmdbInfos.js";
import { config } from "$lib/config";
import { applyPosterOverrides } from '$lib/server/overrides/tmdb';

export let alternativesUrl = `${config.alternativesBaseUrl}/tmdb`;

export async function replaceByTmdb(movieList) {
    const moviePromises = movieList.watched.map(async (movie) => {
        if (!movie.tmdbId) {
            console.log(`Movie ID is undefined for movie:`, movie.title);
            return movie;
        }

        try {
            const { titre, poster, runtime, status, releaseDate } = await getTmdbInfos(movie.tmdbId);
            const updatedMovie = {
                ...movie,
                title: titre,
                coverLink: poster,
                movieRuntime: runtime,
                releaseDate: status !== "Released" ? releaseDate : undefined,
            };
            applyPosterOverrides(updatedMovie);
            return updatedMovie;
        } catch (error) {
            console.error(`Failed to fetch TMDB info for movie ID ${movie.tmdbId}:`, error);
            if (error.message.includes("status: 401")) {
                throw error; // Propagate auth errors up
            }
            return movie; // Return original movie on other errors
        }
    });

    try {
        const updatedMovieList = await Promise.all(moviePromises);
        return {
            ...movieList,
            watched: updatedMovieList
        };
    } catch (error) {
        if (error.message.includes("status: 401")) {
            console.error('Received 401 Unauthorized error, stopping all requests.');
        }
        throw error;
    }
}