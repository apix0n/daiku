import { updated } from "$app/state";
import { getTmdbInfos } from "./getTmdbInfos.js";

export async function replaceByTmdb(movieList) {
    const updatedMovieList = [];
    for (const movie of movieList.watched) {
        try {
            const { titre, poster, runtime } = await getTmdbInfos(movie.tmdbId);
            updatedMovieList.push({
                ...movie,
                title: titre,
                coverLink: poster,
                movieRuntime: runtime,
            });
        } catch (error) {
            console.error(`Failed to fetch TMDB info for movie ID ${movie.tmdbId}:`, error);
            if (error.includes("status: 401")) {
                console.error('Received 401 Unauthorized error, stopping the loop.');
                break;
            }
            updatedMovieList.push(movie); // Return the original movie object if there's an error
        }
    }
    return {
        ...movieList,
        watched: updatedMovieList
    }
}