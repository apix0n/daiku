export const apiUrl = 'https://graphql.anilist.co';
export const siteUrl = 'https://anilist.co'

import type { AniListDate } from "$lib/types/anilist";

import { applyPosterOverrides } from '../overrides/anilist';
export { applyPosterOverrides };

export async function fetchGraphQL(query: string, variables: Object) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5-second timeout (fallback to cache if it takes longer than 5sec.)

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables }),
            signal: controller.signal
        });
        clearTimeout(timeout);
        if (!response.ok) throw new Error("HTTP error " + response.status);
        return await response.json();
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching data from API:", error.message);
        } else {
            console.error("Error fetching data from API:", error);
        }
        return []
    }
}

export function formatDate(date: AniListDate) {
    if (date.year == null || date.month == null || date.day == null) {
        return null;
    }
    const month = date.month.toString().padStart(2, '0');
    const day = date.day.toString().padStart(2, '0');
    return `${date.year}-${month}-${day}`
};

export function planningFormatDate(startDate: AniListDate | null) {
    if (!startDate) return null;
    const { year, month, day } = startDate;
    if (year && month && day) {
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    } else if (year && month) {
        return `${year}-${String(month).padStart(2, '0')}`;
    } else if (year) {
        return `${year}`;
    } else {
        return null;
    }
}

export async function getUserId(username: string) {
    const query = `
        query User($name: String) {
          User(name: $name) {
            id
          }
        }`;
    const response = await fetchGraphQL(query, { name: username });
    // if (!response.ok) throw new Error("HTTP error " + response.status);
    return response.data.User.id;
}

import type { MediaStatus, UserMediaStatus } from "$lib/types/media";
import type { AniListMediaStatus, AniListUserMediaStatus } from "$lib/types/anilist";

export function mapAniListMediaStatus(status: typeof AniListMediaStatus[number]): typeof MediaStatus[number] {
    switch (status) {
        case 'RELEASING':
            return 'airing';
        case 'FINISHED':
            return 'finished';
        case 'NOT_YET_RELEASED':
            return 'notYetReleased';
        case 'CANCELLED':
            return 'cancelled';
        case 'HIATUS':
            return 'hiatus';
        default:
            return 'finished';
    }
}

export function mapAniListUserStatus(status: typeof AniListUserMediaStatus[number]): typeof UserMediaStatus[number] {
    switch (status) {
        case 'CURRENT':
            return 'current';
        case 'PLANNING':
            return 'planned';
        case 'COMPLETED':
            return 'finished';
        case 'DROPPED':
            return 'dropped';
        case 'PAUSED':
            return 'paused';
        case 'REPEATING':
            return 'repeating';
        default:
            return 'finished';
    }
}