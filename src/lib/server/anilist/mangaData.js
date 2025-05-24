import * as anilistGlobal from '$lib/server/anilist/global.js'
import { config } from '$lib/server/config.js';

async function getUserMangaData(userId) {
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
                        coverImage {
                            color
                            medium
                            extraLarge
                            large
                        }
                        bannerImage
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

function readManga(userMangaData) {
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
        const dateA = new Date(a.completedAt.year, a.completedAt.month - 1, a.completedAt.day);
        const dateB = new Date(b.completedAt.year, b.completedAt.month - 1, b.completedAt.day);
        return dateB - dateA || allReadManga.indexOf(b) - allReadManga.indexOf(a);
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
            status: entry.media.status,
            cover: {
                large: entry.media.coverImage.extraLarge,
                medium: entry.media.coverImage.large,
                small: entry.media.coverImage.medium,
            },
            banner: {
                large: entry.media.bannerImage,
            },
            chapters: {
                count: entry.media.chapters,
            },
            volumes: {
                count: entry.media.volumes,
            },
            id: {
                anilist: entry.media.id,
                myanimelist: entry.media.idMal,
            }
        },
        dates: {
            started: anilistGlobal.formatDate(entry.startedAt),
            finished: anilistGlobal.formatDate(entry.completedAt),
        },
        review: {
            rating: entry.score,
            text: entry.notes,
        }
    }));
}

async function readingManga(userMangaData) {
    const seen = new Set();
    const allCurrentManga = userMangaData.data.MediaListCollection.lists
        .flatMap(list => list.entries)
        .sort((a, b) => b.updatedAt - a.updatedAt) // Sort by updatedAt descending
        .filter(entry => entry.status === "CURRENT" || entry.status === "REPEATING") // Keep only current and rewatching entries
        .filter(entry => {
            const updatedAt = new Date(entry.updatedAt * 1000);
            return (new Date() - updatedAt) / (1000 * 60 * 60 * 24) <= config.pauseAfterDays;
        }) // Filter out entries that have not been updated in the last $config.pauseAfterDays days
        .filter(entry => {
            const duplicate = seen.has(entry.media.id);
            seen.add(entry.media.id);
            return !duplicate;
        }); // Filter out duplicates (same media in multiple lists)

    for (const media of allCurrentManga) {
        anilistGlobal.applyPosterOverrides(media.media);

        let readingLang = undefined;
        const langMatch = media.notes?.match(new RegExp(config.alLangRegex));
        if (langMatch) { // Extract language from notes
            readingLang = langMatch[1]; 
            media.daikuReadingLang = readingLang;
            media.notes = media.notes.replace(langMatch[0], '').trim(); // Remove the language from notes
        } 
    }

    return allCurrentManga.map(entry => ({
        media: {
            title: {
                english: entry.media.title.english,
                romaji: entry.media.title.romaji,
                native: entry.media.title.native,
            },
            type: 'manga',
            source: 'anilist',
            accentColor: entry.media.coverImage.color,
            status: entry.media.status,
            cover: {
                large: entry.media.coverImage.extraLarge,
                medium: entry.media.coverImage.large,
                small: entry.media.coverImage.medium,
            },
            banner: {
                large: entry.media.bannerImage,
            },
            chapters: {
                count: entry.media.chapters,
            },
            volumes: {
                count: entry.media.volumes,
            },
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
        status: entry.status,
        repeat: entry.repeat,
        review: {
            rating: entry.score,
            text: entry.notes,
        },
        lang: entry.daikuReadingLang,
    }));
}

function droppedManga(userMangaData) {
    const seen = new Set();
    const allDroppedManga = userMangaData.data.MediaListCollection.lists
        .flatMap(list => list.entries)
        .map(entry => {
            const updatedAt = new Date(entry.updatedAt * 1000);
            if ((entry.status === "CURRENT" || entry.status === "REPEATING") && (new Date() - updatedAt) / (1000 * 60 * 60 * 24) > config.pauseAfterDays) {
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
                english: entry.media.title.english,
                romaji: entry.media.title.romaji,
                native: entry.media.title.native,
            },
            type: 'manga',
            source: 'anilist',
            accentColor: entry.media.coverImage.color,
            status: entry.media.status,
            cover: {
                large: entry.media.coverImage.extraLarge,
                medium: entry.media.coverImage.large,
                small: entry.media.coverImage.medium,
            },
            banner: {
                large: entry.media.bannerImage,
            },
            chapters: {
                count: entry.media.chapters,
            },
            volumes: {
                count: entry.media.volumes,
            },
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
        status: entry.status
    }));
}

export async function fetchMangaData(userId) {
    try {
        const userData = await getUserMangaData(userId);
        return {
            updatedAt: new Date().toISOString(),
            current: await readingManga(userData),
            read: readManga(userData),
            dropped: droppedManga(userData),
        };
    } catch (error) {
        console.error('Error fetching manga data:', error);
        throw error;
    }
}