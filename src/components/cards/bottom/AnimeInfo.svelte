<script>
    import { _ } from "svelte-i18n";
    import Rewatch from "../../icons/Rewatch.svelte";

    export let duration, rewatch, number;
</script>

<span class="episodes-info">
    {#if number !== undefined && number !== 1}
        {#if rewatch}
            {$_("NepisodesShort", { values: { n: number ? number : '?' }})} 
        {:else}
            {$_("Nepisodes", { values: { n: number ? number : '?' }})}
        {/if}
        ×
    {/if}
    {$_("NminutesShort", { values: { n: duration }})}

    {#if rewatch}
        <Rewatch Number={rewatch}/>
    {/if}
</span>