import * as anilistGlobal from '$lib/server/anilist/global.js'
import { config } from '../config';

async function getUserMangaData(userId, sortOption = 'UPDATED_TIME_DESC') {
    const query = `
    query ($userId: Int, $sort: [MediaListSort]) {
        MediaListCollection(userId: $userId, type: MANGA, status_not: PLANNING, sort: $sort) {
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
                            large
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
                }
            }
        }
    }`;
    await anilistGlobal.loadPosterOverrides();
    return await anilistGlobal.fetchGraphQL(query, { userId: userId, sort: sortOption });
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
        title: entry.media.title.english || entry.media.title.romaji,
        mediaType: "manga",
        chapterCount: entry.media.chapters,
        volumesCount: entry.media.volumes,
        startedDate: anilistGlobal.formatDate(entry.startedAt),
        finishedDate: anilistGlobal.formatDate(entry.completedAt),
        rating: entry.score,
        reread: entry.repeat,
        mediaLink: anilistGlobal.siteUrl + "/manga/" + entry.media.id,
        coverLink: entry.media.coverImage.large,
        accentColor: entry.media.coverImage.color,
    }));
}

async function readingManga(userMangaData) {
    const seen = new Set();
    const allCurrentManga = userMangaData.data.MediaListCollection.lists
        .flatMap(list => list.entries)
        .filter(entry => entry.status === "CURRENT" || entry.status === "REPEATING") // Keep only current and rewatching entries
        .filter(entry => {
            const duplicate = seen.has(entry.media.id);
            seen.add(entry.media.id);
            return !duplicate;
        }); // Filter out duplicates (same media in multiple lists)

    for (const media of allCurrentManga) {
        anilistGlobal.applyPosterOverrides(media.media);

        let readingLang = undefined;
        const langMatch = media.notes?.match(new RegExp(config.mangaLangRegex));
        if (langMatch) { readingLang = langMatch[1]; media.daikuReadingLang = readingLang } // Extract language from notes
    }

    return allCurrentManga.map(entry => ({
        title: entry.media.title.english || entry.media.title.romaji,
        mediaType: "manga",
        status: entry.media.status,
        chaptersProgress: entry.progress,
        volumesProgress: entry.progressVolumes,
        chapterCount: entry.media.chapters,
        volumesCount: entry.media.volumes,
        startedDate: anilistGlobal.formatDate(entry.startedAt),
        userStatus: entry.status,
        reread: entry.repeat,
        mediaLink: anilistGlobal.siteUrl + "/manga/" + entry.media.id,
        coverLink: entry.media.coverImage.large,
        accentColor: entry.media.coverImage.color,
        malId: entry.media.idMal,
        readingLang: entry.daikuReadingLang ? entry.daikuReadingLang : undefined
    }));
}

function droppedManga(userMangaData) {
    const seen = new Set();
    const allDroppedManga = userMangaData.data.MediaListCollection.lists
        .flatMap(list => list.entries)
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
        title: entry.media.title.english || entry.media.title.romaji,
        mediaType: "manga",
        status: entry.media.status,
        chaptersProgress: entry.progress,
        volumesProgress: entry.progressVolumes,
        chapterCount: entry.media.chapters,
        volumesCount: entry.media.volumes,
        startedDate: anilistGlobal.formatDate(entry.startedAt),
        userStatus: entry.status,
        mediaLink: anilistGlobal.siteUrl + "/manga/" + entry.media.id,
        coverLink: entry.media.coverImage.large,
        accentColor: entry.media.coverImage.color,
    }));
}

export async function fetchMangaData(userId) {
    try {
        const readUserData = await getUserMangaData(userId, 'FINISHED_ON_DESC'); // For read manga
        const userData = await getUserMangaData(userId); // For other statuses
        return {
            updatedAt: new Date().toISOString(),
            current: await readingManga(userData),
            read: readManga(readUserData),
            dropped: droppedManga(userData),
        };
    } catch (error) {
        console.error('Error fetching manga data:', error);
        throw error;
    }
}