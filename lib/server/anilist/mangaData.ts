import * as anilistGlobal from '$lib/server/anilist/global.js'
import { config } from '$lib/server/config.js';
import { mapAniListMediaStatus, mapAniListUserStatus } from '$lib/server/anilist/global';
import type { AniListResponse, AniListUserMediaStatus } from '$lib/types/anilist';
import type { MediaElement } from '$lib/types/media';
import type { MangaRequest } from '$lib/types/requests';
import { getLatestChapter } from '$lib/server/malsync/getLatestChapter';
import { getLastChapter } from '$lib/server/lmc/getLastChapter';

async function getUserMangaData(userId: number): Promise<AniListResponse> {
    const query = `
    query ($userId: Int) {
        MediaListCollection(userId: $userId, type: MANGA, status_not: PLANNING, sort: FINISHED_ON_DESC) {
            lists {
                entries {
                    media {
                        title {
                            romaji
                            english
                            native
                        }
                        format
                        chapters
                        volumes
                        id
                        idMal
                        status
                        countryOfOrigin
                        coverImage {
                            color
                            medium
                            extraLarge
                            large
                        }
                        bannerImage
                        relations {
                            edges {
                              relationType
                            }
                        }
                    }
                    score(format: POINT_10)
                    progress
                    progressVolumes
                    status
                    repeat
                    notes
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

function readManga(userMangaData: AniListResponse): MediaElement[] {
    const seen = new Set();
    const allReadManga = userMangaData.data.MediaListCollection.lists
        .flatMap(list => list.entries)
        .filter(entry => entry.status === "COMPLETED") // Keep only completed entries
        .filter(entry => {
            const duplicate = seen.has(entry.media.id);
            seen.add(entry.media.id);
            return !duplicate;
        }); // Filter out duplicates (same media in multiple lists)

    allReadManga.forEach(media => {
        if (!media.startedAt) {
            media.startedAt = media.completedAt;
        } else {
            media.startedAt.year = media.startedAt.year ?? media.completedAt?.year ?? null;
            media.startedAt.month = media.startedAt.month ?? media.completedAt?.month ?? null;
            media.startedAt.day = media.startedAt.day ?? media.completedAt?.day ?? null;
        }
        anilistGlobal.applyPosterOverrides(media.media);
    });

    allReadManga.sort((a, b) => {
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
        return dateB.getTime() - dateA.getTime() || allReadManga.indexOf(b) - allReadManga.indexOf(a);
    });

    return allReadManga.map(entry => ({
        media: {
            title: {
                english: entry.media.title.english,
                romaji: entry.media.title.romaji,
                native: entry.media.title.native,
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
            banner: entry.media.bannerImage ? {
                large: entry.media.bannerImage,
                medium: entry.media.bannerImage,
                small: entry.media.bannerImage,
            } : undefined,
            chapters: {
                count: entry.media.chapters,
            },
            volumes: {
                count: entry.media.volumes,
            },
            id: {
                anilist: entry.media.id,
                myanimelist: entry.media.idMal,
            },
            special: ((entry.media.chapters ?? 0) <= 4 && (entry.media.chapters ?? 0 > 0) && !entry.media.volumes) && 
                entry.media.relations.edges.some(edge => edge.relationType === 'PARENT'),
        },
        status: 'finished',
        dates: {
            started: anilistGlobal.formatDate(entry.startedAt),
            finished: anilistGlobal.formatDate(entry.completedAt),
        },
        review: {
            rating: entry.score,
            text: entry.notes,
        }
    } as MediaElement));
}

async function readingManga(userMangaData: AniListResponse): Promise<MediaElement[]> {
    const seen = new Set();
    const allCurrentManga = userMangaData.data.MediaListCollection.lists
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

    for (const media of allCurrentManga) {
        anilistGlobal.applyPosterOverrides(media.media);

        if (media.notes) {
            let readingLang = undefined;
            const langMatch = media.notes.match(new RegExp(config.alLangRegex));
            if (langMatch) { // Extract language from notes
                readingLang = langMatch[1];
                media.daikuReadingLang = readingLang;
                media.notes = media.notes.replace(langMatch[0], '').trim(); // Remove the language from notes
            }

            let lastChapterService = undefined;
            const lastChapterMatch = media.notes.match(new RegExp(config.lastChapterServiceRegex));
            if (lastChapterMatch) {
                lastChapterService = lastChapterMatch[1];
                media.daikuLastChapterSource = lastChapterService;
                media.notes = media.notes.replace(lastChapterMatch[0], '').trim()
            }
        }
    }

    await Promise.all(allCurrentManga.map(async (media) => {
        if (media.media.status === "RELEASING") {
            try {
                if (media.daikuLastChapterSource) {
                    media.media.lastEpisode = await getLastChapter(media.daikuLastChapterSource);
                } else if (media.media.idMal) {
                    media.media.lastEpisode = await getLatestChapter(media.media.idMal, media.daikuReadingLang);
                }
            } catch (error) {
                console.error("Error processing manga:", media.media.title.english || media.media.title.romaji, error);
            }
        }
    }));

    return allCurrentManga.map(entry => ({
        media: {
            title: {
                english: entry.media.title.english || undefined,
                romaji: entry.media.title.romaji || undefined,
                native: entry.media.title.native || undefined,
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
            banner: entry.media.bannerImage ? {
                large: entry.media.bannerImage,
                medium: entry.media.bannerImage,
                small: entry.media.bannerImage,
            } : undefined,
            chapters: {
                count: entry.media.chapters,
                last: entry.media.lastEpisode,
            },
            volumes: {
                count: entry.media.volumes,
            },
            special: false,
            id: {
                anilist: entry.media.id,
                myanimelist: entry.media.idMal,
            }
        },
        dates: {
            started: anilistGlobal.formatDate(entry.startedAt),
        },
        progress: {
            chapter: entry.progress,
            volume: entry.progressVolumes,
        },
        status: mapAniListUserStatus(entry.status),
        repeat: entry.repeat,
        review: {
            rating: entry.score,
            text: entry.notes || null,
        },
        lang: entry.daikuReadingLang,
    } as MediaElement));
}

function droppedManga(userMangaData: AniListResponse): MediaElement[] {
    const seen = new Set();
    const allDroppedManga = userMangaData.data.MediaListCollection.lists
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

    allDroppedManga.forEach(media => {
        anilistGlobal.applyPosterOverrides(media.media);
    });

    return allDroppedManga.map(entry => ({
        media: {
            title: {
                english: entry.media.title.english || undefined,
                romaji: entry.media.title.romaji || undefined,
                native: entry.media.title.native || undefined,
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
            banner: entry.media.bannerImage ? {
                large: entry.media.bannerImage,
                medium: entry.media.bannerImage,
                small: entry.media.bannerImage,
            } : undefined,
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
            }
        },
        dates: {
            started: anilistGlobal.formatDate(entry.startedAt)
        },
        progress: {
            chapter: entry.progress,
            volume: entry.progressVolumes
        },
        status: mapAniListUserStatus(entry.status as typeof AniListUserMediaStatus[number]),
        review: {
            rating: entry.score || 0,
            isHtml: entry.notes ? false : undefined,
            text: entry.notes || undefined,
        },
    } as MediaElement));
}

export async function fetchMangaData(userId: number) {
    try {
        const userData = await getUserMangaData(userId);
        return {
            updatedAt: {
                service: 'AniList & MAL-Sync',
                timestamp: new Date().toISOString()
            },
            current: await readingManga(userData),
            read: readManga(userData),
            dropped: droppedManga(userData),
        } as MangaRequest;
    } catch (error) {
        console.error('Error fetching manga data:', error);
        throw error;
    }
}