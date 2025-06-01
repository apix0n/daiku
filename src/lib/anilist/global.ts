import { getRelativeTime } from "$lib/utils/getRelativeTime";
import type { MediaStatus, UserMediaStatus } from "$lib/types/media";
import type { AniListMediaStatus, AniListUserMediaStatus } from "$lib/types/anilist";

export function planningListFormatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const fourteenDaysInMs = 14 * 24 * 60 * 60 * 1000;

    if (dateString.length === 4) {
        return `releases in ${date.getFullYear()}`;
    } else if (dateString.length === 7) {
        return `releases in ${date.toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}`;
    } else if (dateString.length === 10) {
        if (Math.abs(now.getTime() - date.getTime()) <= fourteenDaysInMs) {
            return `starts ${getRelativeTime(undefined, date.toISOString())}`;
        }
        return `starts the ${date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}`;
    }
    return '';
}

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
            return 'repeating'; // Assuming repeating means it's currently airing
        default:
            return 'finished';
    }
}