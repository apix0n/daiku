<script lang="ts">
    import BaseCard from "$components/cards/BaseCard.svelte";
    import Informations from "$components/cards/bottom/Informations.svelte";
    import MangaInfo from "$components/cards/bottom/MangaInfo.svelte";
    import DroppedPaused from "$components/cards/bottom/DroppedPaused.svelte";

    import NoEntriesMessage from "$components/NoEntriesMessage.svelte";
    import UpdatedTime from "$components/UpdatedTime.svelte";
    import type { MediaElement } from "$lib/types/media.js";
    
    export let data;
    const { dropped, updatedAt } = data.mangaData;

    import { _ } from "svelte-i18n";

    let selectedManga: MediaElement | null = null;

    function handleCardClick(manga: MediaElement) {
        selectedManga = manga;
    }

    import Overlay from '$components/overlay/Overlay.svelte';
</script>

{#if selectedManga}
    <Overlay entry={selectedManga} on:close={() => selectedManga = null} />
{/if}

{#if dropped.length > 0}
    {#if dropped.filter((manga) => manga.status === "paused").length > 0}
        <h2>
            {$_("paused")}
            <span
                >· {dropped.filter((manga) => manga.status === "paused")
                    .length} manga</span
            >
        </h2>

        <div id="paused" class="elements-wrapper elements-manga">
            {#each dropped as manga}
                {#if manga.status === "paused" && manga.media.status !== "notYetReleased" && (manga.progress?.chapter ?? 0) > 0}
                    <BaseCard
                        accent={manga.media.accentColor}
                        background={manga.media.cover.medium}
                        status={manga.media.status}
                        on:click={() => handleCardClick(manga)}
                    >
                        <!-- bottom -->
                        <Informations
                            title={manga.media.title.english || manga.media.title.romaji || manga.media.title.native}
                        >
                            <MangaInfo
                                chapters={manga.media.chapters?.count}
                                volumes={manga.media.volumes?.count}
                            />
                            <DroppedPaused
                                progress={manga.progress?.chapter ?? 0}
                                type={manga.status}
                                mediaType={manga.media.type}
                            />
                        </Informations>
                    </BaseCard>
                {/if}
            {/each}
        </div>
    {/if}

    {#if dropped.filter((manga) => manga.status === "dropped").length !== 0}
        <h2>
            {$_("dropped")}
            <span
                >· {dropped.filter((manga) => manga.status === "dropped")
                    .length} manga</span
            >
        </h2>
        <div id="dropped" class="elements-wrapper elements-manga">
            {#each dropped as manga}
                {#if manga.status === "dropped" && manga.media.status !== "notYetReleased" && (manga.progress?.chapter ?? 0) > 0}
                    <BaseCard
                        accent={manga.media.accentColor}
                        background={manga.media.cover.medium}
                        status={manga.media.status}
                        on:click={() => handleCardClick(manga)}
                    >
                        <!-- bottom -->
                        <Informations
                            title={manga.media.title.english || manga.media.title.romaji || manga.media.title.native}
                        >
                            <MangaInfo
                                chapters={manga.media.chapters?.count}
                                volumes={manga.media.volumes?.count}
                            />
                            <DroppedPaused
                                progress={manga.progress?.chapter ?? 0}
                                type={manga.status}
                                mediaType={manga.media.type}
                            />
                        </Informations>
                    </BaseCard>
                {/if}
            {/each}
        </div>
    {/if}
{:else}
    <NoEntriesMessage updateTime={updatedAt} />
{/if}

<UpdatedTime info={updatedAt} />
