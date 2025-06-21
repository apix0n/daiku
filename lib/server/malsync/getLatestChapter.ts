import { config } from "$lib/config";
import { getValue, setValue } from "$lib/server/redisInteractions";

type MALSyncElement = {
    id: string,
    lang: string,
    type: string,
    lastEp: {
        total: number,
        timestamp: string,
    }
}

function findChapterfromLanguage(chapterList: MALSyncElement[], lang: string) {
    const chapter = chapterList.find(entry => entry.lang === lang);

    if (!chapter) return null;

    return {
        number: chapter.lastEp.total,
        timestamp: parseInt(chapter.lastEp.timestamp),
    }
}

export async function getLatestChapter(malMangaId: number, lang = config.defaultMangaLang) {
    const cacheKey = `malsync:chapter:${malMangaId}:${lang}`;

    const url = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(`https://api.malsync.moe/nc/mal/manga/${malMangaId}/pr`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    try {
        const response = await fetch(url, {
            signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        }
        const data = await response.json() as MALSyncElement[]; 
        let chapter = findChapterfromLanguage(data, lang);
        console.log('malsync | last chapter found for', malMangaId)

        // Cache the successful response
        if (chapter) {
            try {
                await setValue(cacheKey, chapter);
            } catch (error) {
                console.error("malsync | cache write error:", error);
            }
        }

        return chapter;
    } catch (error) {
        clearTimeout(timeoutId);
        console.error("malsync | couldn't fetch last chapter for", malMangaId, ":", error);

        // Try to get from cache as fallback
        try {
            const cached = await getValue(cacheKey);
            if (cached) {
                console.log("malsync | using cached data as fallback for", malMangaId);
                return cached;
            }
        } catch (error) {
            console.error("malsync | cache fallback read error:", error);
        }

        return null;
    }
}