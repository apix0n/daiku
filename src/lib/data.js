import { dataStore } from '$lib/stores/dataStore';
import { getLatestChapter } from '$lib/malsync/getLatestChapter';
import { combineMoviesLists } from '$lib/combineMoviesLists';

export async function loadAnimeData(update = false) {
    if (!update) {
        const storedData = dataStore.get('animeData');
        if (storedData) {
            return { animeData: storedData };
        }
    }

    const animeData = await fetch('/api/get/anilist/anime').then(r => r.json());
    dataStore.set('animeData', animeData);
    return { animeData };
}

export async function loadCollectionData(update = false) {
    if (!update) {
        const storedData = dataStore.get('mangaCollection');
        if (storedData) {
            return { mangaCollection: storedData };
        }
    }

    const mangaCollection = await fetch('/api/get/mangacollec').then(r => r.json());
    dataStore.set('mangaCollection', mangaCollection);
    return { mangaCollection };
}

export async function loadMangaData(update = false) {
    if (!update) {
        const storedData = dataStore.get('mangaData');
        if (storedData) {
            return { mangaData: storedData };
        }
    }

    const mangaData = await fetch('/api/get/anilist/manga').then(r => r.json());

    if (mangaData?.current) {
        const updatedManga = await Promise.all(
            mangaData.current.map(async (manga) => {
                if (manga.media.status === "RELEASING" && manga.media.id.myanimelist) {
                    const lastChapter = await getLatestChapter(manga.media.id.myanimelist, manga.lang);
                    return {
                        ...manga,
                        media: {
                            ...manga.media,
                            chapters: {
                                ...manga.media.chapters,
                                last: lastChapter
                            }
                        }
                    };
                }
                return manga;
            })
        );
        mangaData.current = updatedManga;
    }

    dataStore.set('mangaData', mangaData);
    return { mangaData };
};

export async function loadMovieData(update = false) {
    if (!update) {
        const storedMovies = dataStore.get('watchedMovies');
        if (storedMovies) {
            return { watchedMovies: storedMovies };
        }
    }

    const [letterboxdData, anilistData] = await Promise.all([
        fetch('/api/get/letterboxd').then(r => r.json()),
        fetch('/api/get/anilist/movies').then(r => r.json())
    ]);

    const watchedMovies = combineMoviesLists(letterboxdData, anilistData);
    dataStore.set('watchedMovies', watchedMovies);

    return { watchedMovies };
}

export async function loadPlannedData(update = false) {
    if (!update) {
        const storedData = dataStore.get('plannedData');
        if (storedData) {
            return { plannedData: storedData };
        }
    }

    const plannedData = await fetch('/api/get/anilist/planning').then(r => r.json());
    dataStore.set('plannedData', plannedData);
    return { plannedData };
}