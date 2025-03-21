import * as anilistGlobal from '$lib/server/anilist/global.js'

export async function getPlannedAnime(userId) {
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
                        status
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
    await anilistGlobal.loadPosterOverrides();
    return await anilistGlobal.fetchGraphQL(query, { userId: userId });
}

export async function getPlannedManga(userId) {
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
                        id
                        status
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
                isCustomList
            }
        }
    }`;
    await anilistGlobal.loadPosterOverrides();
    return await anilistGlobal.fetchGraphQL(query, { userId: userId });
}

export function plannedAnime(userPlannedAnime) {
    const seen = new Set();
    const allCurrentAnime = userPlannedAnime.data.MediaListCollection.lists
        .flatMap(list => list.entries)
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
        type: entry.media.format,
        episodesNumber: entry.media.episodes,
        episodesDuration: entry.media.duration,
        mediaLink: anilistGlobal.siteUrl + "/anime/" + entry.media.id,
        startDate: anilistGlobal.planningFormatDate(entry.media.startDate),
        coverLink: entry.media.coverImage.large,
        accentColor: entry.media.coverImage.color,
        nextEpisode: entry.media.nextAiringEpisode ? {
            number: entry.media.nextAiringEpisode ? entry.media.nextAiringEpisode.episode : undefined,
            timestamp: entry.media.nextAiringEpisode ? entry.media.nextAiringEpisode.airingAt : undefined
        } : undefined
    }));
}

export function plannedManga(userPlannedManga) {
    const seen = new Set();
    const allCurrentAnime = userPlannedManga.data.MediaListCollection.lists
        .flatMap(list => list.entries)
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
        mediaType: "manga",
        status: entry.media.status,
        chapterCount: entry.media.chapters,
        volumesCount: entry.media.volumes,
        mediaLink: anilistGlobal.siteUrl + "/manga/" + entry.media.id,
        startDate: anilistGlobal.planningFormatDate(entry.media.startDate),
        coverLink: entry.media.coverImage.large,
        accentColor: entry.media.coverImage.color,
    }));
}

export async function fetchPlannedData(userId) {
    try {
        const plannedAnimeData = await getPlannedAnime(userId);
        const plannedMangaData = await getPlannedManga(userId);

        return {
            updatedAt: new Date().toISOString(),
            anime: plannedAnime(plannedAnimeData),
            manga: plannedManga(plannedMangaData),
        };
    } catch (error) {
        console.error('Error fetching planned data:', error);
        throw error;
    }
}