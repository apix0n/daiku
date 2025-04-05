import { getLatestChapter } from '$lib/malsync/getLatestChapter';
import { dataStore } from '$lib/stores/dataStore';

export const load = async ({ fetch }) => {
    const storedData = dataStore.get('mangaData');
    if (storedData) {
        return { mangaData: storedData };
    }

    const mangaData = await fetch('/api/get/anilist/manga').then(r => r.json());

    if (mangaData?.current) {
        const updatedManga = await Promise.all(
            mangaData.current.map(async (manga) => {
                if (manga.status === "RELEASING" && manga.malId) {
                    const lastChapter = await getLatestChapter(manga.malId, manga.readingLang);
                    return { ...manga, lastChapter };
                }
                return manga;
            })
        );
        mangaData.current = updatedManga;
    }

    dataStore.set('mangaData', mangaData);
    return { mangaData };
};