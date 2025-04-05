<script>
    import Image from "./Image.svelte";
    import Informations from "./Informations.svelte";
    import RelativeRelease from "../cards/top/RelativeRelease.svelte";
    import { createEventDispatcher } from 'svelte';
    import { getSynopsis } from '$lib/jikan/getSynopsis';
    import { synopsisCache, cacheSynopsis } from '$lib/stores/synopsisStore';
    const dispatch = createEventDispatcher();
    import { onMount, onDestroy } from 'svelte';

    export let fullscreen = false;
    export let entry;
    let synopsisPromise;

    // Check cache first, then fetch if needed
    $: if (entry?.media?.id?.myanimelist) {
        const malId = entry.media.id.myanimelist;
        if ($synopsisCache[malId]) {
            synopsisPromise = Promise.resolve($synopsisCache[malId]);
        } else {
            synopsisPromise = getSynopsis(malId).then(synopsis => {
                cacheSynopsis(malId, synopsis);
                return synopsis;
            });
        }
    }

    function close() {
        dispatch('close');
    }

    onMount(() => {
        document.body.classList.add('noscroll');
    });

    onDestroy(() => {
        document.body.classList.remove('noscroll');
    });
</script>

<div class="wrapper" data-fullscreen={fullscreen}>
    <div class="overlay">
        {#if !fullscreen}
            <button class="close" on:click={close}>×</button>
        {/if}
        <div class="content">
            <Image background={entry.media.cover.large} status={entry.media.status}>
                {#if entry.media.episodes.next && entry.media.status === "RELEASING"}
                    <RelativeRelease timestamp={Math.floor(entry.media.episodes?.next?.timestamp)} number={entry.media.episodes?.next?.number} mediaType={entry.media.type}/>
                {/if}
            </Image>
            <Informations 
                {entry} 
                synopsis={synopsisPromise}
            />
        </div>
        <div class="banner" style:--image-link="url({entry.media.banner?.large || entry.media.cover.large})" data-nobanner={!entry.media.banner?.large} alt=""></div>
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
        border-radius: 20px;
        max-width: 90%;
        height: 90%;
        aspect-ratio: 2/1;
        background-color: #111111;
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
        color: white;
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
        height: 40%;
        z-index: 0;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, #111111 90%), var(--image-link) center/cover no-repeat;
        opacity: .7;
    }

    .banner[data-nobanner="true"] {
        filter: blur(10px);
    }

    .close {
        position: absolute;
        top: 1rem;
        right: 1rem;
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
            top: 0.5rem;
            right: 0.5rem;
            position: fixed;
        }
    }
</style>