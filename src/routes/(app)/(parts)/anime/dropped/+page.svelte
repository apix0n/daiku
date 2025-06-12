<script lang="ts">
  import BaseCard from "$components/cards/BaseCard.svelte";
  import Informations from "$components/cards/bottom/Informations.svelte";
  import AnimeInfo from "$components/cards/bottom/AnimeInfo.svelte";
  import RelativeTimeInfo from "$components/cards/top/ReleaseInfo.svelte";
  import DroppedPaused from "$components/cards/bottom/DroppedPaused.svelte";

  import NoEntriesMessage from "$components/NoEntriesMessage.svelte";
  import UpdatedTime from "$components/UpdatedTime.svelte";

  export let data,
    selectedAnime: MediaElement | null = null;
  const { dropped, updatedAt } = data.animeData;

  function handleCardClick(anime: MediaElement) {
    selectedAnime = anime;
  }

  import { _ } from "svelte-i18n";
  import Overlay from "$components/overlay/Overlay.svelte";
  import type { MediaElement } from "$lib/types/media.js";
</script>

{#if selectedAnime}
  <Overlay entry={selectedAnime} on:close={() => (selectedAnime = null)} />
{/if}

{#if dropped.length > 0}
  {#if dropped.filter((anime) => anime.status === "paused").length > 0}
    <h2>
      {$_("paused")}
      <span
        >· {$_("Nanime", {
          values: {
            n: dropped.filter((anime) => anime.status === "paused").length,
          },
        })}</span
      >
    </h2>

    <div id="paused" class="elements-wrapper">
      {#each dropped as anime}
        {#if anime.status === "paused" && anime.media.status !== "notYetReleased" && (anime.progress?.episode ?? 0) > 0}
          <BaseCard
            accent={anime.media.accentColor}
            background={anime.media.cover.medium}
            status={anime.media.status}
            on:click={() => handleCardClick(anime)}
          >
            <!-- top -->
            {#if anime.media.status === "airing" && anime.media.episodes?.next}
              <RelativeTimeInfo
                episode={anime.media.episodes.next}
                mediaType={anime.media.type}
              />
            {/if}

            <!-- bottom -->
            <Informations titles={anime.media.title}>
              <AnimeInfo
                number={anime.media.episodes?.count ?? 0}
                duration={anime.media.runtime ?? 0}
              />
              <DroppedPaused
                progress={anime.progress?.episode ?? 0}
                type={anime.status}
                mediaType={anime.media.type}
              />
            </Informations>
          </BaseCard>
        {/if}
      {/each}
    </div>
  {/if}

  {#if dropped.filter((anime) => anime.status === "dropped").length > 0}
    <h2>
      {$_("dropped")}
      <span
        >· {$_("Nanime", {
          values: {
            n: dropped.filter((anime) => anime.status === "dropped").length,
          },
        })}</span
      >
    </h2>

    <div id="dropped" class="elements-wrapper">
      {#each dropped as anime}
        {#if anime.status === "dropped" && anime.media.status !== "notYetReleased" && (anime.progress?.episode ?? 0) > 0}
          <BaseCard
            accent={anime.media.accentColor}
            background={anime.media.cover.medium}
            status={anime.media.status}
            on:click={() => handleCardClick(anime)}
          >
            <!-- top -->
            {#if anime.media.status === "airing" && anime.media.episodes?.next}
              <RelativeTimeInfo
                episode={anime.media.episodes.next}
                mediaType={anime.media.type}
              />
            {/if}

            <!-- bottom -->
            <Informations titles={anime.media.title}>
              <AnimeInfo
                number={anime.media.episodes?.count ?? 0}
                duration={anime.media.runtime ?? 0}
              />
              <DroppedPaused
                progress={anime.progress?.episode ?? 0}
                type={anime.status}
                mediaType={anime.media.type}
              />
            </Informations>
          </BaseCard>
        {/if}
      {/each}
    </div>
  {/if}
{:else}
  <NoEntriesMessage updateTime={updatedAt.timestamp} />
{/if}

<UpdatedTime info={updatedAt} />
