import { secrets } from '../config';
const tmdbApiKey = secrets.tmdbApiKey;

export async function getTmdbInfos(tmdbId) {
    if (!tmdbApiKey) {
        throw new Error(`[tmdbid] tmdb api key could not be found, ignoring request for ${tmdbId}`)
    }

    const params = new URLSearchParams({
        language: 'fr-FR',
        append_to_response: 'images',
        include_image_language: 'null',
        api_key: tmdbApiKey,
    });

    const imgUrlPrefix = 'https://image.tmdb.org/t/p/w300_and_h450_bestv2';
    const url = `https://api.themoviedb.org/3/movie/${tmdbId}?${params.toString()}`;
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`[tmdbid] http error, status: ${response.status}`);
    }

    const titre = data.title;
    const posters = data.images?.posters || [];
    const poster = imgUrlPrefix + (posters[0]?.file_path || data.poster_path);
    const runtime = data.runtime;
    return { titre, poster, runtime };
}