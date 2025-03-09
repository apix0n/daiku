import { clientConfig as config } from "./config";

export async function getLatestChapter(malMangaId, lang = config.defaultMangaLang) {
    const url = `https://api.malsync.moe/nc/mal/manga/${malMangaId}/pr`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000); // 1s timeout

    try {
        const response = await fetch(url, {
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        }
        const data = await response.json();
        const langEntry = data.find(entry => entry.lang === lang);
        if (langEntry) {
            console.log(`[malsync api] found chapter ${langEntry.lastEp.total} for ${malMangaId}`)
            return {
                number: langEntry.lastEp.total,
                timestamp: langEntry.lastEp.timestamp
            }
        } else {
            console.error('Aucune entrée trouvée');
            return null;
        }
    } catch (error) {
        clearTimeout(timeoutId);
        console.error('Erreur lors de la récupération du dernier chapitre:', error);
        return null;
    }
}