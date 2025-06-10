import overridesData from '$lib/overrides/data';
import type { AniListMedia } from '$lib/types/anilist';

export function applyPosterOverrides(media: AniListMedia): AniListMedia {
    const posterOverrides = overridesData.anilist;
    const override = posterOverrides[media.id];
    if (override) {
        if (override.covers) {
            if (override.covers.large) {
                media.coverImage.extraLarge = override.covers.large;
            }
            if (override.covers.medium) {
                media.coverImage.large = override.covers.medium;
            }
            if (override.covers.small) {
                media.coverImage.medium = override.covers.small;
            }
        }
        if (override.title) {
            media.title.english = override.title;
        }
        if (override.airingEpisodesOffset) {
            if (media.nextAiringEpisode) {
                media.nextAiringEpisode.episode += override.airingEpisodesOffset;
            }
            if (media.lastEpisode) {
                media.lastEpisode.number += override.airingEpisodesOffset;
            }
        }
        if (override.accentColor) {
            media.coverImage.color = override.accentColor;
        }
        if (override.releaseTime && media.nextAiringEpisode) {
            media.nextAiringEpisode.airingAt = Math.floor(new Date(media.nextAiringEpisode.airingAt * 1000).setUTCHours(override.releaseTime[0], override.releaseTime[1] || 0) / 1000);
        }
        if (override.releaseTime && media.lastEpisode) {
            media.lastEpisode.timestamp = Math.floor(new Date(media.lastEpisode.timestamp).setUTCHours(override.releaseTime[0], override.releaseTime[1] || 0));
        }
    }
    return media;
}