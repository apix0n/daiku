<script lang="ts">
    import Image from "./Image.svelte";
    import Informations from "./Informations.svelte";
    import RelativeRelease from "../cards/top/RelativeRelease.svelte";
    import { createEventDispatcher } from 'svelte';
    import { getSynopsis } from '$lib/client/jikan/getSynopsis';
    import { synopsisCache, cacheSynopsis } from '$lib/client/stores/synopsisStore';
    const dispatch = createEventDispatcher();
    import { onMount, onDestroy } from 'svelte';
    import { haptic } from "$lib/client/haptics";
    import type { MediaElement, MediaSynopsis } from "$lib/types/media";

    export let fullscreen = false;
    export let entry: MediaElement;
    let synopsisPromise: Promise<MediaSynopsis>;

    // Check cache first, then fetch if needed
    $: if (entry?.media?.id?.myanimelist && !entry.media.synopsis) {
        const malId = entry.media.id.myanimelist;
        if ($synopsisCache[malId]) {
            synopsisPromise = Promise.resolve($synopsisCache[malId]);
        } else {
            synopsisPromise = getSynopsis(malId, entry.media.type).then(synopsis => {
                if (synopsis) {  // Only cache if synopsis is not null
                    cacheSynopsis(malId, synopsis);
                    return synopsis;
                }
                // Provide fallback MediaSynopsis object
                return {
                    text: 'No synopsis available.',
                    source: '',
                } as MediaSynopsis;
            }).catch(() => ({
                text: 'Failed to load synopsis.',
                source: '',
            } as MediaSynopsis));  // Handle potential errors
        }
    }

    function close() {
        dispatch('close');
    }
    
    onMount(() => {
        haptic();
    });
    
    onDestroy(() => {
        haptic();
    });
</script>

<div class="wrapper" data-fullscreen={fullscreen}>
    <div class="overlay">
        {#if !fullscreen}
            <button class="close" on:click={close}>×</button>
        {/if}
        <div class="content">
            <Image background={entry.media.cover.large || entry.media.cover.medium} status={entry.media.status} mediaType={entry.media.type}>
                {#if entry.media.type === "anime" && entry.media.episodes?.next && entry.media.status === "airing"}
                    <RelativeRelease timestamp={Math.floor(entry.media.episodes?.next?.timestamp)} number={entry.media.episodes?.next?.number} mediaType={entry.media.type}/>
                {:else if entry.media.type === "manga" && entry.media.chapters?.last && entry.media.status === "airing"}
                    <RelativeRelease timestamp={Math.floor(entry.media.chapters?.last?.timestamp)} number={entry.media.chapters?.last?.number} mediaType={entry.media.type}/>
                {/if}
            </Image>
            <Informations 
                {entry} 
                synopsis={synopsisPromise}
            />
        </div>
        <div class="banner" style:--image-link="url({entry.media.banner?.large || entry.media.cover.large})" data-nobanner={!entry.media.banner?.large}></div>
    </div>
</div>

<style>
    .wrapper {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100vh;
        height: 100dvh;
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);
    }

    .overlay {
        border-radius: var(--border-radius);
        max-width: 90%;
        height: 90%;
        aspect-ratio: 2/1;
        background-color: var(--background-2);
        position: relative;
        overflow-y: hidden;
        font-size: 1.1em;
    }
    
    .wrapper[data-fullscreen="true"] .overlay {
        max-width: 100%;
        height: 100%;
        border-radius: 0;
    }
    
    .content {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        gap: 40px;
        z-index: 2;
        padding: 0 5rem;
    }

    .banner {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 50%;
        z-index: 0;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, var(--background-2) 90%), var(--image-link) top/cover no-repeat;
        opacity: .7;
    }

    .banner[data-nobanner="true"] {
        &::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            backdrop-filter: blur(10px);
        }
    }

    .close {
        position: absolute;
        padding: 2rem;
        top: 0;
        right: 0;
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--text);
        cursor: pointer;
        z-index: 3;
        line-height: 1em;
    }

    @media screen and (max-width: 1200px) {
        .overlay {
            width: 95%;
            height: 95%;
        }

        .content {
            padding: 0 2rem;
        }
    }

    @media screen and (max-width: 900px) {
        .overlay {
            max-width: unset;
            width: 100%;
            height: 100%;
            border-radius: 0;
            font-size: revert;
            overflow-y: auto;
        }
        
        .content {
            margin-top: env(safe-area-inset-top);
            margin-left: env(safe-area-inset-left);
            margin-right: env(safe-area-inset-right);
            justify-content: unset;
            flex-direction: column;
            gap: 20px;
            padding: 2rem 1rem;
            height: unset;
        }

        .banner {
            height: 35%;
        }

        .close {
            padding: 1em;
            top: -.5em;
            right: .5em;
            margin-top: env(safe-area-inset-top);
            position: fixed;
        }
    }

    @media screen and (max-width: 900px) and (display-mode: standalone) {
        .overlay::before {
            /* progressive blur for the ios status */
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: env(safe-area-inset-top);
            z-index: 5;
            mask: linear-gradient(black, black, transparent);
            backdrop-filter: blur(10px);
        }
    }
</style>