export const apiUrl = 'https://graphql.anilist.co';
export const siteUrl = 'https://anilist.co'

export async function fetchGraphQL(query, variables) {
    // const controller = new AbortController();
    // const timeout = setTimeout(() => controller.abort(), 5000); // 5-second timeout (fallback to cache if it takes longer than 5sec.)

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables }),
            // signal: controller.signal
        });
        // clearTimeout(timeout);
        if (!response.ok) throw new Error("HTTP error " + response.status);
        return await response.json();
    } catch (error) {
        console.error("Error fetching data from API:", error.message);
        return []
    }
}

export function formatDate(date) {
    if (date.year == null || date.month == null || date.day == null) {
        return null;
    }
    date.month = date.month.toString().padStart(2, '0');
    date.day = date.day.toString().padStart(2, '0');
    return `${date.year}-${date.month}-${date.day}`
};

export function planningFormatDate(startDate) {
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

export async function getUserId(username) {
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