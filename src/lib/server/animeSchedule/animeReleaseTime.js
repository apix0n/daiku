import { cacheStore } from "$lib/server/stores/cache";

const apiUrl = 'https://animeschedule.net/api/v3';
const CACHE_KEY = "anime-release-times";

export async function getAnimeReleaseTime(anilistId) {
    const now = Date.now();

    // Check cache first using the same pattern as anime endpoint
    if (cacheStore.isFresh(CACHE_KEY, now)) {
        const cache = cacheStore.get(CACHE_KEY);
        if (cache?.data?.[anilistId]) {
            console.log("animeSchedule | found cached release time for", anilistId);
            return cache.data[anilistId];
        }
    }

    const url = `${apiUrl}/anime?anilist-ids=${anilistId}`;
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);

        const res = await fetch(url, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (res.status !== 200) {
            return null;
        }
        const data = await res.json();

        if (!data.anime || data.anime.length === 0) {
            return null;
        }

        const anime = data.anime[0];
        if (!anime.subTime) {
            return null;
        }

        const subTime = new Date(anime.subTime);
        const releaseTime = [subTime.getUTCHours(), subTime.getUTCMinutes()];
        console.log("animeSchedule | fetched release time for", anilistId);

        // Get existing cache or create new one
        const existing = cacheStore.get(CACHE_KEY)?.data || {};
        existing[anilistId] = releaseTime;

        // Cache using same TTL pattern
        cacheStore.updateWithTTL(CACHE_KEY, existing, 24 * 60 * 60 * 1000);
        return releaseTime;
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log("animeSchedule | request timeout for ID:", anilistId);
        }
        return null;
    }
}

export async function applyAnimeReleaseTime(anime) {
    if (anime.media.status !== "RELEASING") {
        return;
    }
    const releaseTime = await getAnimeReleaseTime(anime.media.id);
    if (releaseTime) {
        const [hours, minutes] = releaseTime;
        if (anime.media.nextAiringEpisode?.airingAt) {
            const nextDate = new Date(anime.media.nextAiringEpisode.airingAt * 1000);
            nextDate.setUTCHours(hours, minutes, 0, 0);
            anime.media.nextAiringEpisode.airingAt = Math.floor(nextDate.getTime() / 1000);
        }
        if (anime.media.lastEpisode?.timestamp) {
            const lastDate = new Date(anime.media.lastEpisode.timestamp);
            lastDate.setUTCHours(hours, minutes, 0, 0);
            anime.media.lastEpisode.timestamp = Math.floor(lastDate.getTime());
        }
    }
}