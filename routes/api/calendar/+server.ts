import ical from 'ical-generator';
import { config } from '$lib/server/config';
import { createHeaders } from '$lib/server/apiHeaders.js';
import { getLinkFromId } from '$lib/utils/getLinkFromId.js';
import { cacheStore } from '$lib/server/stores/cache.js';
import type { AnimeRequest, BookRequest, PlannedRequest } from '$lib/types/requests.js';
import { version } from '$app/environment';

const CACHE_KEY = "calendar";

export async function GET({ request, url }) {
    const now = Date.now();

    if (cacheStore.isFresh(CACHE_KEY, now)) {
        console.log("release.ics | found & served cache");
        const cachedData = cacheStore.get(CACHE_KEY)?.data;
        if (cachedData) {
            return new Response(cachedData, {
                headers: {
                    'content-type': 'text/calendar',
                }
            });
        }
    }

    const baseUrl = url.origin;
    const animeUrl = baseUrl + "/api/get/anilist/anime";
    const planningUrl = baseUrl + "/api/get/planned";
    const mangaCollectionUrl = baseUrl + "/api/get/books";
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

    const [animeData, planningData, bookData] = await Promise.all([
        fetch(animeUrl, fetchOptions).then(res => res.json()),
        fetch(planningUrl, fetchOptions).then(res => res.json()),
        fetch(mangaCollectionUrl, fetchOptions).then(res => res.json())
    ]) as [AnimeRequest, PlannedRequest, BookRequest];

    animeData.current.forEach((anime) => {
        const eventId = anime.media.source + anime.media.id.anilist || anime.media.id.myanimelist;

        if (anime.media.episodes?.last) {
            cal.createEvent({
                start: new Date(anime.media.episodes.last.timestamp),
                end: new Date(anime.media.episodes.last.timestamp + (anime.media.runtime || 30) * 60 * 1000),
                summary: anime.media.title.english || anime.media.title.romaji,
                location: `Episode ${anime.media.episodes.last.number}`,
                url: anime.media.id.anilist ? getLinkFromId(anime.media.id.anilist, anime.media.source, anime.media.type) : null,
                id: `${eventId}-ep${anime.media.episodes.last.number}`,
                x: {
                    'X-COVER': anime.media.cover.medium || anime.media.cover.small,
                    'X-MEDIA-TYPE': anime.media.type,
                }
            });
        };
        if (anime.media.episodes?.next) {
            cal.createEvent({
                start: new Date(anime.media.episodes.next.timestamp),
                end: new Date(anime.media.episodes.next.timestamp + (anime.media.runtime ?? 30) * 60 * 1000),
                summary: anime.media.title.english || anime.media.title.romaji,
                location: `Episode ${anime.media.episodes.next.number}`,
                url: anime.media.id.anilist ? getLinkFromId(anime.media.id.anilist, anime.media.source, anime.media.type) : null,
                id: `${eventId}-ep${anime.media.episodes.next.number}`,
                x: {
                    'X-COVER': anime.media.cover.medium || anime.media.cover.small,
                    'X-MEDIA-TYPE': anime.media.type,
                }
            });
        }
    });

    planningData.anime = planningData.anime.filter(anime =>
        (anime.media.status === 'notYetReleased' && (anime.media.dates?.start?.length === 10 || anime.media.episodes?.next)) ||
        (anime.media.status === 'airing' && anime.media.episodes?.next && anime.media.episodes.next.number - 1 === 1)
    );
    planningData.anime.forEach(anime => {
        const eventId = anime.media.source + anime.media.id.anilist || anime.media.id.myanimelist;

        if (anime.media.episodes?.next) {
            cal.createEvent({
                start: new Date(anime.media.episodes.next.timestamp),
                end: new Date(anime.media.episodes.next.timestamp + (anime.media.runtime || 30) * 60 * 1000),
                summary: anime.media.title.english || anime.media.title.romaji,
                location: `Episode ${anime.media.episodes.next.number}`,
                url: anime.media.id.anilist ? getLinkFromId(anime.media.id.anilist, anime.media.source, anime.media.type) : null,
                id: `${eventId}-ep${anime.media.episodes.next.number}`,
                x: {
                    'X-COVER': anime.media.cover.medium || anime.media.cover.small,
                    'X-MEDIA-TYPE': anime.media.type,
                }
            });
        } else if (anime.media.dates?.start) {
            cal.createEvent({
                start: new Date(anime.media.dates.start),
                allDay: true,
                summary: anime.media.title.english || anime.media.title.romaji,
                location: "Episode 1",
                id: `${eventId}-start`,
                x: {
                    'X-COVER': anime.media.cover.medium || anime.media.cover.small,
                    'X-MEDIA-TYPE': anime.media.type,
                }
            })
        }
    })

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    bookData.list = bookData.list
        .map(group => ({
            ...group,
            next: group.next.filter(volume => {
                if (!volume.releaseDate) return 0
                const releaseDate = new Date(volume.releaseDate);
                return releaseDate >= sevenDaysAgo;
            })
        }))
        .filter(group => group.next.length > 0);
    bookData.list.forEach(group => {
        group.next.forEach(volume => {
            const eventId = `volume-${group.title?.toLowerCase().replace(/\s+/g, '-')}-${volume.number}`;
            cal.createEvent({
                start: new Date(volume.releaseDate!),
                allDay: true,
                summary: `Volume ${volume.number} - ${group.title}`,
                id: eventId,
                x: {
                    'X-COVER': String(volume.cover?.medium || ''),
                    'X-MEDIA-TYPE': 'book',
                    'X-GROUP-NAME': group.title || '',
                    'X-NUMBER': String(volume.number || '')
                }
            })
        })
    })

    const calendarData = cal.toString();
    cacheStore.updateWithTTL(CACHE_KEY, calendarData, config.apiCacheTime);
    console.log("release.ics | updated & served new cache");

    // Return as text/plain if version is 'dev'
    if (version === 'dev') {
        return new Response(calendarData, {
            headers: {
                'content-type': 'text/plain; charset=utf-8',
            }
        });
    }

    return new Response(calendarData, {
        headers: {
            'content-type': 'text/calendar; charset=utf-8',
            'content-disposition': 'attachment; filename="daiku-calendar.ics"',
        }
    });
}