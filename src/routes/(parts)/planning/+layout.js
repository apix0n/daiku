import { loadPlannedData } from '$lib/client/data.js';

export const load = async ({ fetch }) => {
    const plannedData = (await loadPlannedData()).plannedData;
    return { plannedData };
};