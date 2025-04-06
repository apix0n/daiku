import * as anilistGlobal from '$lib/server/anilist/global.js'
import { applyAnimeReleaseTime, getAnimeReleaseTime } from '../animeSchedule/animeReleaseTime';
import { getPrecedingEpisode } from './getPrecedingEpisode';

async function getUserAnimeData(userId) {
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

function watchedAnime(userAnimeData) {
    const seen = new Set();
    const allWatchedAnime = userAnimeData.data.MediaListCollection.lists
        .flatMap(list => list.entries)
        .filter(entry => entry.status === "COMPLETED") // Keep only completed entries
        .filter(media => media.media.format !== "MOVIE" && media.media.format !== "MUSIC") // Filter out movies & music
        .filter(entry => {
            const duplicate = seen.has(entry.media.id);
            seen.add(entry.media.id);
            return !duplicate;
        }); // Filter out duplicates (same media in multiple lists)

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
        const dateA = new Date(a.completedAt.year, a.completedAt.month - 1, a.completedAt.day);
        const dateB = new Date(b.completedAt.year, b.completedAt.month - 1, b.completedAt.day);
        return dateB - dateA || allWatchedAnime.indexOf(b) - allWatchedAnime.indexOf(a);
    });

    return allWatchedAnime.map(entry => ({
        media: {
            title: {
                english: entry.media.title.english || undefined,
                romaji: entry.media.title.romaji || undefined,
                native: entry.media.title.native || undefined,
            },
            type: 'anime',
            source: 'anilist',
            status: entry.media.status,
            runtime: entry.media.duration,
            accentColor: entry.media.coverImage.color,
            cover: {
                large: entry.media.coverImage.extraLarge,
                medium: entry.media.coverImage.large,
                small: entry.media.coverImage.medium,
            },
            banner: {
                large: entry.media.bannerImage,
            },
            episodes: {
                count: entry.media.episodes,
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
        repeat: entry.repeat,
        status: 'completed',
        review: entry.score || entry.notes ? {
            rating: entry.score || undefined,
            isHtml: entry.notes ? false : undefined,
            text: entry.notes || undefined,
        } : undefined,
    }));
}

async function currentAnime(userAnimeData, fetchLastEpisode) {
    const seen = new Set();
    const allCurrentAnime = userAnimeData.data.MediaListCollection.lists
        .flatMap(list => list.entries)
        .sort((a, b) => b.updatedAt - a.updatedAt) // Sort by updatedAt descending
        .filter(entry => entry.status === "CURRENT" || entry.status === "REPEATING") // Keep only current and rewatching entries
        .filter(entry => {
            const duplicate = seen.has(entry.media.id);
            seen.add(entry.media.id);
            return !duplicate;
        }); // Filter out duplicates (same media in multiple lists)

    await Promise.all(allCurrentAnime.map(async (media) => {
        try {
            if (media.media.status === "RELEASING" && media.media.nextAiringEpisode?.episode && fetchLastEpisode) {
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
            },
            type: 'anime',
            source: 'anilist',
            status: entry.media.status,
            runtime: entry.media.duration,
            accentColor: entry.media.coverImage.color,
            cover: {
                large: entry.media.coverImage.extraLarge,
                medium: entry.media.coverImage.large,
                small: entry.media.coverImage.medium,
            },
            banner: entry.media.bannerImage ? {
                large: entry.media.bannerImage,
            } : undefined,
            episodes: {
                count: entry.media.episodes,
                last: entry.media.lastEpisode,
                next: entry.media.nextAiringEpisode ? {
                    number: entry.media.nextAiringEpisode.episode,
                    timestamp: entry.media.nextAiringEpisode.airingAt * 1000,
                } : undefined,
            },
            id: {
                anilist: entry.media.id,
                myanimelist: entry.media.idMal,
            }
        },
        dates: {
            started: anilistGlobal.formatDate(entry.startedAt),
        },
        repeat: entry.repeat,
        status: entry.status,
        progress: {
            episode: entry.progress,
        },
        review: entry.score || entry.notes ? {
            rating: entry.score || undefined,
            isHtml: entry.notes ? false : undefined,
            text: entry.notes || undefined,
        } : undefined,
    }));
}

function droppedAnime(userAnimeData) {
    const seen = new Set();
    const allDroppedAnime = userAnimeData.data.MediaListCollection.lists
        .flatMap(list => list.entries)
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
            },
            type: 'anime',
            source: 'anilist',
            status: entry.media.status,
            runtime: entry.media.duration,
            accentColor: entry.media.coverImage.color,
            cover: {
                large: entry.media.coverImage.extraLarge,
                medium: entry.media.coverImage.large,
                small: entry.media.coverImage.medium,
            },
            banner: entry.media.bannerImage ? {
                large: entry.media.bannerImage,
            } : undefined,
            episodes: {
                count: entry.media.episodes,
                next: entry.media.nextAiringEpisode ? {
                    number: entry.media.nextAiringEpisode.episode,
                    timestamp: entry.media.nextAiringEpisode.airingAt * 1000,
                } : undefined,
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
            episode: entry.progress,
        },
        status: entry.status,
        review: entry.score || entry.notes ? {
            rating: entry.score || undefined,
            isHtml: entry.notes ? false : undefined,
            text: entry.notes || undefined,
        } : undefined,
    }));
}

export async function fetchAnimeData(userId, fetchLastEpisode = true) {
    try {
        const userData = await getUserAnimeData(userId);
        return {
            updatedAt: new Date().toISOString(),
            current: await currentAnime(userData, fetchLastEpisode),
            watched: watchedAnime(userData),
            dropped: droppedAnime(userData),
        };
    } catch (error) {
        console.error('Error fetching anime data:', error);
        throw error;
    }
}