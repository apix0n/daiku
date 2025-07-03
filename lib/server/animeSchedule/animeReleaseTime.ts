import { getValue, setValue } from "$lib/server/redisInteractions";
import type { MediaListEntry } from "$lib/types/anilist";

const apiUrl = 'https://animeschedule.net/api/v3';

export async function getAnimeReleaseTime(anilistId: number) {
    const cacheKey = `animeschedule:${anilistId}`;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);

        const url = `${apiUrl}/anime?anilist-ids=${anilistId}`;
        const res = await fetch(url, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (res.status !== 200) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (!data.anime || data.anime.length === 0 || !data.anime[0].subTime) {
            throw new Error('No valid release time data');
        }

        const subTime = new Date(data.anime[0].subTime);
        const releaseTime = [subTime.getUTCHours(), subTime.getUTCMinutes()];
        console.log("animeSchedule | fetched release time for", anilistId);

        // Cache the successful response
        try {
            await setValue(cacheKey, releaseTime);
        } catch (error) {
            console.error("animeSchedule | cache write error:", error);
        }

        return releaseTime;
    } catch (error) {
        if (typeof error === "object" && error !== null && "name" in error && (error as { name: string }).name === 'AbortError') {
            console.log("animeSchedule | request timeout for ID:", anilistId);
        } else {
            console.error("animeSchedule | couldn't fetch release time for", anilistId, ":", error);
        }

        // Try to get from cache as fallback
        try {
            const cached = await getValue(cacheKey);
            if (cached) {
                console.log("animeSchedule | using cached data as fallback for", anilistId);
                return cached;
            }
        } catch (error) {
            console.error("animeSchedule | cache fallback read error:", error);
        }

        return null;
    }
}

export async function applyAnimeReleaseTime(anime: MediaListEntry) {
    if (anime.media.status !== "RELEASING" && anime.media.status !== "NOT_YET_RELEASED") {
        return;
    }
    if (anime.media.nextAiringEpisode) {
        const releaseTime = await getAnimeReleaseTime(anime.media.id)
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
    };
}