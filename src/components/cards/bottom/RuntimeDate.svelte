<script>
    export let runtime, watchedDate;
    import { formatDateLocale } from "$lib/formatDateLocale";
    
    import { _, locale as localeStore } from "svelte-i18n";
    import { get } from "svelte/store";

  let locale = get(localeStore)
</script>

<div class="more">
  {#if runtime > 0}
    <span class="episodes-info">{$_("NminutesShort", { values: { n: runtime }})}</span>
  {/if}
  {#if watchedDate}
    <span class="finish-date">{formatDateLocale(watchedDate).toLocaleDateString(locale)}</span>
  {/if}
</div>