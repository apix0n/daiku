<script lang="ts">
    import type { MediaStatus, MediaType } from "$lib/types/media";

    export let background: string, status: typeof MediaStatus[number], mediaType: typeof MediaType[number] = 'anime';
</script>

<div class="image" 
    class:releasing={status === "airing" || status === "notYetReleased"} 
    class:notyet={status === "notYetReleased"}
    data-media-type={mediaType}
    >
    <img src={background} alt="Cover of the media" />
    <div class="info">
        <slot></slot>
    </div>
</div>

<style>
    .image {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        max-height: fit-content;
        align-items: flex-start;
        padding: 0px;
        height: 75%;
        aspect-ratio: 1 / 1.5;
        background: var(--transparent);
        border-radius: var(--border-radius);
    }

    .image[data-media-type="manga"] {
        aspect-ratio: 1 / 1.425;
    }

    .info {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 5px;
        width: 100%;
        &:empty {
            display: none;
        }
    }

    img {
        width: 100%;
        height: 100%;
        border-radius: var(--border-radius);
        object-fit: cover;
    }

    @media screen and (max-width: 1300px) {
        .image {
            height: 60%;
        }
    }

    @media screen and (max-width: 1000px) {
        .image {
            height: auto;
            min-width: 125px;
            width: 25%;
        }

        .info {
            display: none;
        }
    }
</style>
