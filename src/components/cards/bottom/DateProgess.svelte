<script>
    import Rewatch from "../../icons/Rewatch.svelte";
    import { formatDateLocale } from "$lib/utils/formatDateLocale";

    import { _, locale as localeStore, date } from "svelte-i18n"
    import { get } from "svelte/store";

    const locale = get(localeStore)

    export let userStatus, startDate, progress, total, mediaType;

    let dict = {
        re: null,
    }

    if (mediaType === "anime") {
        dict.re = "rewatching"
    } else if (mediaType === "manga") {
        dict.re = "rereading"
    }
</script>

<div class="more">
    {#if userStatus === "REPEATING"}
    <div class="dates">
        <div class="start-date"><Rewatch/> {$_(dict.re)}</div>
    </div>
    {:else if startDate}
    <div class="dates">
        <div class="start-date">{$date(formatDateLocale(startDate), { month: 'numeric', day: 'numeric', year: 'numeric' })}</div>
    </div>
    {/if}
    <span class="episodes-info">{total ? `${progress}/${total}` : `${progress}/?`}</span>
</div>