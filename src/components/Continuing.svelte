<script>
    export let data;
    import { _ } from "svelte-i18n"
	import RelativeRelease from "./cards/top/RelativeRelease.svelte";

$: continuing = {
    continue: [
        // Anime to continue
        ...(data.animeData?.current || [])
            .filter(anime => 
                (anime.status === "FINISHED") ||
                (anime.status === "RELEASING" && anime.lastEpisode && anime.episodesProgress < anime.lastEpisode.number)
            ),
        // Manga to continue    
        ...(data.mangaData?.current || [])
            .filter(manga => 
                manga.status === "FINISHED" ||
                manga.status === "RELEASING" && (!manga.lastChapter || manga.chaptersProgress < manga.lastChapter.number)
            )
    ].sort((a, b) => (b.status === "RELEASING") - (a.status === "RELEASING")),

    next: (data.animeData?.current || [])
        .filter(anime => 
            anime.status === "RELEASING" && 
            anime.nextEpisode?.timestamp && 
            (new Date(anime.nextEpisode.timestamp * 1000) - Date.now()) < (48 * 60 * 60 * 1000)
        )
        .sort((a, b) => a.nextEpisode.timestamp - b.nextEpisode.timestamp)
};

</script>

<div class="continuing">
    <h2>{$_("continue")}</h2>
    <div class="parent">
        {#each continuing.continue as item}
        <div class="item">
            <div class="infos" class:releasing={item.status === "RELEASING"}>
                <img src={item.coverLink} alt="Cover of {item.title}">
                <span>
                    <a href={item.mediaLink} target="_blank">{item.title}</a>
                    {#if item.mediaType === "anime"}
                        {#if item.status === "RELEASING" && item.episodesProgress + 1 === item.lastEpisode.number}
                        · <RelativeRelease timestamp={item.lastEpisode.timestamp} mediaType={item.mediaType} number={item.lastEpisode.number} />
                        {:else}
                        · {$_("episodeNumberN", { values: { n: item.episodesProgress + 1 }})}
                        {/if}
                    {/if}
                    {#if item.mediaType === "manga"}
                        {#if item.status === "RELEASING" && item.chaptersProgress + 1 === item.lastChapter?.number}
                        · <RelativeRelease timestamp={item.lastChapter.timestamp / 1000} mediaType={item.mediaType} number={item.lastChapter.number} />
                        {:else}
                        · {$_("chapterNumberN", { values: { n: item.chaptersProgress + 1 }})}
                        {/if}
                    {/if}
                </span>
            </div>
            <img class="backdrop" src={item.coverLink} alt="Cover of {item.title}">
        </div>
    {/each}
    {#if continuing.next}
        <span class="next-label">
            <span class="next-text">{$_("releasingDate.soon")}</span>
            <span class="next-bar"></span>
        </span>
    {/if}
    {#each continuing.next as item}
        <div class="item">
            <div class="infos" class:releasing={item.status === "RELEASING"}>
                <img src={item.coverLink} alt="Cover of {item.title}">
                <span>
                    <a href={item.mediaLink} target="_blank">{item.title}</a>
                    {#if item.mediaType === "anime"}
                        {#if item.status === "FINISHED"}
                        · {$_("episodeNumberN", { values: { n: item.episodesProgress + 1 }})}
                        {:else if item.status === "RELEASING"}
                        · <RelativeRelease timestamp={item.nextEpisode.timestamp} mediaType={item.mediaType} number={item.nextEpisode.number} />
                        {/if}
                    {/if}
                </span>
            </div>
            <img class="backdrop" src={item.coverLink} alt="Cover of {item.title}">
        </div>
    {/each}
    </div>
</div>

<style>
    .continuing {
        background: var(--background-2);

        display: flex;
        flex-direction: column;
        padding: 0px 16px 16px 16px;
        /* gap: 18px; */

        /* width: 500px; */
        /* height: 325px; */

        border-radius: 17px;
        overflow-y: auto;
        grid-area: 3 / 2 / 4 / 4;
    }

    .parent {
        display: flex;
        flex-direction: column;
        gap: 8px;
        color: var(--white);
    }

    .item, .infos, img.backdrop {
        border-radius: 10px;
    }

    .item {
        width: 100%;
        position: relative;
    }
    
    .infos {
        height: calc(100% + 1px);
        min-height: 48px;
        background: rgba(0, 0, 0, 0.55);
        backdrop-filter: blur(10px);
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        gap: .35em;
        padding: 0 1em;
    }

    .item img.backdrop {
        position: absolute;
        top: 0;
        height: 100%;
        width: 100%;
        z-index: 1;
        object-fit: cover;
    }

    .item .infos img:not(.backdrop) {
        width: 32px;
        height: 48px;
        object-fit: cover;
        margin-right: .25em;
    }

    .infos a {
        font-weight: 500;
    }

    .infos a:hover {
        text-decoration: underline;
    }

    .infos span {
        padding: .5em 0;
        word-wrap: break-word;
        flex-grow: 1;
    }

    .next-label {
        width: 100%;
        position: relative;
        display: flex;
        justify-content: center;
    }
    
    .next-text {
        background: var(--background-2);
        color: var(--text-2);
        text-align: center;
        z-index: 2;
        position: relative;
        padding: 0 .5em;
    }

    .next-bar {
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        border-top: 2px dashed var(--text-2);
    }

    @media screen and (max-width: 900px) {
        .continuing {
            height: unset;
            width: unset;
            min-height: fit-content;
            max-height: 500px;
        }
    }
</style>