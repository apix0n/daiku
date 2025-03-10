import ical from 'ical-generator';
import { config } from '$lib/server/config';

console.log("release.ics | initialised cache")
const cache = {
    maxTimestamp: null,
    data: null
}

export async function GET({ request, url }) {
    const time = Date.now()

    if ((cache.maxTimestamp && cache.data) && time < cache.maxTimestamp) {
        console.log("release.ics | found & served cache")
        return new Response(cache.data, {
            headers: {
                'content-type': 'text/calendar',
            }
        });
    }

    const baseUrl = url.origin;
    const animeUrl = baseUrl + "/api/get/anilist/anime";
    const planningUrl = baseUrl + "/api/get/anilist/planning";
    const mangaCollectionUrl = baseUrl + "/api/get/mangacollec";;

    let cal = ical({
        name: 'daiku',
        description: `calendar subscription for my airing anime, planning anime and releasing manga volumes. from daiku (${url.host})`,
        prodId: {
            company: 'apix',
            product: 'daiku',
            language: 'EN'
        },
        ttl: 21600
    });

    let animeResponse = await fetch(animeUrl);
    let animeData = await animeResponse.json();
    animeData.current.forEach((anime) => {
        if (anime.lastEpisode) {
            cal.createEvent({
                start: new Date(anime.lastEpisode.timestamp * 1000),
                end: new Date(anime.lastEpisode.timestamp * 1000 + anime.episodesDuration * 60 * 1000),
                summary: anime.title,
                location: `Episode ${anime.lastEpisode.number}`,
                url: anime.mediaLink
            });
        };
        if (anime.nextEpisode) {
            cal.createEvent({
                start: new Date(anime.nextEpisode.timestamp * 1000),
                end: new Date(anime.nextEpisode.timestamp * 1000 + anime.episodesDuration * 60 * 1000),
                summary: anime.title,
                location: `Episode ${anime.nextEpisode.number}`,
                url: anime.mediaLink
            });
        }
    });

    let planningResponse = await fetch(planningUrl);
    let planningData = await planningResponse.json();
    planningData.anime = planningData.anime.filter(anime =>
        (anime.status === 'NOT_YET_RELEASED' && anime.startDate?.length === 10) ||
        (anime.status === 'RELEASING' && anime.nextEpisode && anime.nextEpisode.number - 1 === 1)
    );
    planningData.anime.forEach(anime => {
        cal.createEvent({
            start: new Date(anime.startDate),
            allDay: true,
            summary: anime.title,
            location: "Episode 1"
        })
    })

    let mangacollecResponse = await fetch(mangaCollectionUrl);
    let mangacollecData = await mangacollecResponse.json();
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    mangacollecData.collection = mangacollecData.collection.filter(series =>
        series.editions.some(edition => {
            edition.next = edition.next.filter(volume => {
                const releaseDate = new Date(volume.releaseDate);
                return releaseDate >= sevenDaysAgo;
            });
            return edition.possessions.length >= 1 && edition.next.length > 0;
        })
    );
    mangacollecData.collection.forEach(series => {
        series.editions.forEach(edition => {
            edition.next.forEach(volume => {
                cal.createEvent({
                    start: new Date(volume.releaseDate),
                    allDay: true,
                    summary: `Tome ${volume.numeroTome} - ${series.titre}`,
                })
            })
        })
    })

    if (!cache.data || new Date(cache.data.updatedAt) < time) {
        cache.maxTimestamp = time + (config.apiCacheTime * 1000);
        cache.data = cal.toString();
    }
    console.log("release.ics | updated & served from cache")

    return new Response(cal.toString(), {
        headers: {
            'content-type': 'text/calendar',
        }
    });
}