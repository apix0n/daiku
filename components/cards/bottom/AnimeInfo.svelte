<script lang="ts">
    import { _ } from "svelte-i18n";
    import Rewatch from "../../icons/Rewatch.svelte";

    export let duration: number = 0, rewatch: number | boolean | null = null, number: number | undefined = undefined;

    if (number === null) {
        number = 0
    }
</script>

<span class="episodes-info">
    {#if number != undefined && number !== 1}
        {#if rewatch}
            {$_("NepisodesShort", { values: { n: number }})} 
        {:else}
            {$_("Nepisodes", { values: { n: number }})}
        {/if}
    {/if}
    
    {#if number != undefined && number !== 1 && duration > 0}
        ×
    {/if}

    {#if duration > 0}
        {$_("NminutesShort", { values: { n: duration }})}
    {/if}

    {#if rewatch}
        <Rewatch Number={rewatch}/>
    {/if}
</span>