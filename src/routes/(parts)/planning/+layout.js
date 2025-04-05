import { dataStore } from '$lib/stores/dataStore';

export const load = async ({ fetch }) => {
    const storedData = dataStore.get('plannedData');
    if (storedData) {
        return { plannedData: storedData };
    }

    const plannedData = await fetch('/api/get/anilist/planning').then(r => r.json());
    dataStore.set('plannedData', plannedData);
    return { plannedData };
};