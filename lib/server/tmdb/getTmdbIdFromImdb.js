import { secrets, config } from '$lib/server/config';
const tmdbApiKey = secrets.tmdbApiKey;

export async function getTmdbIdFromImdbId(imdbId) {
    if (!tmdbApiKey) {
        throw new Error(`[imdbid] tmdb api key could not be found, ignoring request for ${imdbId}`)
    }

    const params = new URLSearchParams({
        api_key: tmdbApiKey,
        external_source: 'imdb_id'
    });

    const url = `https://api.themoviedb.org/3/find/${imdbId}?${params.toString()}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(`[imdbid] http error, status: ${response.status}`);
    }

    if (!data.movie_results || data.movie_results.length === 0) {
        throw new Error(`[imdbid] no results found for IMDB ID: ${imdbId}`);
    }

    return data.movie_results[0].id;
}