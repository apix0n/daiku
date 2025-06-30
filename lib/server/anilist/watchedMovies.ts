import * as anilistGlobal from '$lib/server/anilist/global.js';
import { getTmdbInfos } from '$lib/server/tmdb/getTmdbInfos.js';
import type { AniListResponse } from '$lib/types/anilist';
import type { MediaElement } from '$lib/types/media';
import type { MovieRequest } from '$lib/types/requests';

let cachedAnimeIdsFile = null;
let cacheTimestamp = null;

async function getUserWatchedAnime(userId: number) {
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

export function getIdsFromAnilistId(anilistId: number) {
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

async function watchedMovies(userMovieData: AniListResponse): Promise<MediaElement[]> {
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
        const dateA = new Date(
            (a.completedAt.year ?? 1970),
            ((a.completedAt.month ?? 1) - 1),
            (a.completedAt.day ?? 1)
        );
        const dateB = new Date(
            (b.completedAt.year ?? 1970),
            ((b.completedAt.month ?? 1) - 1),
            (b.completedAt.day ?? 1)
        );
        return dateB.getTime() - dateA.getTime() || allWatchedMovies.indexOf(b) - allWatchedMovies.indexOf(a);
    });

    return await Promise.all(allWatchedMovies.map(async entry => {
        const ids = getIdsFromAnilistId(entry.media.id);

        return {
            media: {
                title: {
                    english: entry.media.title.english || undefined,
                    romaji: entry.media.title.romaji || undefined,
                    native: entry.media.title.native || undefined,
                },
                type: 'movie',
                source: 'anilist',
                status: anilistGlobal.mapAniListMediaStatus(entry.media.status),
                runtime: (entry.media.episodes ?? 0) * (entry.media.duration ?? 0) || null,
                accentColor: entry.media.coverImage.color,
                cover: {
                    large: entry.media.coverImage.extraLarge,
                    medium: entry.media.coverImage.large,
                    small: entry.media.coverImage.medium,
                },
                banner: entry.media.bannerImage ? {
                    large: entry.media.bannerImage,
                    medium: entry.media.bannerImage,
                    small: entry.media.bannerImage,
                } : undefined,
                special: false,
                id: {
                    anilist: entry.media.id,
                    myanimelist: entry.media.idMal,
                    ...ids
                },
            },
            dates: {
                finished: anilistGlobal.formatDate(entry.completedAt),
            },
            review: {
                rating: entry.score || 0,
                isHtml: entry.notes ? false : undefined,
                text: entry.notes || undefined,
            },
            status: 'finished',
            repeat: entry.repeat,
        } as MediaElement;
    }));
}

export async function fetchWatchedAnimeMovies(userId: number) {
    try {
        const userData = await getUserWatchedAnime(userId);
        return {
            updatedAt: {
                service: 'AniList',
                timestamp: new Date().toISOString()
            },
            watched: await watchedMovies(userData),
        } as MovieRequest;
    } catch (error) {
        console.error('Error fetching movie data:', error);
        throw error;
    }
}