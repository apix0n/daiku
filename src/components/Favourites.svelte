<script>
    export let data;

    import { _ } from "svelte-i18n"

    function handleHover(event) {
        const list = event.target.closest('.list');
        const listRect = list.getBoundingClientRect();
        const tooltip = event.target.querySelector('::after');
        
        // Center relative to the visible part of the list
        const centerX = listRect.left + (listRect.width / 2);
        const centerY = listRect.top + (listRect.height / 2);
        
        event.target.style.setProperty('--tooltip-x', `${centerX}px`);
        event.target.style.setProperty('--tooltip-y', `${centerY}px`);
    }
</script>

<div class="favourites">
    <h2>{$_("favourites")}</h2>
    <div class="parent">
<!-- {JSON.stringify(data.favouritesData?.favourites)} -->
{#each data.favouritesData?.favourites as list}
    <div class="list">
    {#each list.favourites as item}
        <a href={item.link} data-title={item.name} on:mouseenter={handleHover}><img src={item.cover} alt="Cover of {item.name}"></a>
        <!-- {item.name} -->
    {/each}
    </div>
{/each}
</div>
</div>

<style>
    .favourites {
        background: var(--background-2);

        display: flex;
        flex-direction: column;
        padding: 0px 16px 16px 16px;
        /* gap: 18px; */

        width: 320px;
        height: 325px;

        border-radius: 17px;
        overflow-y: auto;
    }

    .parent {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .list {
        display: flex;
        background: var(--background-3);
        padding: 8px;
        gap: 8px;
        border-radius: 12px;
        height: 120px;
        width: 100%;
        overflow-y: auto;
        position: relative;
    }

    @supports not selector(::-webkit-scrollbar) {
        .list {
            scrollbar-width: thin;  /* Firefox */
            scrollbar-color: var(--background-4) var(--background-3);  /* Firefox */
        }
    }

    .list::-webkit-scrollbar {
        height: 9px;
        background: var(--background-3);
    }

    .list::-webkit-scrollbar-thumb {
        border: unset;
        background: var(--background-4);
        border-radius: 1em;
    }

    .list::-webkit-scrollbar-track {
        background: var(--background-3);
        border-radius: 12px;
    }

    .list::-webkit-scrollbar-thumb:hover {
        background: var(--background-3-hover);
    }

    .list img {
        border-radius: 6px;
        height: 100%;
    }
    
    /* TODO: fix width on ff */
    .list a {
        flex: 0;
        width: fit-content; 
    }

    .list a:hover::after {
        content: attr(data-title);
        position: fixed;  /* Change from static to fixed */
        left: var(--tooltip-x, 50%);
        top: var(--tooltip-y, 50%);
        transform: translate(-50%, -50%); /* Offset by half width/height */
        background: var(--background-2);
        box-shadow: inset 0 0 0 1px var(--background-3);
        border-radius: 5px;
        padding: 2px 8px;
        width: max-content;
        max-width: 10em;
        color: var(--text);
        z-index: 6;
        text-align: center;
        pointer-events: none; /* Prevent tooltip from blocking interactions */
    }
</style>