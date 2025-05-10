import { getTmdbInfos } from "./getTmdbInfos.js";
import { config } from "$lib/config";
import { applyPosterOverrides } from '$lib/server/overrides/tmdb';
import { getTmdbIdFromImdbId } from "./getTmdbIdFromImdb.js";

export async function replaceByTmdb(movieList) {
    const moviePromises = movieList.watched.map(async (movie) => {
        const title = movie.media.title?.english || 'Unknown Title';

        if (!movie.media.id.tmdb) {
            if (movie.media.id.imdb) {
                const tmdbId = await getTmdbIdFromImdbId(movie.media.id.imdb);
                if (!tmdbId) {
                    console.log(`Failed to fetch TMDB ID for movie:`, title);
                    return movie;
                }
                movie.media.id.tmdb = tmdbId;
                console.log(`Fetched missing TMDB ID for movie:`, title, `TMDB ID: ${tmdbId}`);
            } else {
                console.log(`No TMDB or IMDb ID for movie:`, title);
                return movie;
            }
        }

        try {
            const tmdbData = await getTmdbInfos(movie.media.id.tmdb);
            const updatedMovie = {
                ...movie,
                media: {
                    ...movie.media,
                    ...tmdbData.media,
                    title: {
                        ...movie.media.title,
                        ...tmdbData.media.title
                    },
                    id: {
                        ...movie.media.id,
                        ...tmdbData.media.id
                    }
                }
            };
            applyPosterOverrides(updatedMovie);
            return updatedMovie;
        } catch (error) {
            console.error(`Failed to fetch TMDB info for movie ID ${movie.media.id.tmdb}:`, error);
            if (error.message.includes("status: 401")) throw error;
            return movie;
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