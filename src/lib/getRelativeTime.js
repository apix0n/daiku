export function getRelativeTime(date) {
    const now = new Date();
    const targetDate = new Date(date);
    const diff = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()); // handle dates instead of Date() objects directly, else causes problems in difference of dates
    const diffInDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    return rtf.format(-diffInDays, 'day');
}