<script>
    export let chapters, volumes;

    import { _ } from "svelte-i18n";
</script>

{#if chapters > 0 || volumes > 0}
    <span class="episodes-info">
        {#if chapters === 1 && volumes === 1}
            {$_('Nvolumes', { values: { n: volumes }})}
        {:else}
            {#if chapters > 0}
                {$_('Nchapters', { values: { n: chapters }})}
            {/if}

            {#if chapters && volumes}
                ·
            {/if}

            {#if volumes}
                {$_('Nvolumes', { values: { n: volumes }})}
            {/if}
        {/if}
    </span>
{/if}