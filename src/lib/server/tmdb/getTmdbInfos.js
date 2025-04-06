import { secrets, config } from '$lib/server/config';
const tmdbApiKey = secrets.tmdbApiKey;

export async function getTmdbInfos(tmdbId) {
    if (!tmdbApiKey) {
        throw new Error(`[tmdbid] tmdb api key could not be found, ignoring request for ${tmdbId}`)
    }

    const params = new URLSearchParams({
        language: config.defaultTmdbLang,
        append_to_response: 'images',
        include_image_language: 'null',
        api_key: tmdbApiKey,
    });

    const posterSizes = {
        large: 'w500',
        medium: 'w342',
        small: 'w92'
    };

    const backdropSizes = {
        large: 'w1280',
        medium: 'w780',
        small: 'w300'
    };

    const baseImageUrl = 'https://image.tmdb.org/t/p';
    const url = `https://api.themoviedb.org/3/movie/${tmdbId}?${params.toString()}`;
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`[tmdbid] http error, status: ${response.status}`);
    }

    const posters = data.images?.posters || [];
    const defaultPosterPath = posters[0]?.file_path || data.poster_path;
    const posterUrls = Object.entries(posterSizes).reduce((acc, [size, width]) => {
        acc[size] = defaultPosterPath ? `${baseImageUrl}/${width}${defaultPosterPath}` : null;
        return acc;
    }, {});

    const backdropUrls = Object.entries(backdropSizes).reduce((acc, [size, width]) => {
        acc[size] = data.backdrop_path ? `${baseImageUrl}/${width}${data.backdrop_path}` : null;
        return acc;
    }, {});

    return {
        media: {
            title: {
                locale: data.title,
                native: data.original_title,
            },
            cover: posterUrls,
            banner: backdropUrls,
            runtime: data.runtime,
            releaseDate: data.status !== "Released" ? data.release_date : undefined,
            synopsis: data.overview,
            id: {
                tmdb: tmdbId,
                imdb: data.imdb_id
            }
        }
    }
};