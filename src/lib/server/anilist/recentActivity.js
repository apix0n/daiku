import * as anilistGlobal from '$lib/server/anilist/global.js'

async function getRecentActivityData(userId, threshold) {
    const query = `
    query MediaList($userId: Int, $createdAtGreater: Int) {
        Page {
            activities(userId: $userId, sort: ID_DESC, type: MEDIA_LIST, createdAt_greater: $createdAtGreater) {
                ... on ListActivity {
                    createdAt
                    progress
                    media {
                        title {
                            romaji
                            english
                        }
                        coverImage {
                            extraLarge
                            large
                            medium
                        }
                        id
                        type
                        format
                        episodes
                    }
                    status
                }
            }
        }
    }`;
    await anilistGlobal.loadPosterOverrides();
    const response = await anilistGlobal.fetchGraphQL(query, { userId: userId, createdAtGreater: threshold });
    return response.data.Page.activities;
}

async function recentActivity(userRecentActivityData) {
    const allRecentActivity = userRecentActivityData;

    return allRecentActivity
        .filter(activity => activity.media.format !== 'MOVIE') // Ignore AniList watched movies
        .map(activity => {
            const mediaType = activity.media.type === 'ANIME' ? 'anime' : 'manga';
            let messagePrefix = `${activity.status}`.charAt(0).toUpperCase() + `${activity.status}`.slice(1) // Upper case first letter
            messagePrefix = messagePrefix === "Rewatched" ? messagePrefix = "Finished rewatching" : messagePrefix
            messagePrefix = activity.media.type === "ANIME" && messagePrefix === "Completed" && activity.media.episodes !== 1 ? messagePrefix = "Watched last episode and finished watching" : messagePrefix
            messagePrefix = activity.media.type === "MANGA" && messagePrefix === "Completed" && activity.media.chapters !== 1 ? messagePrefix = "Read last chapter and finished reading" : messagePrefix
            messagePrefix = messagePrefix === "Completed" && activity.media.episodes === 1 ? messagePrefix = "Watched" : messagePrefix
            let activityProgress = messagePrefix !== "Dropped" && messagePrefix !== "Completed rewatch" ? activity.progress : null;
            if (`${activity.progress}`.includes('-')) {
                messagePrefix += 's';
            } // Add 's' if multiple episodes/chapters 
            anilistGlobal.applyPosterOverrides(activity.media);
            return {
                date: new Date(activity.createdAt * 1000).toISOString(),
                mediaTitle: activity.media.title.english || activity.media.title.romaji,
                mediaType: mediaType,
                messagePrefix: messagePrefix,
                activityProgress: activityProgress,
                messageRoot: activityProgress === null ? null : 'of',
                mediaLink: `${anilistGlobal.siteUrl}/${mediaType}/${activity.media.id}`,
                coverSrc: activity.media.coverImage.medium,
            };
        });
}

export async function fetchRecentActivity(userId, threshold) {
    try {
        const recentActivityData = await getRecentActivityData(userId, threshold);
        return recentActivity(recentActivityData);
    } catch (error) {
        throw new Error('Error fetching recent activity data:', error);
    }
}