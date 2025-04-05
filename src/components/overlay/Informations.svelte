<script>
    import LinkButtons from "./LinkButtons.svelte";
    import { _ } from "svelte-i18n";
    import AnimeInfo from "../cards/bottom/AnimeInfo.svelte";
    import MangaInfo from "../cards/bottom/MangaInfo.svelte";
    import UserInfo from "./UserInfo.svelte";
    export let entry, synopsis = undefined;
</script>

<div class="informations">
    <div class="top">
        <div class="title">
            <h1>{entry.media.title.english || entry.media.title.romaji}</h1>
        </div>
        <span class="sub">
            {#if entry.media.title.english !== entry.media.title.romaji}
                <i>{entry.media.title.romaji}</i> ·
            {/if}
            {#if entry.media.status !== "FINISHED"}
                {entry.media.status.toLowerCase()} ·
            {/if}
            {entry.media.type.toLowerCase()}
            {#if entry.media.type === "anime"}
                · <AnimeInfo
                    number={entry.media.episodes.count}
                    duration={entry.media.runtime}
                />
            {/if}
            {#if entry.media.type === "manga"}
                · <MangaInfo
                    number={entry.media.chapters.count}
                    volumes={entry.media.volumes}
                />
            {/if}
        </span>
    </div>
    <UserInfo
        dates={entry.dates}
        review={entry.review}
        progress={entry.progress}
        mediaType={entry.media.type}
    />
    <span class="sep" style:--accent={entry.media.accentColor}></span>
    <div class="synopsis">
        {#if synopsis}
            {#await synopsis}
                Loading synopsis...
            {:then text}
                {text}
            {:catch error}
                Failed to load synopsis
            {/await}
        {:else}
            {entry.media.synopsis}
        {/if}
    </div>
    <LinkButtons ids={entry.media.id} mediaType={entry.media.type}/>
</div>

<style>
    .informations {
        flex-grow: 1;
        max-height: 100%;
        overflow-y: auto;
        padding: 20px 0;
        padding-top: 2.5rem;
        padding-right: 10px; /* 10px to avoid scrollbar overlap */
        box-sizing: border-box;
    }

    .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .top {
        display: flex;
        flex-direction: column;
        margin-bottom: 15px;
    }

    .sub {
        color: var(--text-secondary);
    }

    i,
    h1 {
        margin: 0;
    }

    h1 {
        text-shadow: 0 0 10px var(--black);
        line-height: 1.2em;
    }

    i {
        color: var(--text-2);
    }

    .sep {
        display: block;
        width: 100%;
        height: 1px;
        background-color: var(--accent);
        margin: 10px 0;
    }

    .synopsis {
        white-space: pre-wrap;
        line-height: 1.5em;
        max-width: 750px;
    }

    @media screen and (max-width: 900px) {
        h1 {
            margin-top: -1rem;
        }

        .informations {
            width: 100%;
        }
    }
</style>
