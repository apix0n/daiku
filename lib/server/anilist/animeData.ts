import * as anilistGlobal from '$lib/server/anilist/global.js'
import { config } from '$lib/server/config';
import { applyAnimeReleaseTime } from '../animeSchedule/animeReleaseTime';
import { getPrecedingEpisode } from './getPrecedingEpisode';
import { mapAniListMediaStatus, mapAniListUserStatus } from '$lib/anilist/global';

import type { AniListResponse, AniListUserMediaStatus, MediaListEntry, MediaListGroup } from '$lib/types/anilist';
import type { MediaElement } from '$lib/types/media';
import type { AnimeRequest } from '$lib/types/requests';

async function getUserAnimeData(userId: number): Promise<AniListResponse> {
    const query = `
    query ($userId: Int) {
        MediaListCollection(userId: $userId, type: ANIME, status_not: PLANNING, sort: FINISHED_ON_DESC) {
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
                        status
                        countryOfOrigin
                        coverImage {
                            color
                            extraLarge
                            large
                            medium
                        }
                        bannerImage
                        nextAiringEpisode {
                            airingAt
                            episode
                        }
                    }
                    score(format: POINT_10)
                    progress
                    notes
                    status
                    repeat
                    startedAt {
                        year
                        month
                        day
                    }
                    completedAt {
                        year
                        month
                        day
                    }
                    updatedAt
                }
            }
        }
    }`;
    return await anilistGlobal.fetchGraphQL(query, { userId: userId });
}

function watchedAnime(userAnimeData: AniListResponse) {
    const seen = new Set();
    const allWatchedAnime = userAnimeData.data.MediaListCollection.lists
        .flatMap(list => list.entries)
        .filter(entry => entry.status === "COMPLETED") // Keep only completed entries
        .filter(media => media.media.format !== "MOVIE" && media.media.format !== "MUSIC") // Filter out movies & music
        .filter(entry => {
            const duplicate = seen.has(entry.media.id);
            seen.add(entry.media.id);
            return !duplicate;
        }) as MediaListEntry[]; // Filter out duplicates (same media in multiple lists)

    allWatchedAnime.forEach(media => {
        if (!media.startedAt) {
            media.startedAt = media.completedAt;
        } else {
            media.startedAt.year = media.startedAt.year ?? media.completedAt?.year ?? null;
            media.startedAt.month = media.startedAt.month ?? media.completedAt?.month ?? null;
            media.startedAt.day = media.startedAt.day ?? media.completedAt?.day ?? null;
        }
        anilistGlobal.applyPosterOverrides(media.media);
    });

    allWatchedAnime.sort((a, b) => {
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
        return dateB.getTime() - dateA.getTime() || allWatchedAnime.indexOf(b) - allWatchedAnime.indexOf(a);
    });

    return allWatchedAnime.map(entry => ({
        media: {
            title: {
                english: entry.media.title.english || undefined,
                romaji: entry.media.title.romaji || undefined,
                native: entry.media.title.native || undefined,
                nativeOrigin: entry.media.countryOfOrigin?.toLowerCase() || 'jp', // Default to Japan if country of origin is not available
            },
            type: 'anime',
            source: 'anilist',
            status: mapAniListMediaStatus(entry.media.status),
            runtime: entry.media.duration,
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
            episodes: {
                count: entry.media.episodes,
            },
            special: (entry.media.episodes ?? 0) > 0 && (entry.media.episodes ?? 0) <= 3 ? true : false, // Assuming episodes <= 3 are considered specials
            id: {
                anilist: entry.media.id,
                myanimelist: entry.media.idMal,
            }
        },
        dates: {
            started: anilistGlobal.formatDate(entry.startedAt),
            finished: anilistGlobal.formatDate(entry.completedAt),
        },
        repeat: entry.repeat,
        status: 'finished',
        review: {
            rating: entry.score || 0,
            isHtml: entry.notes ? false : undefined,
            text: entry.notes || undefined,
        },
    } as MediaElement));
}

async function currentAnime(userAnimeData: AniListResponse, fetchLastEpisode: boolean = true) {
    const seen = new Set();
    const allCurrentAnime = userAnimeData.data.MediaListCollection.lists
        .flatMap(list => list.entries)
        .sort((a, b) => b.updatedAt - a.updatedAt) // Sort by updatedAt descending
        .filter(entry => entry.status === "CURRENT" || entry.status === "REPEATING") // Keep only current and rewatching entries
        .filter(entry => {
            const updatedAt = new Date(entry.updatedAt * 1000);
            return (new Date().getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24) <= config.pauseAfterDays;
        }) // Filter out entries that have not been updated in the last $config.pauseAfterDays days
        .filter(entry => {
            const duplicate = seen.has(entry.media.id);
            seen.add(entry.media.id);
            return !duplicate;
        }); // Filter out duplicates (same media in multiple lists)

    await Promise.all(allCurrentAnime.map(async (media) => {
        try {
            if (media.media.status === "RELEASING" && media.media.nextAiringEpisode && media.media.nextAiringEpisode.episode - 1 != media.progress && fetchLastEpisode) {
                media.media.lastEpisode = await getPrecedingEpisode(media.media.id, media.media.nextAiringEpisode.episode);
                if (media.media.lastEpisode.number > media.media.nextAiringEpisode?.episode) {
                    media.media.lastEpisode = undefined;
                }
            }
            await applyAnimeReleaseTime(media);
        } catch (error) {
            console.error("Error processing anime:", media.media.title.english || media.media.title.romaji, error);
        }
        anilistGlobal.applyPosterOverrides(media.media);
    }));

    return allCurrentAnime.map(entry => ({
        media: {
            title: {
                english: entry.media.title.english || undefined,
                romaji: entry.media.title.romaji || undefined,
                native: entry.media.title.native || undefined,
                nativeOrigin: entry.media.countryOfOrigin?.toLowerCase() || 'jp', // Default to Japan if country of origin is not available
            },
            type: 'anime',
            source: 'anilist',
            status: mapAniListMediaStatus(entry.media.status),
            runtime: entry.media.duration,
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
            episodes: {
                count: entry.media.episodes,
                last: entry.media.lastEpisode,
                next: entry.media.nextAiringEpisode ? {
                    number: entry.media.nextAiringEpisode.episode,
                    timestamp: entry.media.nextAiringEpisode.airingAt * 1000,
                } : undefined,
            },
            special: false, // Assuming no special episodes for current anime
            id: {
                anilist: entry.media.id,
                myanimelist: entry.media.idMal,
            }
        },
        dates: {
            started: anilistGlobal.formatDate(entry.startedAt),
        },
        repeat: entry.repeat,
        status: mapAniListUserStatus(entry.status),
        progress: {
            episode: entry.progress,
        },
        review: {
            rating: entry.score || 0,
            isHtml: entry.notes ? false : undefined,
            text: entry.notes || undefined,
        },
    } as MediaElement));
}

function droppedAnime(userAnimeData: AniListResponse) {
    const seen = new Set();
    const allDroppedAnime = userAnimeData.data.MediaListCollection.lists
        .flatMap(list => list.entries)
        .map(entry => {
            const updatedAt = new Date(entry.updatedAt * 1000);
            if ((entry.status === "CURRENT" || entry.status === "REPEATING") && (new Date().getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24) > config.pauseAfterDays) {
                return {
                    ...entry,
                    status: "PAUSED",
                };
            }
            return entry;
        }) // Add entries that have not been updated in the last $config.pauseAfterDays days and set their status as PAUSED
        .sort((a, b) => b.updatedAt - a.updatedAt) // Sort by updatedAt descending
        .filter(entry => entry.status === "DROPPED" || entry.status === "PAUSED") // Keep only dropped and paused entries
        .filter(entry => {
            const duplicate = seen.has(entry.media.id);
            seen.add(entry.media.id);
            return !duplicate;
        }); // Filter out duplicates (same media in multiple lists)

    allDroppedAnime.forEach(media => {
        anilistGlobal.applyPosterOverrides(media.media);
    });

    return allDroppedAnime.map(entry => ({
        media: {
            title: {
                english: entry.media.title.english || undefined,
                romaji: entry.media.title.romaji || undefined,
                native: entry.media.title.native || undefined,
                nativeOrigin: entry.media.countryOfOrigin?.toLowerCase() || 'jp', // Default to Japan if country of origin is not available
            },
            type: 'anime',
            source: 'anilist',
            status: mapAniListMediaStatus(entry.media.status),
            runtime: entry.media.duration,
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
            episodes: {
                count: entry.media.episodes,
                next: entry.media.nextAiringEpisode ? {
                    number: entry.media.nextAiringEpisode.episode,
                    timestamp: entry.media.nextAiringEpisode.airingAt * 1000,
                } : undefined,
            },
            special: false, // Assuming no special episodes for dropped anime
            id: {
                anilist: entry.media.id,
                myanimelist: entry.media.idMal,
            }
        },
        dates: {
            started: anilistGlobal.formatDate(entry.startedAt),
        },
        progress: {
            episode: entry.progress,
        },
        status: mapAniListUserStatus(entry.status as typeof AniListUserMediaStatus[number]),
        review: {
            rating: entry.score || 0,
            isHtml: entry.notes ? false : undefined,
            text: entry.notes || undefined,
        },
    } as MediaElement));
}

export async function fetchAnimeData(userId: number, fetchLastEpisode = true) {
    try {
        const userData = await getUserAnimeData(userId);
        return {
            updatedAt: {
                service: 'AniList',
                timestamp: new Date().toISOString()
            },
            current: await currentAnime(userData, fetchLastEpisode),
            watched: watchedAnime(userData),
            dropped: droppedAnime(userData),
        } as AnimeRequest;
    } catch (error) {
        console.error('Error fetching anime data:', error);
        throw error;
    }
}