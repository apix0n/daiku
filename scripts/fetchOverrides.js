import fs from 'fs';

const alternativesBaseUrl = process.env.DAIKU__ALTERNATIVES_BASE_URL;
const defaultData = {
    anilist: {},
    tmdb: {},
    mangacollec: { series: {}, editions: {} }
};

if (!alternativesBaseUrl) {
    console.log("No alternatives URL set, using empty data");
    const data = defaultData;
    fs.writeFileSync('./src/lib/overrides/overrides.json', JSON.stringify(data, null, 2));
    console.log("Empty overrides saved to static/overrides.json");
    process.exit(0);
}

async function fetchOverrides() {
    const [anilist, tmdb, mangacollec] = await Promise.all([
        fetch(`${alternativesBaseUrl}/anilist/overrides.json`).then(r => r.json()).catch(() => ({})),
        fetch(`${alternativesBaseUrl}/tmdb/overrides.json`).then(r => r.json()).catch(() => ({})),
        fetch(`${alternativesBaseUrl}/mangacollec.json`).then(r => r.json()).catch(() => ({ series: {}, editions: {} }))
    ]);

    for (const key in anilist ) {
        if (anilist[key].covers) {
            console.log(`Processing Anilist cover for ${key}`);
            for (const cover in anilist[key].covers) {
                if (!anilist[key].covers[cover].startsWith('http')) {
                    anilist[key].covers[cover] = `${alternativesBaseUrl}/anilist/${anilist[key].covers[cover]}`;
                }
            }
        }
    }

    for (const key in tmdb) {
        if (tmdb[key].covers) {
            console.log(`Processing TMDB cover for ${key}`);
            for (const cover in tmdb[key].covers) {
                if (!tmdb[key].covers[cover].startsWith('http')) {
                    tmdb[key].covers[cover] = `${alternativesBaseUrl}/tmdb/${tmdb[key].covers[cover]}`;
                }
            }
        }
    }

    console.log("--- overrides | fetched data");

    const data = { anilist, tmdb, mangacollec };

    // Save data to a JSON file inside the static folder
    fs.writeFileSync('./src/lib/overrides/overrides.json', JSON.stringify(data, null, 2));

    console.log("Overrides saved to src/lib/overrides/overrides.json");
}

fetchOverrides();
