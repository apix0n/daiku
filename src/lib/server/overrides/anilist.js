import { alternativesUrl } from '../anilist/global';
import overridesData from '$lib/overrides/data';

export function applyPosterOverrides(media) {
    const posterOverrides = overridesData.anilist;
    const override = posterOverrides[media.id];
    if (override) {
        if (override.covers) {
            if (override.covers.large) {
                media.coverImage.extraLarge = `${alternativesUrl}/${override.covers.large}`;
            }
            if (override.covers.medium) {
                media.coverImage.large = `${alternativesUrl}/${override.covers.medium}`;
            }
            if (override.covers.small) {
                media.coverImage.medium = `${alternativesUrl}/${override.covers.small}`;
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
}