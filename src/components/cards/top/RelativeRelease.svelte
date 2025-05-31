<script>
    import { getRelativeTime } from "$lib/utils/getRelativeTime";
    import { get } from "svelte/store"
    export let timestamp, number, mediaType;

    import { _, locale as localeStore } from "svelte-i18n"
    const locale = get(localeStore)

    const datetimestamp = new Date(timestamp)
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