<script>
    export let ids, mediaType;
    import { getLinkFromId } from "$lib/getLinkFromId";

    import Tmdb from "../icons/platforms/TMDB.svelte";
    import AniList from "../icons/platforms/AniList.svelte";
    import MyAnimeList from "../icons/platforms/MyAnimeList.svelte";
    
</script>

<div class="buttons-wrapper">
    More info:    
    <div class="buttons">
        {#each Object.entries(ids) as [key, id]}
            <a href="{getLinkFromId(id, key, mediaType)}" target="_blank">
            {#if key === "myanimelist"}
                <MyAnimeList />
            {:else if key === "tmdb"}
                <Tmdb />
            {:else if key === "anilist"}
                <AniList />
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
        background: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.3);
        backdrop-filter: blur(5px);
        border-radius: 10px;
        margin-top: 10px;
    }

    .buttons {
        display: flex;
        gap: 8px;
        height: 35px;
    }

    a {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        height: 100%;
        padding: 0px;
        border-radius: 6px;
        :global svg {
            height: 100%;
            aspect-ratio: 1/1;
            padding: 0 5px;
            border-radius: 6px;
        }
    }
</style>