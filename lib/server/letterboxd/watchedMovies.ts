import { getToken, mapLinksToIdentifiers, selectBestImageUrls, ua } from "./global";
import type { LogEntriesResponse, LogEntry } from "$lib/types/letterboxd";
import type { MediaElement } from "$lib/types/media";
import type { MovieRequest } from "$lib/types/requests";

async function fetchWatchedMoviesPage(lid: string, token: string, cursor?: string): Promise<LogEntriesResponse | null> {
    const params = new URLSearchParams({
        "member": lid,
        "perPage": "100",
        "sort": "Date"
    });

    if (cursor) {
        params.append("cursor", cursor);
    }

    try {
        const response = await fetch("https://api.letterboxd.com/api/v0/log-entries?" + params.toString(), {
            headers: {
                'user-agent': ua,
                'authorization': token,
            }
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function fetchWatchedMovies(lid: string): Promise<LogEntriesResponse & { total: number }> {
    const token = await getToken();
    let allItems: LogEntry[] = [];
    let nextCursor: string | undefined = undefined;

    do {
        const data = await fetchWatchedMoviesPage(lid, token, nextCursor);

        if (!data) {
            break;
        }

        allItems = [...allItems, ...data.items];
        nextCursor = data.next;
    } while (nextCursor);

    return {
        items: allItems,
        total: allItems.length
    };
}

export function makeWatchedMoviesList(entriesList: LogEntriesResponse & { total: number }): MovieRequest {
    const watchedMovies = entriesList.items.filter(entry => {
        // Filter out TV shows
        const tmdbLink = entry.film.links.find(l => l.type === 'tmdb');
        return tmdbLink && !tmdbLink.url.includes('/tv/');
    }).map(entry => ({
        media: {
            title: {
                english: entry.film.name,
                native: entry.film.originalName || entry.film.name,
            },
            type: 'movie',
            source: 'letterboxd',
            cover: selectBestImageUrls(entry.film.poster.sizes),
            id: mapLinksToIdentifiers(entry.film.links),
            runtime: entry.film.runTime,
            status: 'finished',
            special: false,
        },
        review: {
            rating: Math.round(entry.rating * 2), // Convert 0-5 scale to 0-10
            text: entry.review?.text,
            isSpoiler: entry.review?.containsSpoilers || false,
            isHtml: true
        },
        repeat: entry.diaryDetails.rewatch,
        dates: {
            finished: entry.diaryDetails.diaryDate,
        },
        status: "finished",
    })) as MediaElement[];

    return {
        updatedAt: {
            service: 'Letterboxd',
            timestamp: new Date().toISOString(),
        },
        watched: watchedMovies,
    };
}

export async function boxdWatchedMovies(lid: string): Promise<MovieRequest> {
    try {
        const data = await fetchWatchedMovies(lid);
        return makeWatchedMoviesList(data);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        throw new Error(`Failed to fetch Letterboxd watched movies: ${errorMessage}`);
    }
}