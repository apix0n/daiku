<script>
    export let ids, mediaType;
    import { getLinkFromId } from "$lib/utils/getLinkFromId";

    import Tmdb from "../icons/platforms/TMDB.svelte";
    import AniList from "../icons/platforms/AniList.svelte";
    import MyAnimeList from "../icons/platforms/MyAnimeList.svelte";
    import Imdb from "$components/icons/platforms/IMDB.svelte";
    import Letterboxd from "$components/icons/platforms/Letterboxd.svelte";
    import { _ } from "svelte-i18n";
</script>

<div class="buttons-wrapper">
    {$_('moreInfo')}
    <div class="buttons">
        {#each Object.entries(ids).filter(a => a[1] != null) as [key, id]}
            <a href="{getLinkFromId(id, key, mediaType)}" target="_blank">
            {#if key === "myanimelist"}
                <MyAnimeList />
            {:else if key === "tmdb"}
                <Tmdb />
            {:else if key === "anilist"}
                <AniList />
            {:else if key === "imdb"}
                <Imdb />
            {:else if key === "letterboxd" || key === "boxdit"}
                <Letterboxd />
            {/if}
            </a>
        {/each}
    </div>
</div>

<style>
    .buttons-wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 5px;
        padding: 5px 10px;
        background: var(--transparent);
        border: 1px solid var(--transparent);
        backdrop-filter: blur(5px);
        border-radius: 10px;
        margin-top: 10px;
    }

    .buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    a {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        height: 35px;
        padding: 0px;
        border-radius: 6px;
        transition: all .2s;
        :global svg {
            height: 100%;
            aspect-ratio: 1/1;
            padding: 0 5px;
            border-radius: 6px;
        }
        &:hover {
            scale: 1.05;
        }
    }
</style>