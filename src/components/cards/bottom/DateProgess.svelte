<script>
    import Rewatch from "../../icons/Rewatch.svelte";
    import { formatDateLocale } from "$lib/formatDateLocale";

    import { _, locale as localeStore } from "svelte-i18n"
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
        <span class="start-date">{formatDateLocale(startDate).toLocaleDateString(locale)}</span>
    </div>
    {/if}
    <span class="episodes-info">{total ? `${progress}/${total}` : `${progress}/?`}</span>
</div>