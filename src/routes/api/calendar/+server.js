import ical from 'ical-generator';
import { config } from '$lib/server/config';
import { createHeaders } from '$lib/server/apiHeaders.js';
import { getLinkFromId } from '$lib/utils/getLinkFromId.js';

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
        const eventId = anime.media.source + anime.media.id.anilist || anime.media.id.myanimelist;

        if (anime.media.episodes.last) {
            cal.createEvent({
                start: new Date(anime.media.episodes.last.timestamp),
                end: new Date(anime.media.episodes.last.timestamp + anime.media.runtime * 60),
                summary: anime.media.title.english || anime.media.title.romaji,
                location: `Episode ${anime.media.episodes.last.number}`,
                url: getLinkFromId(anime.media.id.anilist, anime.media.source, anime.media.type),
                id: `${eventId}-ep${anime.media.episodes.last.number}`
            });
        };
        if (anime.media.episodes.next) {
            cal.createEvent({
                start: new Date(anime.media.episodes.next.timestamp),
                end: new Date(anime.media.episodes.next.timestamp + anime.media.runtime * 60),
                summary: anime.media.title.english || anime.media.title.romaji,
                location: `Episode ${anime.media.episodes.next.number}`,
                url: getLinkFromId(anime.media.id.anilist, anime.media.source, anime.media.type),
                id: `${eventId}-ep${anime.media.episodes.next.number}`
            });
        }
    });

    planningData.anime = planningData.anime.filter(anime =>
        (anime.media.status === 'NOT_YET_RELEASED' && (anime.media.dates.start?.length === 10 || anime.media.episodes.next)) ||
        (anime.media.status === 'RELEASING' && anime.media.episodes.next && anime.media.episodes.next.number - 1 === 1)
    );
    planningData.anime.forEach(anime => {
        const eventId = anime.media.source + anime.media.id.anilist || anime.media.id.myanimelist;
        
        if (anime.media.episodes.next) {
            cal.createEvent({
                start: new Date(anime.media.episodes.next.timestamp),
                end: new Date(anime.media.episodes.next.timestamp + anime.media.runtime * 60),
                summary: anime.media.title.english || anime.media.title.romaji,
                location: `Episode ${anime.media.episodes.next.number}`,
                url: getLinkFromId(anime.media.id.anilist, anime.media.source, anime.media.type),
                id: `${eventId}-ep${anime.media.episodes.next.number}`
            });
        } else if (anime.media.dates.start) {
            cal.createEvent({
                start: new Date(anime.media.dates.start),
                allDay: true,
                summary: anime.media.title.english || anime.media.title.romaji,
                location: "Episode 1",
                id: `${eventId}-start`
            })
        }
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
        cache.maxTimestamp = time + (config.apiCacheTime);
        cache.data = cal.toString();
    }
    console.log("release.ics | updated & served from cache")

    return new Response(cal.toString(), {
        headers: {
            'content-type': 'text/calendar',
        }
    });
}