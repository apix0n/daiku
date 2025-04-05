import { alternativesUrl } from '../tmdb/replaceByTmdb';
import overridesData from '$lib/overrides/data';

export function applyPosterOverrides(media) {
    const posterOverrides = overridesData.tmdb;
    const override = posterOverrides[media.tmdbId];
    if (override) {
        if (override.covers) {
            if (override.covers.medium) {
                media.coverLink = `${alternativesUrl}/${override.covers.medium}`;
            }
        }
        if (override.title) {
            media.title = override.title;
        }
    }
}
