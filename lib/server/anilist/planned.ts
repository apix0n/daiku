import * as anilistGlobal from '$lib/server/anilist/global.js'
import { mapAniListMediaStatus } from '$lib/server/anilist/global';

import type { AniListResponse } from '$lib/types/anilist';
import type { MediaElement } from '$lib/types/media';
import type { PlannedRequest } from '$lib/types/requests';
import { getIdsFromAnilistId } from './watchedMovies';
import { getPrecedingEpisode } from './getPrecedingEpisode';
import { applyAnimeReleaseTime } from '../animeSchedule/animeReleaseTime';

export async function getPlannedAnime(userId: number): Promise<AniListResponse> {
    const query = `
    query ($userId: Int) {
        MediaListCollection(userId: $userId, type: ANIME, status: PLANNING, sort: UPDATED_TIME_DESC) {
            lists {
                entries {
                    media {
                        title {
                            romaji
                            english
                            native
                        }
                        episodes
                        duration
                        id
                        idMal
                        status
                        countryOfOrigin
                        coverImage {
                            color
                            large
                            extraLarge
                        }
                        bannerImage
                        startDate {
                            year
                            month
                            day
                        }
                        format
                        nextAiringEpisode {
                            airingAt
                            episode
                        }
                    }
                }
            }
        }
    }`;
    return await anilistGlobal.fetchGraphQL(query, { userId: userId });
}

export async function getPlannedManga(userId: number): Promise<AniListResponse> {
    const query = `
    query ($userId: Int) {
        MediaListCollection(userId: $userId, type: MANGA, status: PLANNING, sort: UPDATED_TIME_DESC) {
            lists {
                entries {
                    media {
                        title {
                            romaji
                            english
                            native
                        }
                        chapters
                        volumes
                        bannerImage
                        id
                        idMal
                        status
                        countryOfOrigin
                        coverImage {
                            color
                            large
                            extraLarge
                        }
                        startDate {
                            year
                            month
                            day
                        }
                    }
                }
            }
        }
    }`;
    return await anilistGlobal.fetchGraphQL(query, { userId: userId });
}

export async function plannedAnime(userPlannedData: AniListResponse): Promise<MediaElement[]> {
    const seen = new Set();
    const allPlanned = userPlannedData.data.MediaListCollection.lists
        .flatMap(list => list.entries)
        .filter(entry => entry.media.format !== "MOVIE")
        .filter(entry => {
            const duplicate = seen.has(entry.media.id);
            seen.add(entry.media.id);
            return !duplicate;
        }); // Filter out duplicates (same media in multiple lists)

    await Promise.all(allPlanned.map(async (media) => {
        try {
            if (media.media.status === "RELEASING" && media.media.nextAiringEpisode && media.media.nextAiringEpisode.episode <= 2) {
                media.media.lastEpisode = await getPrecedingEpisode(media.media.id, media.media.nextAiringEpisode.episode);
                if (media.media.lastEpisode?.number > media.media.nextAiringEpisode?.episode) {
                    media.media.lastEpisode = undefined;
                }
            }
            await applyAnimeReleaseTime(media);
        } catch (error) {
            console.error("Error processing anime:", media.media.title.english || media.media.title.romaji, error);
        }
        anilistGlobal.applyPosterOverrides(media.media);
    }));

    return allPlanned.map(entry => ({
        media: {
            title: {
                english: entry.media.title.english ?? undefined,
                romaji: entry.media.title.romaji ?? undefined,
                native: entry.media.title.native ?? undefined,
            },
            type: 'anime',
            source: 'anilist',
            accentColor: entry.media.coverImage.color,
            status: mapAniListMediaStatus(entry.media.status),
            runtime: entry.media.duration,
            cover: {
                large: entry.media.coverImage.extraLarge,
                medium: entry.media.coverImage.large,
                small: entry.media.coverImage.medium,
            },
            banner: {
                large: entry.media.bannerImage,
                medium: entry.media.bannerImage,
                small: entry.media.bannerImage,
            },
            episodes: {
                count: entry.media.episodes,
                last: entry.media.lastEpisode,
                next: entry.media.nextAiringEpisode ? {
                    number: entry.media.nextAiringEpisode.episode,
                    timestamp: entry.media.nextAiringEpisode.airingAt * 1000,
                } : undefined,
            },
            special: false,
            id: {
                anilist: entry.media.id,
                myanimelist: entry.media.idMal,
            },
            dates: {
                start: anilistGlobal.planningFormatDate(entry.media.startDate),
            }
        },
        status: "planned",
        review: null,
    } as MediaElement));
}

export function plannedManga(userPlannedData: AniListResponse): MediaElement[] {
    const seen = new Set();
    const allPlanned = userPlannedData.data.MediaListCollection.lists
        .flatMap(list => list.entries)
        .filter(entry => {
            const duplicate = seen.has(entry.media.id);
            seen.add(entry.media.id);
            return !duplicate;
        }); // Filter out duplicates (same media in multiple lists)

    allPlanned.forEach(media => {
        anilistGlobal.applyPosterOverrides(media.media);
    });

    return allPlanned.map(entry => ({
        media: {
            title: {
                english: entry.media.title.english ?? undefined,
                romaji: entry.media.title.romaji ?? undefined,
                native: entry.media.title.native ?? undefined,
                nativeOrigin: entry.media.countryOfOrigin?.toLowerCase() || 'jp', // Default to Japan if country of origin is not available
            },
            type: 'manga',
            source: 'anilist',
            accentColor: entry.media.coverImage.color,
            status: mapAniListMediaStatus(entry.media.status),
            cover: {
                large: entry.media.coverImage.extraLarge,
                medium: entry.media.coverImage.large,
                small: entry.media.coverImage.medium,
            },
            banner: {
                large: entry.media.bannerImage,
                medium: entry.media.bannerImage,
                small: entry.media.bannerImage,
            },
            chapters: {
                count: entry.media.chapters,
            },
            volumes: {
                count: entry.media.volumes,
            },
            special: false,
            id: {
                anilist: entry.media.id,
                myanimelist: entry.media.idMal,
            },
            dates: {
                start: anilistGlobal.planningFormatDate(entry.media.startDate),
            }
        },
        status: "planned",
        review: null,
    } as MediaElement));
}

export async function plannedMovies(userPlannedData: AniListResponse): Promise<MediaElement[]> {
    const seen = new Set();
    const allPlanned = userPlannedData.data.MediaListCollection.lists
        .flatMap(list => list.entries)
        .filter(entry => entry.media.format === "MOVIE")
        .filter(entry => {
            const duplicate = seen.has(entry.media.id);
            seen.add(entry.media.id);
            return !duplicate;
        }); // Filter out duplicates (same media in multiple lists)

    allPlanned.forEach(media => {
        anilistGlobal.applyPosterOverrides(media.media);
    });

    return Promise.all(allPlanned.map(async entry => {
        const ids = await getIdsFromAnilistId(entry.media.id);

        return {
            media: {
                title: {
                    english: entry.media.title.english ?? undefined,
                    romaji: entry.media.title.romaji ?? undefined,
                    native: entry.media.title.native ?? undefined,
                    nativeOrigin: entry.media.countryOfOrigin?.toLowerCase() || 'jp', // Default to Japan if country of origin is not available
                },
                type: 'movie',
                source: 'anilist',
                accentColor: entry.media.coverImage.color,
                status: mapAniListMediaStatus(entry.media.status),
                runtime: (entry.media.duration ?? 0) * (entry.media.episodes ?? 1),
                cover: {
                    large: entry.media.coverImage.extraLarge,
                    medium: entry.media.coverImage.large,
                    small: entry.media.coverImage.medium,
                },
                banner: {
                    large: entry.media.bannerImage,
                    medium: entry.media.bannerImage,
                    small: entry.media.bannerImage,
                },
                special: false,
                id: {
                    anilist: entry.media.id,
                    myanimelist: entry.media.idMal,
                    ...ids,
                },
                dates: {
                    start: anilistGlobal.planningFormatDate(entry.media.startDate),
                }
            },
            status: "planned",
            review: null,
        } as MediaElement;
    }));
}
export async function fetchPlannedData(userId: number): Promise<PlannedRequest> {
    try {
        const plannedAnimeData = await getPlannedAnime(userId);
        const plannedMangaData = await getPlannedManga(userId);

        return {
            updatedAt: {
                service: 'AniList',
                timestamp: new Date().toISOString()
            },
            anime: await plannedAnime(plannedAnimeData),
            manga: plannedManga(plannedMangaData),
            movies: await plannedMovies(plannedAnimeData),
        };
    } catch (error) {
        console.error('Error fetching planned data:', error);
        throw error;
    }
}