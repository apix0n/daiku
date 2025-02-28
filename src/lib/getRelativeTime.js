export function getRelativeTime(date, unit = 'day') {
    const now = new Date();
    const targetDate = new Date(date);
    const diff = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()); // handle dates instead of Date() objects directly, else causes problems in difference of dates
    if (unit === 'day') {
        const diffInDays = Math.floor(diff / (1000 * 60 * 60 * 24));
        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
        return rtf.format(-diffInDays, 'day');
    } else if (unit === 'hour') {
        let diffInHours = Math.floor(new Date(now - targetDate) / (1000 * 60 * 60));
        if (diffInHours === 0) {
            diffInHours = 1;
        }
        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'always' });
        return rtf.format(-diffInHours, 'hour');
    } else if (unit === 'minute') {
        let diffInMinutes = Math.floor(new Date(now - targetDate) / (1000 * 60));
        if (diffInMinutes === 0) {
            diffInMinutes = 1;
        }
        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'always' });
        return rtf.format(-diffInMinutes, 'minute');
    }
}