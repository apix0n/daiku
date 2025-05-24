export function formatDateLocale(dateStr) {
    const date = new Date(`${dateStr}T00:00`); // Local midnight in client locale
    return date
}