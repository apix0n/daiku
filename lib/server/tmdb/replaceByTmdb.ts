import { getTmdbInfos } from "./getTmdbInfos.js";
import { applyPosterOverrides } from '$lib/server/overrides/tmdb';
import { getTmdbIdFromImdbId } from "./getTmdbIdFromImdb.js";
import type { MediaElement } from "$lib/types/media.js";

export async function replaceByTmdb(movieList: MediaElement[])  {
    const moviePromises = movieList.map(async (movie) => {
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
            if (typeof error === "object" && error !== null && "message" in error && typeof (error as any).message === "string" && (error as any).message.includes("status: 401")) throw error;
            return movie;
        }
    });

    try {
        const updatedMovieList = await Promise.all(moviePromises);
        return updatedMovieList
    } catch (error) {
        console.error("tmdb | Error processing movie list:", error);
        return movieList; // Return original list on error
    }
}