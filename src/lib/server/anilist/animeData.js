import * as anilistGlobal from '$lib/server/anilist/global.js'
import { getPrecedingEpisode } from './getPrecedingEpisode';

async function getUserAnimeData(username, sortOption = 'UPDATED_TIME_DESC') {
    const query = `
    query ($userName: String, $sort: [MediaListSort]) {
        MediaListCollection(userName: $userName, type: ANIME, status_not: PLANNING, sort: $sort) {
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
                        status
                        coverImage {
                            color
                            large
                        }
                        nextAiringEpisode {
                            airingAt
                            episode
                        }
                    }
                    score(format: POINT_10)
                    progress
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
                }
            }
        }
    }`;
    await anilistGlobal.loadPosterOverrides();
    return await anilistGlobal.fetchGraphQL(query, { userName: username, sort: sortOption });
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
        title: entry.media.title.english || entry.media.title.romaji,
        mediaType: "anime",
        type: entry.media.format.toLowerCase(),
        episodesNumber: entry.media.episodes,
        episodesDuration: entry.media.duration,
        startedDate: anilistGlobal.formatDate(entry.startedAt),
        finishedDate: anilistGlobal.formatDate(entry.completedAt),
        rating: entry.score,
        rewatch: entry.repeat,
        mediaLink: anilistGlobal.siteUrl + "/anime/" + entry.media.id,
        coverLink: entry.media.coverImage.large,
        accentColor: entry.media.coverImage.color,
    }));
}

async function currentAnime(userAnimeData) {
    const seen = new Set();
    const allCurrentAnime = userAnimeData.data.MediaListCollection.lists
        .flatMap(list => list.entries)
        .filter(entry => entry.status === "CURRENT" || entry.status === "REPEATING") // Keep only current and rewatching entries
        .filter(entry => {
            const duplicate = seen.has(entry.media.id);
            seen.add(entry.media.id);
            return !duplicate;
        }); // Filter out duplicates (same media in multiple lists)

    for (const media of allCurrentAnime) {
        anilistGlobal.applyPosterOverrides(media.media);
        if (media.media.status === "RELEASING") {
            media.lastEpisode = await getPrecedingEpisode(media.media.id, media.media.nextAiringEpisode.episode, media.media.airingEpisodesOffset);
        }
    };

    return allCurrentAnime.map(entry => ({
        title: entry.media.title.english || entry.media.title.romaji,
        mediaType: "anime",
        status: entry.media.status,
        episodesProgress: entry.progress,
        episodesNumber: entry.media.episodes,
        episodesDuration: entry.media.duration,
        startedDate: anilistGlobal.formatDate(entry.startedAt),
        userStatus: entry.status,
        rewatch: entry.repeat,
        mediaLink: anilistGlobal.siteUrl + "/anime/" + entry.media.id,
        coverLink: entry.media.coverImage.large,
        accentColor: entry.media.coverImage.color,
        lastEpisode: entry.lastEpisode,
        nextEpisode: {
            number: entry.media.nextAiringEpisode ? entry.media.nextAiringEpisode.episode + (entry.media.airingEpisodesOffset || 0) : undefined,
            timestamp: entry.media.nextAiringEpisode ? entry.media.nextAiringEpisode.airingAt : undefined
        }
    }));
}

function droppedAnime(userAnimeData) {
    const seen = new Set();
    const allDroppedAnime = userAnimeData.data.MediaListCollection.lists
        .flatMap(list => list.entries)
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
        title: entry.media.title.english || entry.media.title.romaji,
        mediaType: "anime",
        status: entry.media.status,
        episodesProgress: entry.progress,
        episodesNumber: entry.media.episodes,
        episodesDuration: entry.media.duration,
        startedDate: anilistGlobal.formatDate(entry.startedAt),
        userStatus: entry.status,
        mediaLink: anilistGlobal.siteUrl + "/anime/" + entry.media.id,
        coverLink: entry.media.coverImage.large,
        accentColor: entry.media.coverImage.color,
        airingAt: entry.media.nextAiringEpisode ? entry.media.nextAiringEpisode.airingAt : undefined,
        nextEpisode: {
            number: entry.media.nextAiringEpisode ? entry.media.nextAiringEpisode.episode + (entry.media.airingEpisodesOffset || 0) : undefined,
            timestamp: entry.media.nextAiringEpisode ? entry.media.nextAiringEpisode.airingAt : undefined
        }
    }));
}

export async function fetchAnimeData(username) {
    try {
        const watchedUserData = await getUserAnimeData(username, 'FINISHED_ON_DESC');
        const userData = await getUserAnimeData(username);
        return {
            updatedAt: new Date().toISOString(),
            current: await currentAnime(userData),
            watched: watchedAnime(watchedUserData),
            dropped: droppedAnime(userData),
        };
    } catch (error) {
        console.error('Error fetching anime data:', error);
        throw error;
    }
}