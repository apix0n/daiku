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
                        idMal
                        status
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
                        bannerImage
                        id
                        idMal
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
            }
        }
    }`;
    return await anilistGlobal.fetchGraphQL(query, { userId: userId });
}

export function plannedAnime(userPlannedData) {
    const seen = new Set();
    const allPlanned = userPlannedData.data.MediaListCollection.lists
        .flatMap(list => list.entries)
        .filter(entry => entry.media.format !== "MOVIE")
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
                english: entry.media.title.english,
                romaji: entry.media.title.romaji,
                native: entry.media.title.native,
            },
            type: 'anime',
            source: 'anilist',
            accentColor: entry.media.coverImage.color,
            status: entry.media.status,
            runtime: entry.media.duration,
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
                next: entry.media.nextAiringEpisode ? {
                    number: entry.media.nextAiringEpisode.episode,
                    timestamp: entry.media.nextAiringEpisode.airingAt * 1000,
                } : undefined,
            },
            id: {
                anilist: entry.media.id,
                myanimelist: entry.media.idMal,
            },
            dates: {
                start: anilistGlobal.planningFormatDate(entry.media.startDate),
            }
        },
    }));
}

export function plannedManga(userPlannedData) {
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
            },
            dates: {
                start: anilistGlobal.planningFormatDate(entry.media.startDate),
            }
        },
    }));
}

export function plannedMovies(userPlannedData) {
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

    return allPlanned.map(entry => ({
        media: {
            title: {
                english: entry.media.title.english,
                romaji: entry.media.title.romaji,
                native: entry.media.title.native,
            },
            type: 'movie',
            source: 'anilist',
            accentColor: entry.media.coverImage.color,
            status: entry.media.status,
            runtime: entry.media.duration * entry.media.episodes,
            cover: {
                large: entry.media.coverImage.extraLarge,
                medium: entry.media.coverImage.large,
                small: entry.media.coverImage.medium,
            },
            banner: {
                large: entry.media.bannerImage,
            },
            id: {
                anilist: entry.media.id,
                myanimelist: entry.media.idMal,
            },
            dates: {
                start: anilistGlobal.planningFormatDate(entry.media.startDate),
            }
        },
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
            movies: plannedMovies(plannedAnimeData),
        };
    } catch (error) {
        console.error('Error fetching planned data:', error);
        throw error;
    }
}