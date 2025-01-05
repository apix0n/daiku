import { getRelativeTime } from "$lib/getRelativeTime";

export function planningListFormatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const fourteenDaysInMs = 14 * 24 * 60 * 60 * 1000;

    if (dateString.length === 4) {
        return `releases in ${date.getFullYear()}`;
    } else if (dateString.length === 7) {
        return `releases in ${date.toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}`;
    } else if (dateString.length === 10) {
        if (Math.abs(now - date) <= fourteenDaysInMs) {
            return `starts ${getRelativeTime(date)}`;
        }
        return `starts the ${date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}`;
    }
    return '';
}