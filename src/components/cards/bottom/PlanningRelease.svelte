<script>
    import { _, locale as localeStore } from 'svelte-i18n';
    import { get } from 'svelte/store';
    import { getRelativeTime } from "$lib/getRelativeTime";

    export let dateString, status;

    // Get the current locale from the store.
    let locale = get(localeStore);
    let displayedDate = '';

    $: {
        const date = new Date(dateString);
        const now = new Date();
        const fourteenDaysInMs = 14 * 24 * 60 * 60 * 1000;
        
        if (!dateString && status === "NOT_YET_RELEASED") {
            displayedDate = $_("announced");
        } else if (!dateString && status === "RELEASING") {
            displayedDate = $_("releasing");
        } else if (dateString.length === 4) {
            displayedDate = $_('releasingDate.inDateN', { values: { n: date.getFullYear() }});
        } else if (dateString.length === 7) {
            const formattedDate = date.toLocaleDateString(locale, { year: 'numeric', month: 'short' });
            displayedDate = $_('releasingDate.inDateN', { values: { n: formattedDate }});
        } else if (dateString.length === 10) {
            if (Math.abs(now - date) <= fourteenDaysInMs) {
                displayedDate = $_('releasingDate.onDateN', { values: { n: getRelativeTime(locale, date) }});
            } else {
                const formattedDate = date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
                displayedDate = $_('releasingDate.onDayN', { values: { n: formattedDate }});
            }
        }
    }
</script>

<span class="episodes-info">{displayedDate}</span>