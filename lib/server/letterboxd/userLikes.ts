import { getToken, mapLinksToIdentifiers, selectBestImageUrls, ua } from "./global";
import type { LogEntriesResponse, LogEntry, Member } from "$lib/types/letterboxd";
import type { FavouritesElement, MediaElement } from "$lib/types/media";
import type { FavouritesRequest } from "$lib/types/requests";
import { replaceByTmdb } from "../tmdb/replaceByTmdb";

export async function fetchUserInfo(lid: string): Promise<Member | null> {
	const token = await getToken();
	try {
		const response = await fetch(`https://api.letterboxd.com/api/v0/member/${lid}/`, {
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

function makeMediaElements(memberInfo: Member): MediaElement[] {
	const mediaElements: MediaElement[] = memberInfo.favoriteFilms.map(entry => ({
		media: {
			type: 'movie',
			title: {
				english: entry.name,
				native: entry.originalName || entry.name,
			},
			source: 'letterboxd',
			cover: selectBestImageUrls(entry.poster.sizes),
			link: entry.links.find(l => l.type === 'letterboxd')?.url || '',
			id: mapLinksToIdentifiers(entry.links),
			runtime: entry.runTime,
			status: 'finished',
			special: false,
		},
		status: 'favourite',
		review: null,
	} as MediaElement));

	return mediaElements;
}

async function handleBoxdFavourites(mediaElements: MediaElement[]): Promise<FavouritesRequest> {
	const replaced = await replaceByTmdb(mediaElements);
	const likes = replaced.map(entry => ({
		name: entry.media.title,
		source: 'letterboxd',
		cover: entry.media.cover,
		id: entry.media.id,
	} as FavouritesElement));

	return {
		updatedAt: {
			service: 'Letterboxd',
			timestamp: new Date().toISOString(),
		},
		favourites: [
			{
				type: 'movie',
				favourites: likes,
			}
		],
	};
}

export async function makeBoxdFavouritesList(lid: string): Promise<FavouritesRequest> {
	try {
		const data = await fetchUserInfo(lid);
		if (!data) {
			throw new Error("Failed to fetch user info from Letterboxd.");
		}
		const mediaElements = makeMediaElements(data);
		const favourites = await handleBoxdFavourites(mediaElements);
		return favourites;
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
		throw new Error(`Failed to fetch Letterboxd watched movies: ${errorMessage}`);
	}
}