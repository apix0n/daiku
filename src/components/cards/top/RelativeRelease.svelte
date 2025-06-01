<script lang="ts">
    import { getRelativeTime } from "$lib/utils/getRelativeTime";
    import { get } from "svelte/store";
    import { _, locale as localeStore } from "svelte-i18n";
    import type { MediaType } from "$lib/types/media";

    export let timestamp: number;
    export let number: number;
    export let mediaType: typeof MediaType[number];
    
    const locale = get(localeStore) ?? 'en';

    // Ensure timestamp is a valid number
    const validTimestamp = typeof timestamp === 'number' ? timestamp : parseInt(timestamp);
    
    let datetimestamp = new Date(validTimestamp);
    const now = new Date();

    // Add validation check
    if (isNaN(datetimestamp.getTime())) {
        console.error("Invalid timestamp received:", timestamp);
        datetimestamp = now; // Fallback to current date
    }

    const dict = {
        media: ''
    }

    if (mediaType === "anime") {
        dict.media = "episodeNumberN"
    } else if (mediaType === "manga") {
        dict.media = "chapterNumberN"
    }
    
    // Vérifie si la date est aujourd'hui en comparant année/mois/jour
    const isToday = datetimestamp.getDate() === now.getDate() &&
                    datetimestamp.getMonth() === now.getMonth() &&
                    datetimestamp.getFullYear() === now.getFullYear();

    // Add check for tomorrow
    const isTomorrow = datetimestamp.getDate() === now.getDate() + 1 &&
                      datetimestamp.getMonth() === now.getMonth() &&
                      datetimestamp.getFullYear() === now.getFullYear();

    let timestampDate = getRelativeTime(locale, datetimestamp);

    if (isToday) {
        if (timestamp > Date.now()) {
            timestampDate = $_("todayAt", { values: { time: datetimestamp.toLocaleTimeString([], { timeStyle: 'short' })}})
        } else if (Date.now() - timestamp < 60 * 60 * 1000) {
            timestampDate = getRelativeTime(locale, datetimestamp, 'minute');
        } else {
            timestampDate = getRelativeTime(locale, datetimestamp, 'hour');
        }
    } else if (isTomorrow) {
        timestampDate = getRelativeTime(locale, datetimestamp) + " " + $_("todayAt", { values: { time: datetimestamp.toLocaleTimeString([], { timeStyle: 'short' })}})
    }
</script>

{$_(dict.media, { values: { n: number }})} {timestampDate}