import * as anilistGlobal from '$lib/server/anilist/global.js';
import { getTmdbInfos } from '$lib/server/tmdb/getTmdbInfos.js';

let cachedAnimeIdsFile = null;
let cacheTimestamp = null;

async function getUserWatchedAnime(userId) {
    const query = `
    query ($userId: Int) {
        MediaListCollection(userId: $userId, type: ANIME, status: COMPLETED, sort: UPDATED_TIME_DESC) {
            lists {
                entries {
                    media {
                        title {
                            romaji
                            english
                            native
                        }
                        format
                        episodes
                        duration
                        id
                        idMal
                        coverImage {
                            color
                            extraLarge
                            large
                            medium
                        }
                        bannerImage
                    }
                    score(format: POINT_10)
                    completedAt {
                        year
                        month
                        day
                    }
                    repeat
                    notes
                }
            }
        }
    }`;
    return await anilistGlobal.fetchGraphQL(query, { userId: userId });
}

async function getAnimeIdsFile() {
    const url = "https://raw.githubusercontent.com/Kometa-Team/Anime-IDs/refs/heads/master/anime_ids.json";
    try {
        console.log('Fetching anime ids file from:', url);
        return (await fetch(url)).json();
    } catch (error) {
        console.error('al2tmdb | error fetching anime ids file: ', error);
        return {}
    }
}

const animeIdsFile = await getAnimeIdsFile();

function getIdsFromAnilistId(anilistId) {
    for (const key in animeIdsFile) {
        if (animeIdsFile[key].anilist_id === anilistId) {
            return {
                tmdb: animeIdsFile[key].tmdb_movie_id,
                imdb: animeIdsFile[key].imdb_id,
            }
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
        const ids = await getIdsFromAnilistId(entry.media.id);

        return {
            media: {
                title: {
                    romaji: entry.media.title.romaji,
                    english: entry.media.title.english,
                    native: entry.media.title.native
                },
                cover: {
                    large: entry.media.coverImage.extraLarge,
                    medium: entry.media.coverImage.large,
                    small: entry.media.coverImage.medium,
                },
                banner: {
                    large: entry.media.bannerImage
                },
                accentColor: entry.media.coverImage.color,
                type: 'movie',
                source: 'anilist',
                runtime: entry.media.episodes * entry.media.duration || null,
                id: {
                    anilist: entry.media.id,
                    myanimelist: entry.media.idMal,
                    ...ids
                }
            },
            dates: {
                finished: anilistGlobal.formatDate(entry.completedAt),
            },
            review: {
                rating: entry.score,
                text: entry.notes,
            },
            repeat: entry.repeat,
        };
    }));
}

export async function fetchWatchedAnimeMovies(userId) {
    try {
        const userData = await getUserWatchedAnime(userId);
        return {
            updatedAt: new Date().toISOString(),
            watched: await watchedMovies(userData),
        };
    } catch (error) {
        console.error('Error fetching movie data:', error);
        return [];
    }
}