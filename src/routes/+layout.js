import { browser } from '$app/environment';
import '$lib/i18n'; // Import to initialize. Important :)
import { locale, waitLocale } from 'svelte-i18n';
import { getLatestChapter } from '$lib/malsyncGetLatestChapter';

export const ssr = false;

export const load = async ({ data }) => {
    // Initialisation de la locale si on est côté navigateur
    if (browser) {
        locale.set(window.navigator.language);
    }

    // Attendre que la traduction soit chargée
    await waitLocale();

    // Charger les derniers chapitres pour les mangas en cours
    if (data?.mangaData?.current) {
        const updatedManga = await Promise.all(
            data.mangaData.current.map(async (manga) => {
                if (manga.status === "RELEASING" && manga.malId) {
                    const lastChapter = await getLatestChapter(manga.malId, manga.lang);
                    return { ...manga, lastChapter };
                }
                return manga;
            })
        );
        data.mangaData.current = updatedManga;
    }

    return data;
};