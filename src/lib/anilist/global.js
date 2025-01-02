export function planningListFormatDate(dateString) {
    const date = new Date(dateString);
    if (dateString.length === 4) {
        return date.getFullYear();
    } else if (dateString.length === 7) {
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
    } else if (dateString.length === 10) {
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }
    return '';
}