<script>
    import { getRelativeTime } from "$lib/getRelativeTime";
    import { get } from "svelte/store"
    export let timestamp;
    export let number;
    export let mediaType;

    import { _, locale as localeStore } from "svelte-i18n"
    const locale = get(localeStore)

    const datetimestamp = new Date(timestamp * 1000)
    const now = new Date()

    const dict = {
        media: null
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

    let timestampDate = getRelativeTime(locale, datetimestamp);

    if (isToday) {
        if (timestamp > Date.now() / 1000) {
            timestampDate = `today at ${datetimestamp.toLocaleTimeString([], { timeStyle: 'short' })}`;
        } else if (timestamp - Date.now() / 1000 > -(60 * 60)) {
            timestampDate = getRelativeTime(locale, datetimestamp, 'minute');
        } else {
            timestampDate = getRelativeTime(locale, datetimestamp, 'hour');
        }
    }
</script>

<div class="informations top">
    <span class="next-episode" title={datetimestamp.toLocaleString()}>{$_(dict.media, { values: { n: number }})} {timestampDate}</span>
</div>