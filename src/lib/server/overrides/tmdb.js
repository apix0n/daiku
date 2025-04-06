import { config } from "$lib/config";
export let alternativesUrl = `${config.alternativesBaseUrl}/tmdb`;
import overridesData from '$lib/overrides/data';

export function applyPosterOverrides(media) {
    const posterOverrides = overridesData.tmdb;
    const override = posterOverrides[media.media.id.tmdb];
    if (override) {
        if (override.covers) {
            if (override.covers.large) {
                media.media.cover.large = `${alternativesUrl}/${override.covers.large}`;
            }
            if (override.covers.medium) {
                media.media.cover.medium = `${alternativesUrl}/${override.covers.medium}`;
            }
            if (override.covers.small) {
                media.media.cover.small = `${alternativesUrl}/${override.covers.small}`;
            }
        }
        if (override.title) {
            media.media.title.locale = override.title;
        }
    }
}
