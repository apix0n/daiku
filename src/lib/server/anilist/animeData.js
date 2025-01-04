import * as anilistGlobal from '$lib/server/anilist/global.js'

async function getUserAnimeData(username) {
    const query = `
    query ($userName: String) {
        MediaListCollection(userName: $userName, type: ANIME, status_not: PLANNING, sort: UPDATED_TIME_DESC) {
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
                        status
                        id
                        coverImage {
                            color
                            large
                        }
                    }
                    score(format: POINT_10)
                    progress
                    status
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
                    repeat
                }
            }
        }
    }`;
    await anilistGlobal.loadPosterOverrides();
    return await anilistGlobal.fetchGraphQL(query, { userName: username });
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

    return allWatchedAnime.map(entry =>({
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

function currentAnime(userAnimeData) {
    const seen = new Set();
    const allCurrentAnime = userAnimeData.data.MediaListCollection.lists
        .flatMap(list => list.entries)
        .filter(entry => entry.status === "CURRENT" || entry.status === "REPEATING") // Keep only current and rewatching entries
        .filter(entry => {
            const duplicate = seen.has(entry.media.id);
            seen.add(entry.media.id);
            return !duplicate;
        }); // Filter out duplicates (same media in multiple lists)

    allCurrentAnime.forEach(media => {
        anilistGlobal.applyPosterOverrides(media.media);
    });

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
    }));
}

export async function fetchAnimeData(username) {
    try {
        const userData = await getUserAnimeData(username);
        return {
            updatedAt: new Date().toISOString(),
            current: currentAnime(userData),
            watched: watchedAnime(userData),
            dropped: droppedAnime(userData),
        };
    } catch (error) {
        console.error('Error fetching anime data:', error);
        throw error;
    }
}