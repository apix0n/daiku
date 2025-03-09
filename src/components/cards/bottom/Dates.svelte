<script>
    export let start, end;

    import { formatDateLocale } from "$lib/formatDateLocale";

    import { _, locale as localeStore } from "svelte-i18n"
    import { get } from "svelte/store";

    const locale = get(localeStore)
</script>

<div class="more">
    {#if start === end && start}
    <div class="dates">
        <span class="finish-date">{formatDateLocale(end).toLocaleDateString(locale)}</span>
    </div>
    {:else if start && end}
    <div class="dates">
        <span class="start-date">{formatDateLocale(start).toLocaleDateString(locale)}</span>
        <span class="finish-date">{formatDateLocale(end).toLocaleDateString(locale)}</span>
    </div>
    {/if}
</div>