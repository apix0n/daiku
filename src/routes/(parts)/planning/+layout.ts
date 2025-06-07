import { loadPlannedData } from '$lib/client/data.js';
import type { PlannedRequest } from '$lib/types/requests';

export const load = async ({ fetch }) => {
    const plannedData = (await loadPlannedData()).plannedData as PlannedRequest;
    return { plannedData };
};