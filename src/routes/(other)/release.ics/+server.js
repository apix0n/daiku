import ical from 'ical-generator';
import { config } from '$lib/server/config';
import { createHeaders } from '$lib/server/apiHeaders.js';

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
    const mangaCollectionUrl = baseUrl + "/api/get/mangacollec";
    const fetchOptions = { headers: createHeaders(request.headers) }

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

    const [animeData, planningData, mangacollecData] = await Promise.all([
        fetch(animeUrl, fetchOptions).then(res => res.json()),
        fetch(planningUrl, fetchOptions).then(res => res.json()),
        fetch(mangaCollectionUrl, fetchOptions).then(res => res.json())
    ]);

    animeData.current.forEach((anime) => {
        const eventId = anime.mediaLink?.replace(/^https?:\/\//, '')
            .replace(/\.[a-z]+\//, '-')
            .replace(/\/$/, '');

        if (anime.lastEpisode) {
            cal.createEvent({
                start: new Date(anime.lastEpisode.timestamp * 1000),
                end: new Date(anime.lastEpisode.timestamp * 1000 + anime.episodesDuration * 60 * 1000),
                summary: anime.title,
                location: `Episode ${anime.lastEpisode.number}`,
                url: anime.mediaLink,
                id: `${eventId}-ep${anime.lastEpisode.number}`
            });
        };
        if (anime.nextEpisode) {
            cal.createEvent({
                start: new Date(anime.nextEpisode.timestamp * 1000),
                end: new Date(anime.nextEpisode.timestamp * 1000 + anime.episodesDuration * 60 * 1000),
                summary: anime.title,
                location: `Episode ${anime.nextEpisode.number}`,
                url: anime.mediaLink,
                id: `${eventId}-ep${anime.nextEpisode.number}`
            });
        }
    });

    planningData.anime = planningData.anime.filter(anime =>
        (anime.status === 'NOT_YET_RELEASED' && anime.startDate?.length === 10) ||
        (anime.status === 'RELEASING' && anime.nextEpisode && anime.nextEpisode.number - 1 === 1)
    );
    planningData.anime.forEach(anime => {
        const eventId = anime.mediaLink?.replace(/^https?:\/\//, '')
            .replace(/\.[a-z]+\//, '-')
            .replace(/\/$/, '');

        cal.createEvent({
            start: new Date(anime.startDate),
            allDay: true,
            summary: anime.title,
            location: "Episode 1",
            id: `${eventId}-start`
        })
    })

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
                const eventId = `manga-${series.titre.toLowerCase().replace(/\s+/g, '-')}-${volume.numeroTome}`;
                cal.createEvent({
                    start: new Date(volume.releaseDate),
                    allDay: true,
                    summary: `Tome ${volume.numeroTome} - ${series.titre}`,
                    id: eventId
                })
            })
        })
    })

    if (!cache.data || cache.maxTimestamp > time) {
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