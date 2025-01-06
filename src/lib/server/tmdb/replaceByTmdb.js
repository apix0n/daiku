import { updated } from "$app/state";
import { getTmdbInfos } from "./getTmdbInfos.js";
const posterOverrideUrl = "https://raw.githubusercontent.com/apix0n/daiku-alternatives/refs/heads/alternatives/tmdb/overrides.json"

export async function replaceByTmdb(movieList) {
    await loadPosterOverrides(); // Load poster overrides at the start
    const updatedMovieList = [];
    for (const movie of movieList.watched) {
        if (!movie.tmdbId) {
            console.log(`Movie ID is undefined for movie:`, movie.title);
            updatedMovieList.push(movie);
            continue;
        }
        try {
            const { titre, poster, runtime } = await getTmdbInfos(movie.tmdbId);
            const updatedMovie = {
                ...movie,
                title: titre,
                coverLink: poster,
                movieRuntime: runtime,
            };
            applyPosterOverrides(updatedMovie);
            updatedMovieList.push(updatedMovie);
        } catch (error) {
            console.error(`Failed to fetch TMDB info for movie ID ${movie.tmdbId}:`, error);
            if (error.message.includes("status: 401")) {
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

let posterOverrides = {};
let cacheTimestamp = null;

export async function loadPosterOverrides() {
    const cacheDuration = 24 * 60 * 60 * 1000; // 1 day in milliseconds

    if (posterOverrides && (Date.now() - cacheTimestamp < cacheDuration)) {
        return posterOverrides;
    }

    try {
        const response = await fetch(posterOverrideUrl);
        posterOverrides = await response.json();
        cacheTimestamp = Date.now();
        return posterOverrides;
    } catch (error) {
        if (posterOverrides) {
            return posterOverrides;
        } else {
            return {};
        }
    }
}

export function applyPosterOverrides(media) {
    const override = posterOverrides[media.tmdbId];
    if (override) {
        if (override.covers) {
            if (override.covers.medium) {
                media.coverLink = `${posterOverrideUrl}/${override.covers.medium}`;
            }
        }
        if (override.title) {
            media.title = override.title;
        }
    }
}