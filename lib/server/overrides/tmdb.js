import { config } from "$lib/config";
import overridesData from '$lib/overrides/data';

export function applyPosterOverrides(media) {
    const posterOverrides = overridesData.tmdb;
    const override = posterOverrides[media.media.id.tmdb];
    if (override) {
        if (override.covers) {
            if (override.covers.large) {
                media.media.cover.large = override.covers.large;
            }
            if (override.covers.medium) {
                media.media.cover.medium = override.covers.medium;
            }
            if (override.covers.small) {
                media.media.cover.small = override.covers.small;
            }
        }
        if (override.title) {
            media.media.title.locale = override.title;
        }
    }
}
