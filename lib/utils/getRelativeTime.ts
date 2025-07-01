export function getRelativeTime(locale: string = "en", date: string, unit: string = 'day') {
    const now = new Date();
    const targetDate = new Date(date);
    const diff = new Date(now.getTime() - targetDate.getTime());
    const diffDays = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()); // handle dates instead of Date() objects directly, else causes problems in difference of dates
    if (unit === 'day') {
        const diffInDays = Math.floor(diffDays / (1000 * 60 * 60 * 24));
        const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
        if (diffInDays < -14) {
            return rtf.format(Math.ceil(-diffInDays / 7), 'week');
        }
        return rtf.format(-diffInDays, 'day');
    } else if (unit === 'hour') {
        let diffInHours = Math.floor(diff.getTime() / (1000 * 60 * 60));
        if (diffInHours === 0) {
            diffInHours = 1;
        }
        const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'always' });
        return rtf.format(-diffInHours, 'hour');
    } else if (unit === 'minute') {
        let diffInMinutes = Math.floor(diff.getTime() / (1000 * 60));
        if (diffInMinutes === 0) {
            diffInMinutes = 1;
        }
        const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'always' });
        return rtf.format(-diffInMinutes, 'minute');
    } else if (unit === "month") {
        const years = now.getFullYear() - targetDate.getFullYear();
        const months = now.getMonth() - targetDate.getMonth();
        const diffInMonths = years * 12 + months;
        const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
        return rtf.format(-diffInMonths, 'month');
    }
}