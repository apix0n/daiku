import { getToken, selectBestImageUrls, ua } from "./global";
import type { FilmSummary, FilmsResponse } from "$lib/types/letterboxd";
import type { MediaElement } from "$lib/types/media";
import type { MovieRequest } from "$lib/types/requests";

async function fetchWatchListPage(lid: string, token: string, cursor?: string): Promise<FilmsResponse | null> {
    const params = new URLSearchParams({
        "perPage": "100",
    });

    if (cursor) {
        params.append("cursor", cursor);
    }

    try {
        const response = await fetch(`https://api.letterboxd.com/api/v0/member/${lid}/watchlist?` + params.toString(), {
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

export async function fetchWatchList(lid: string): Promise<FilmsResponse & { total: number }> {
    const token = await getToken();
    let allItems: FilmSummary[] = [];
    let nextCursor: string | undefined = undefined;

    do {
        const data = await fetchWatchListPage(lid, token, nextCursor);

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

export function makeWatchList(entriesList: FilmsResponse & { total: number }): MovieRequest {
    const WatchList = entriesList.items.filter(entry => {
        // Filter out TV shows
        const tmdbLink = entry.links.find(l => l.type === 'tmdb');
        return tmdbLink && !tmdbLink.url.includes('/tv/');
    }).map(entry => ({
        media: {
            title: {
                english: entry.name,
                native: entry.originalName || entry.name,
            },
            type: 'movie',
            source: 'letterboxd',
            cover: selectBestImageUrls(entry.poster.sizes),
            id: {
                tmdb: entry.links.find(l => l.type === 'tmdb')?.id,
                boxdit: entry.links.find(l => l.type === 'letterboxd')?.id,
            },
            runtime: entry.runTime,
            status: 'finished',
            special: false,
        },
        status: "finished",
    })) as MediaElement[];

    return {
        updatedAt: {
            service: 'Letterboxd',
            timestamp: new Date().toISOString(),
        },
        watched: WatchList,
    };
}

export async function boxdWatchList(lid: string): Promise<MovieRequest> {
    try {
        const data = await fetchWatchList(lid);
        return makeWatchList(data);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        throw new Error(`Failed to fetch Letterboxd watched movies: ${errorMessage}`);
    }
}