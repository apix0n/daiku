import { config } from "../config";
import overridesData from '$lib/overrides/data';

export function applyOverrides(collection) {
    const overrides = overridesData.mangacollec;

    if (!overrides) {
        console.warn("Pas d'overrides disponibles");
        return collection;
    }

    collection.editions.forEach(edition => {
        const editionOverride = overrides.editions[edition.id];
        if (editionOverride) {
            if (editionOverride.series) {
                const originalSeries = collection.series.find(s => s.id === edition.series_id);
                const linkedSeries = collection.series.find(s => s.id === editionOverride.series);

                if (!edition.title) {
                    if (linkedSeries) {
                        edition.title = originalSeries.title;
                        edition.type_id = originalSeries.type_id !== linkedSeries.type_id ? originalSeries.type_id : undefined;
                    }
                    if (edition.title.includes(linkedSeries.title)) {
                        edition.title = edition.title.replace(linkedSeries.title, "").trim()
                    }
                }
                edition.series_id = editionOverride.series;
            }
        }
    })

    collection.series.forEach(series => {
        const seriesOverride = overrides.series[series.id];
        if (seriesOverride) {
            if (seriesOverride.title) {
                series.title = seriesOverride.title;
            }
        }
    });

    return collection;
}
