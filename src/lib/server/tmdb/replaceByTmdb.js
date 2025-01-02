import { updated } from "$app/state";
import { getTmdbInfos } from "./getTmdbInfos.js";

export async function replaceByTmdb(movieList) {
    const updatedMovieList = await Promise.all(movieList.watched.map(async (movie) => {
        try {
            const { titre, poster, runtime } = await getTmdbInfos(movie.tmdbId);
            return {
                ...movie,
                title: titre,
                coverLink: poster,
                movieRuntime: runtime,
            };
        } catch (error) {
            console.error(`Failed to fetch TMDB info for movie ID ${movie.tmdbId}:`, error);
            return movie; // Return the original movie object if there's an error
        }
    }));
    return {
        ...movieList,
        watched: updatedMovieList
    }
}