<script lang="ts">
  import type { MediaElement } from "$lib/types/media";
  import { _ } from "svelte-i18n";
  import BaseCard from "$components/cards/BaseCard.svelte";
  import Informations from "$components/cards/bottom/Informations.svelte";
  import AnimeInfo from "$components/cards/bottom/AnimeInfo.svelte";
  import MangaInfo from "$components/cards/bottom/MangaInfo.svelte";
  import PlanningRelease from "$components/cards/bottom/PlanningRelease.svelte";
  import UpdatedTime from "$components/UpdatedTime.svelte";
  import RelativeTimeInfo from "$components/cards/top/ReleaseInfo.svelte";
  import Overlay from "$components/overlay/Overlay.svelte";

  export let data;
  const { anime: animeList, manga, movies, updatedAt } = data.plannedData;
  let selectedAnime: MediaElement | null = null;

  function handleCardClick(anime: MediaElement) {
    selectedAnime = anime;
  }
</script>

{#if selectedAnime}
  <Overlay entry={selectedAnime} on:close={() => (selectedAnime = null)} />
{/if}

<h2>
  {$_("navigation.anime")}
  <span>· {$_("Nplanned", { values: { n: animeList.length } })}</span>
</h2>

<div id="anime" class="elements-wrapper elements-planned">
  {#each animeList.filter((a) => a.media.status !== "notYetReleased") as anime}
    <BaseCard
      accent={anime.media.accentColor}
      background={anime.media.cover.medium}
      status={anime.media.status}
      on:click={() => handleCardClick(anime)}
    >
      <!-- top -->
      {#if anime.media.status === "airing" && anime.media.episodes?.next}
        <!-- for airing/releasing anime -->
        <RelativeTimeInfo
          episode={anime.media.episodes?.next}
          mediaType={anime.media.type}
        />
      {/if}

      <!-- bottom -->
      <Informations titles={anime.media.title}>
        {#if anime.media.status === "notYetReleased" && anime.media.dates?.start != null}
          <PlanningRelease
            dateString={anime.media.dates.start}
            status={anime.media.status}
          />
        {:else if anime.media.status === "notYetReleased" && !anime.media.dates?.start}
          <PlanningRelease status={anime.media.status} />
        {:else if anime.media.status === "airing" || anime.media.status === "finished"}
          {#if anime.media.episodes?.count || anime.media.runtime}
            <AnimeInfo
              number={anime.media.episodes?.count ?? 0}
              duration={anime.media.runtime}
            />
          {:else}
            <PlanningRelease status={anime.media.status} />
          {/if}
        {/if}
      </Informations>
    </BaseCard>
  {/each}
</div>

<h2>
  {$_("navigation.manga")}
  <span>· {$_("Nplanned", { values: { n: manga.length } })}</span>
</h2>

<div id="watched" class="elements-wrapper elements-planned elements-manga">
  {#each manga as manga}
    <BaseCard
      accent={manga.media.accentColor}
      background={manga.media.cover.medium}
      status={manga.media.status}
      on:click={() => handleCardClick(manga)}
    >
      <!-- bottom -->
      <Informations titles={manga.media.title}>
        {#if manga.media.status === "notYetReleased" && manga.media.dates?.start}
          <PlanningRelease
            dateString={manga.media.dates.start}
            status={manga.media.status}
          />
        {:else if manga.media.status === "notYetReleased" && !manga.media.dates?.start}
          <PlanningRelease status={manga.media.status} />
        {:else if manga.media.status === "airing" || manga.media.status === "finished"}
          {#if manga.media.chapters?.count || manga.media.volumes?.count}
            <MangaInfo
              chapters={manga.media.chapters?.count}
              volumes={manga.media.volumes?.count}
            />
          {:else}
            <PlanningRelease status={manga.media.status} />
          {/if}
        {/if}
      </Informations>
    </BaseCard>
  {/each}
</div>

<h2>
  {$_("navigation.movies")}
  <span>· {$_("Nplanned", { values: { n: movies.length } })}</span>
</h2>

<div id="movie" class="elements-wrapper elements-planned">
  {#each movies as anime}
    <BaseCard
      accent={anime.media.accentColor}
      background={anime.media.cover.medium}
      status={anime.media.status}
      on:click={() => handleCardClick(anime)}
    >
      <!-- bottom -->
      <Informations titles={anime.media.title}>
        {#if anime.media.status == "notYetReleased" && anime.media.dates?.start != null}
          <PlanningRelease
            dateString={anime.media.dates.start}
            status={anime.media.status}
            mediaType={anime.media.type}
          />
        {:else if anime.media.status == "notYetReleased" && anime.media.dates?.start == null}
          <PlanningRelease status={anime.media.status} />
        {:else if anime.media.status == "airing" || anime.media.status == "finished" || !anime.media.dates}
          {#if anime.media.runtime}
            <AnimeInfo duration={anime.media.runtime} />
          {:else}
            <PlanningRelease status={anime.media.status} />
          {/if}
        {/if}
      </Informations>
    </BaseCard>
  {/each}
</div>

<UpdatedTime info={updatedAt} />
