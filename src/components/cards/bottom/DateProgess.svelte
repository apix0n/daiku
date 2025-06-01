<script lang="ts">
    import type { MediaType, UserMediaStatus } from "$lib/types/media";
    import Rewatch from "../../icons/Rewatch.svelte";
    import { formatDateLocale } from "$lib/utils/formatDateLocale";

    import { _, date } from "svelte-i18n"
    export let userStatus: typeof UserMediaStatus[number], startDate: string | undefined, progress: number, total: number, mediaType: typeof MediaType[number];

    let dict = {
        re: "rewatching" as string,
    }

    if (mediaType === "anime") {
        dict.re = "rewatching"
    } else if (mediaType === "manga") {
        dict.re = "rereading"
    }
</script>

<div class="more">
    {#if userStatus === "repeating"}
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