import { updated } from "$app/state";
import { config } from "../config";

const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0";

async function getToken() {
    const tokenUrl = 'https://api.mangacollec.com/oauth/token';

    // extracted from the https://www.mangacollec.com/client.[auto].js file
    const tokenReqVariables = {
        client_id: "38fee110b53a75af6cc72f6fb66fa504fc6241e566788f4b2f5b21c25ba2fefb",
        client_secret: "060658630f7d199c19ab1cf34ed4e50935c748267e318a24e048d6ab45871da2",
        grant_type: "client_credentials",
    }

    const tokenReqHeaders = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "User-Agent": ua,
    };

    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: tokenReqHeaders,
        body: JSON.stringify(tokenReqVariables)
    });

    const data = await response.json();
    return `${data.token_type} ${data.access_token}`;
}

async function getCollec(user) {
    const url = `https://api.mangacollec.com/v2/user/${user}/collection`;

    const collecHeaders = {
        "User-Agent": ua,
        "authorization": await getToken(),
        "Origin": "https://www.mangacollec.com",
    };

    const response = await fetch(url, { headers: collecHeaders });
    return await response.json();
}

async function getTypes() {
    const url = 'https://api.mangacollec.com/v1/types';
    const headers = {
        "User-Agent": ua,
        "authorization": await getToken(),
        "Origin": "https://www.mangacollec.com",
    };

    const response = await fetch(url, { headers });
    return await response.json();
}

async function getOverrides() {
    let overrides
    try {
        overrides = await (await fetch(config.alternativesBaseUrl + "/mangacollec.json")).json();
    } catch (error) {
        console.error("Erreur lors du chargement des overrides:", error);
        overrides = { series: {}, editions: {} }; // Valeur par défaut
    }
    return overrides
}

function applyOverrides(collection, overrides) {
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

export async function fetchMangaCollection(username) {
    let [collectionJson, types] = await Promise.all([
        getCollec(username),
        getTypes()
    ]);

    let overrides = await getOverrides();
    collectionJson = applyOverrides(collectionJson, overrides)

    const possessedVolumesData = Object.fromEntries(
        collectionJson.possessions.map(possession => [possession.volume_id, possession.created_at])
    );

    const mangaCollectionData = collectionJson.series.map(serie => {
        const editionsList = collectionJson.editions.filter(edition => edition.series_id === serie.id);
        const editionsData = editionsList.map(edition => {
            const volumesInEdition = collectionJson.volumes
                .filter(vol => vol.edition_id === edition.id)
                .sort((a, b) => a.number - b.number);

            const toAmazonThumbnailLink = (url) => {
                if (!url) return null;
                const amazonRegex = /^(https:\/\/m\.media-amazon\.com\/.*)(\.[a-z]+)$/i;
                return url.replace(amazonRegex, '$1._SY342_SX342_$2');
            };

            const possessedVolumes = volumesInEdition
                .filter(vol => vol.id in possessedVolumesData)
                .map(vol => ({
                    titre: vol.title || `Tome ${vol.number}`,
                    numeroTome: vol.number,
                    isbn: vol.isbn,
                    coverLink: toAmazonThumbnailLink(vol.image_url),
                    dateAjout: possessedVolumesData[vol.id]
                }));

            const nextVolumes = edition.title === null ? volumesInEdition
                .filter(vol => !(vol.id in possessedVolumesData))
                .map(vol => {
                    return {
                        numeroTome: vol.number,
                        isbn: vol.isbn,
                        coverLink: toAmazonThumbnailLink(vol.image_url) || toAmazonThumbnailLink(volumesInEdition.find(v => v.image_url)?.image_url),
                        noCover: !vol.image_url,
                        releaseDate: new Date(vol.release_date) <= new Date() ? null : new Date(vol.release_date)
                    };
                }) : [];

            const latestDate = possessedVolumes.length ? Math.max(...possessedVolumes.map(v => new Date(v.dateAjout))) : null;

            return {
                titreEdition: edition.title || "Edition simple",
                typeLivre: edition.type_id ? types.find(t => t.id === edition.type_id).title : undefined,
                nombreVolumesParus: volumesInEdition.filter(vol => new Date(vol.release_date) <= new Date()).length,
                nombreVolumesEdition: edition.volumes_count,
                nombreVolumesTotal: edition.last_volume_number,
                possessions: possessedVolumes,
                next: nextVolumes,
                dateDernierAjout: latestDate
            };
        }).filter(ed => ed.possessions.length || ed.next.length);

        const typeInfo = types.find(t => t.id === serie.type_id);
        const result = {
            titre: serie.title,
            editions: editionsData,
            dateDernierAjout: Math.max(...editionsData.map(ed => ed.dateDernierAjout))
        };

        if (typeInfo) {
            result.typeLivre = typeInfo.title;
        }

        return result;
    }).filter(serie => serie.editions.length);

    mangaCollectionData.sort((a, b) => b.dateDernierAjout - a.dateDernierAjout); // sort by latest addition date (if has possession)

    return {
        updatedAt: new Date().toISOString(),
        collection: mangaCollectionData,
    }
}