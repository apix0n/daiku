import * as anilistGlobal from '$lib/server/anilist/global.js';
import { getTmdbInfos } from '$lib/server/tmdb/getTmdbInfos.js';

let cachedAnimeIdsFile = null;
let cacheTimestamp = null;

async function getUserWatchedAnime(username) {
    const query = `
    query ($userName: String) {
        MediaListCollection(userName: $userName, type: ANIME, status: COMPLETED, sort: UPDATED_TIME_DESC) {
            lists {
                entries {
                    media {
                        title {
                            romaji
                            english
                            native
                        }
                        format
                        duration
                        id
                        coverImage {
                            color
                            large
                        }
                    }
                    score(format: POINT_10)
                    completedAt {
                        year
                        month
                        day
                    }
                    repeat
                }
            }
        }
    }`;
    return await anilistGlobal.fetchGraphQL(query, { userName: username });
}

async function getAnimeIdsFile() {
    const cacheDuration = 24 * 60 * 60 * 1000; // 1 day in milliseconds
    const url = "https://raw.githubusercontent.com/Kometa-Team/Anime-IDs/refs/heads/master/anime_ids.json";

    if (cachedAnimeIdsFile && (Date.now() - cacheTimestamp < cacheDuration)) {
        console.log("[al2tmdb] ----- served cached anime ids file -----")
        return cachedAnimeIdsFile;
    }

    try {
        const response = await fetch(url);
        cachedAnimeIdsFile = await response.json();
        cacheTimestamp = Date.now();
        console.log("[al2tmdb] ----- downloaded & cached anime ids file -----")
        return cachedAnimeIdsFile;
    } catch (error) {
        console.error('[al2tmdb] ----- error fetching anime ids file: ', error);
        if (cachedAnimeIdsFile) {
            console.log("[al2tmdb] ----- error fetching anime ids file, served cached instead -----");
            return cachedAnimeIdsFile;
        } else {
            throw error;
        }
    }
}

const animeIdsFile = await getAnimeIdsFile();

async function getTmdbIdForAnilistId(anilistId) {
    for (const key in animeIdsFile) {
        if (animeIdsFile[key].anilist_id === anilistId) {
            return animeIdsFile[key].tmdb_movie_id;
        }
    }
    return null;
}

async function watchedMovies(userMovieData) {
    const seen = new Set();
    const allWatchedMovies = userMovieData.data.MediaListCollection.lists
        .flatMap(list => list.entries)
        .filter(media => media.media.format === "MOVIE") // Filter out movies & music
        .filter(entry => {
            const duplicate = seen.has(entry.media.id);
            seen.add(entry.media.id);
            return !duplicate;
        }); // Filter out duplicates (same media in multiple lists)

    allWatchedMovies.forEach(media => {
        if (!media.startedAt) {
            media.startedAt = media.completedAt;
        } else {
            media.startedAt.year = media.startedAt.year ?? media.completedAt?.year ?? null;
            media.startedAt.month = media.startedAt.month ?? media.completedAt?.month ?? null;
            media.startedAt.day = media.startedAt.day ?? media.completedAt?.day ?? null;
        }
    });

    allWatchedMovies.sort((a, b) => {
        const dateA = new Date(a.completedAt.year, a.completedAt.month - 1, a.completedAt.day);
        const dateB = new Date(b.completedAt.year, b.completedAt.month - 1, b.completedAt.day);
        return dateB - dateA || allWatchedMovies.indexOf(b) - allWatchedMovies.indexOf(a);
    });

    return await Promise.all(allWatchedMovies.map(async entry => {
        const tmdbId = await getTmdbIdForAnilistId(entry.media.id);
        return {
            title: entry.media.title.english || entry.media.title.romaji,
            mediaType: "movie",
            sourceList: "anilist",
            movieRuntime: entry.media.duration,
            coverLink: entry.media.coverImage.large,
            finishedDate: anilistGlobal.formatDate(entry.completedAt),
            rating: entry.score,
            rewatch: entry.repeat,
            link: anilistGlobal.siteUrl + "/anime/" + entry.media.id,
            tmdbId: tmdbId,
        };
    }));
}

export async function fetchWatchedAnimeMovies(username) {
    try {
        const userData = await getUserWatchedAnime(username);
        return {
            updatedAt: new Date().toISOString(),
            watched: await watchedMovies(userData),
        };
    } catch (error) {
        console.error('Error fetching movie data:', error);
        throw error;
    }
}