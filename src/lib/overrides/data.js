import { config } from "$lib/config";

async function fetchOverrides() {
    const [anilist, tmdb, mangacollec] = await Promise.all([
        fetch(`${config.alternativesBaseUrl}/anilist/overrides.json`).then(r => r.json()).catch(() => ({})),
        fetch(`${config.alternativesBaseUrl}/tmdb/overrides.json`).then(r => r.json()).catch(() => ({})),
        fetch(`${config.alternativesBaseUrl}/mangacollec.json`).then(r => r.json()).catch(() => ({ series: {}, editions: {} }))
    ]);

    console.log("--- overrides | fetched data")

    return { anilist, tmdb, mangacollec };
}

export default await fetchOverrides();
