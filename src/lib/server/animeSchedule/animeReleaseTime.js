const apiUrl = 'https://animeschedule.net/api/v3';

export async function getAnimeReleaseTime(anilistId) {
    const url = `${apiUrl}/anime?anilist-ids=${anilistId}`;
    const res = await fetch(url);
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
}

export async function applyAnimeReleaseTime(anime) {
    const releaseTime = await getAnimeReleaseTime(anime.media.id);
    if (releaseTime && anime.media.status === "RELEASING") {
        console.log("animeSchedule | found release time for", anime.media.title.english || anime.media.title.romaji);
        if (anime.media.nextAiringEpisode?.airingAt) {
            const nextDate = new Date(anime.media.nextAiringEpisode.airingAt * 1000);
            nextDate.setUTCHours(releaseTime[0], releaseTime[1]);
            anime.media.nextAiringEpisode.airingAt = Math.floor(nextDate.getTime() / 1000);
        }
        if (anime.media.lastEpisode?.timestamp) {
            const lastDate = new Date(anime.media.lastEpisode.timestamp * 1000);
            lastDate.setUTCHours(releaseTime[0], releaseTime[1]);
            anime.media.lastEpisode.timestamp = Math.floor(lastDate.getTime() / 1000);
        }
    }
}