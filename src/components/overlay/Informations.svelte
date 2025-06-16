<script lang="ts">
    import LinkButtons from "./LinkButtons.svelte";
    import { _ } from "svelte-i18n";
    import AnimeInfo from "../cards/bottom/AnimeInfo.svelte";
    import MangaInfo from "../cards/bottom/MangaInfo.svelte";
    import UserInfo from "./UserInfo.svelte";
    import type { MediaElement, MediaSynopsis } from "$lib/types/media";
    export let entry: MediaElement, synopsis: Promise<MediaSynopsis> | MediaSynopsis | undefined = undefined;
</script>

<div class="informations">
    <div class="top">
        <div class="title">
            <h1>{entry.media.title.locale || entry.media.title.english || entry.media.title.romaji}</h1>
        </div>
        <span class="sub">
            {#if (entry.media.title.locale?.toLowerCase() || entry.media.title.english?.toLowerCase() || entry.media.title.romaji?.toLowerCase()) !== (entry.media.title.romaji?.toLowerCase() || entry.media.title.native?.toLowerCase())}
                <i>{entry.media.title.romaji || entry.media.title.native}</i> ·
            {/if}
            {#if entry.media.status && entry.media.status !== "finished"}
                {$_("mediaStatus." + entry.media.status)} ·
            {/if}
            {$_("mediaType." + entry.media.type)}
            {#if entry.media.type === "anime"}
                · <AnimeInfo
                    number={entry.media.episodes?.count}
                    duration={entry.media.runtime}
                />
            {/if}
            {#if entry.media.type === "manga" && (entry.media.chapters?.count || entry.media.volumes?.count)}
                · <MangaInfo
                    chapters={entry.media.chapters?.count}
                    volumes={entry.media.volumes?.count}
                />
            {/if}
            {#if entry.media.type === "movie" && entry.media.runtime}
                · {$_("NminutesShort", { values: { n: entry.media.runtime } })}
            {/if}
        </span>
    </div>
    {#if entry.dates || entry.review || entry.progress}
        <UserInfo
            dates={entry.dates}
            review={entry.review}
            progress={entry.progress}
            mediaType={entry.media.type}
        />
    {/if}
    <span class="sep" style:--accent={entry.media.accentColor}></span>
    <div class="synopsis">
        {#if entry.media.synopsis}
            {entry.media.synopsis.text}
            {#if entry.media.synopsis.source}
                <span class="source">{entry.media.synopsis.source}</span>
            {/if}
        {:else if synopsis}
            {#await synopsis}
                Loading synopsis...
            {:then {text, source}}
                {text}
                {#if source}
                    <span class="source">{source}</span>
                {/if}
            {/await}
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
        margin-left: .5rem; /* avoids overlap with overflow */
    }

    .sub {
        color: var(--text-secondary);
    }

    i,
    h1 {
        margin: 0;
    }

    h1 {
        line-height: 1.2em;
        @media (prefers-color-scheme: dark) {
            text-shadow: 0 0 10px var(--black);
        }
    }

    i {
        color: var(--text-2);
    }

    .sep {
        display: block;
        width: 100%;
        height: 2px;
        background-color: var(--accent, var(--text-2));
        margin: 10px 0;
    }

    .synopsis {
        white-space: pre-wrap;
        line-height: 1.5em;
        max-width: 750px;
    }

    .source {
        background: var(--background-3);
        border-radius: 1em;
        font-size: 0.8em;
        color: var(--text-2);
        padding: 0 .4em;
    }

    @media screen and (max-width: 900px) {
        .top {
            margin-left: 0;
        }

        .title {
            margin-top: -2rem;
            font-size: .8rem;
        }

        .informations {
            /* width: 100%; */
        }
    }
</style>
