const apiUrl = 'https://animeschedule.net/api/v3';

export async function getAnimeReleaseTime(anilistId) {
    const url = `${apiUrl}/anime?anilist-ids=${anilistId}`;
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500); // 1.5 seconds timeout

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
        return [subTime.getUTCHours(), subTime.getUTCMinutes()];
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
        console.log("animeSchedule | found release time for", anime.media.title.english || anime.media.title.romaji);
    }
}