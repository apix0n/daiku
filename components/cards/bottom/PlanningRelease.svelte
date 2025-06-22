<script lang="ts">
    import { _, locale as localeStore, date as dateI18N } from 'svelte-i18n';
    import { getRelativeTime } from "$lib/utils/getRelativeTime";
    import type { MediaStatus, MediaType } from "$lib/types/media";

    export let dateString: string | undefined = undefined, status: typeof MediaStatus[number], mediaType: typeof MediaType[number] | undefined = undefined;

    $: locale = $localeStore ?? "en";
    let displayedDate = '';

    $: {
        if (!dateString && status === "notYetReleased") {
            displayedDate = $_("announced");
        } else if (!dateString && status === "airing") {
            displayedDate = $_("releasing");
        }

        const date = dateString ? new Date(dateString) : new Date(NaN);
        const now = new Date();
        const fourteenDaysInMs = 14 * 24 * 60 * 60 * 1000;
        
        if (dateString) {
            if (dateString.length === 4) {
                displayedDate = $_('releasingDate.inDateN', { values: { n: date.getFullYear() }});
            } else if (dateString.length === 7) {
                const formattedDate = $dateI18N(date, { year: 'numeric', month: 'short' });
                displayedDate = $_('releasingDate.inDateN', { values: { n: formattedDate }});
            } else if (dateString.length === 10) {
                if (Math.abs(now.getTime() - date.getTime()) <= fourteenDaysInMs) {
                    displayedDate = $_('releasingDate.onDateN', { values: { n: getRelativeTime(locale, date) }});
                } else if (mediaType === 'movie') {
                    const formattedDate = $dateI18N(date, { year: 'numeric', month: 'short', day: 'numeric' });
                    displayedDate = $_('releasingDate.onDateNSingle', { values: { n: formattedDate }});
                } else {
                    const formattedDate = $dateI18N(date, { year: 'numeric', month: 'short', day: 'numeric' });
                    displayedDate = $_('releasingDate.onDayN', { values: { n: formattedDate }});
                }
            }
        }
    }
</script>

<span class="episodes-info">{displayedDate}</span>