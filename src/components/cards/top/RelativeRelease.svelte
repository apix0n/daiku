<script lang="ts">
    import { getRelativeTime } from "$lib/utils/getRelativeTime";
    import { _, locale as localeStore } from "svelte-i18n";
    import type { MediaType } from "$lib/types/media";

    export let timestamp: number;
    export let number: number;
    export let mediaType: (typeof MediaType)[number];

    $: locale = $localeStore ?? "en";

    let datetimestamp = new Date(timestamp);
    const now = new Date();

    // Add validation check
    if (isNaN(datetimestamp.getTime())) {
        console.error("Invalid timestamp received:", timestamp);
        datetimestamp = now; // Fallback to current date
    }

    const dict = {
        media: "",
    };

    if (mediaType === "anime") {
        dict.media = "episodeNumberN";
    } else if (mediaType === "manga") {
        dict.media = "chapterNumberN";
    }

    // Vérifie si la date est aujourd'hui en comparant année/mois/jour
    const isToday =
        datetimestamp.getDate() === now.getDate() &&
        datetimestamp.getMonth() === now.getMonth() &&
        datetimestamp.getFullYear() === now.getFullYear();

    // Add check for tomorrow
    const isTomorrow =
        datetimestamp.getDate() === now.getDate() + 1 &&
        datetimestamp.getMonth() === now.getMonth() &&
        datetimestamp.getFullYear() === now.getFullYear();

    function getTimestampDate(locale: string) {
        if (isToday) {
            if (timestamp > Date.now()) {
                return $_("todayAt", {
                    values: {
                        time: datetimestamp.toLocaleTimeString([], {
                            timeStyle: "short",
                        }),
                    },
                });
            } else if (Date.now() - timestamp < 60 * 60 * 1000) {
                return getRelativeTime(locale, datetimestamp, "minute");
            } else {
                return getRelativeTime(locale, datetimestamp, "hour");
            }
        } else if (isTomorrow) {
            return (
                getRelativeTime(locale, datetimestamp) +
                " " +
                $_("todayAt", {
                    values: {
                        time: datetimestamp.toLocaleTimeString([], {
                            timeStyle: "short",
                        }),
                    },
                })
            );
        } else {
            return getRelativeTime(locale, datetimestamp);
        }
    }

    $: timestampDate = getTimestampDate(locale);
</script>

{$_(dict.media, { values: { n: number } })}
{timestampDate}
