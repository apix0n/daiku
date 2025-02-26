export async function getLatestChapter(malMangaId, lang="fr") {
    const url = `https://api.malsync.moe/nc/mal/manga/${malMangaId}/pr`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        }
        const data = await response.json();
        const langEntry = data.find(entry => entry.lang === lang);
        if (langEntry) {
            return {
                number: langEntry.lastEp.total,
                timestamp: langEntry.lastEp.timestamp
            } 
        } else {
            console.error('Aucune entrée trouvée');
            return null;
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du dernier chapitre:', error);
        return null;
    }
}