<script>
  import BaseCard from "$components/cards/BaseCard.svelte";
  import Informations from "$components/cards/bottom/Informations.svelte";
  import AnimeInfo from "$components/cards/bottom/AnimeInfo.svelte";
  import MangaInfo from "$components/cards/bottom/MangaInfo.svelte";
  import PlanningRelease from "$components/cards/bottom/PlanningRelease.svelte";
  import UpdatedTime from "$components/UpdatedTime.svelte";
  import RelativeTimeInfo from "$components/cards/top/ReleaseInfo.svelte";

  export let data;
  const { anime, manga, movies, updatedAt } = data.plannedData;

  import { _ } from "svelte-i18n";

  import Overlay from "$components/overlay/Overlay.svelte";
  let selectedAnime = null;

  function handleCardClick(anime) {
    selectedAnime = anime;
  }
</script>

{#if selectedAnime}
    <Overlay entry={selectedAnime} on:close={() => selectedAnime = null} />
{/if}

<h2>anime <span>· {anime.length} planned</span></h2>

<div id="anime" class="elements-wrapper elements-planned">
  {#each anime.filter((a) => a.media.status !== "NOT_YET_RELEASED") as anime}
    <BaseCard
      accent={anime.media.accentColor}
      background={anime.media.cover.medium}
      status={anime.media.status}
      on:click={() => handleCardClick(anime)}
    >
      <!-- top -->
      {#if anime.media.status === "RELEASING"}
        <!-- for airing/releasing anime -->
        <RelativeTimeInfo
          number={anime.media.episodes.next.number}
          timestamp={anime.media.episodes.next.timestamp}
          mediaType={anime.media.type}
        />
      {/if}

      <!-- bottom -->
      <Informations
        title={anime.media.title.english || anime.media.title.romaji}
      >
        {#if anime.media.status == "NOT_YET_RELEASED" && anime.media.date.start != null}
          <PlanningRelease dateString={anime.media.date.start} />
        {:else if anime.media.status == "NOT_YET_RELEASED" && anime.media.date.start == null}
          <PlanningRelease status={anime.media.status} />
        {:else if anime.media.status == "RELEASING" || anime.media.status == "FINISHED"}
          {#if anime.media.episodes.count || anime.media.runtime}
            <AnimeInfo
              number={anime.media.episodes.count}
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

<h2>manga <span>· {manga.length} planned</span></h2>

<div id="watched" class="elements-wrapper elements-planned elements-manga">
  {#each manga as manga}
    <BaseCard
      accent={manga.media.accentColor}
      background={manga.media.cover.medium}
      status={manga.media.status}
      on:click={() => handleCardClick(anime)}
    >
      <!-- bottom -->
      <Informations
        title={manga.media.title.english || manga.media.title.romaji}
      >
        {#if manga.media.status === "NOT_YET_RELEASED" && manga.media.date.start}
          <PlanningRelease dateString={manga.media.date.start} />
        {:else if manga.media.status === "NOT_YET_RELEASED" && !manga.media.date.start}
          <PlanningRelease status={manga.media.status} />
        {:else if manga.media.status === "RELEASING" || manga.media.status === "FINISHED"}
          {#if manga.media.chapters.count || manga.media.volumes.count}
            <MangaInfo
              chapters={manga.media.chapters.count}
              volumes={manga.media.volumes.count}
            />
          {:else}
            <PlanningRelease status={manga.media.status} />
          {/if}
        {/if}
      </Informations>
    </BaseCard>
  {/each}
</div>

<h2>movies <span>· {movies.length} planned</span></h2>

<div id="movie" class="elements-wrapper elements-planned">
  {#each movies as anime}
    <BaseCard
      accent={anime.media.accentColor}
      background={anime.media.cover.medium}
      status={anime.media.status}
      on:click={() => handleCardClick(anime)}
    >
      <!-- bottom -->
      <Informations
        title={anime.media.title.english || anime.media.title.romaji}
      >
        {#if anime.media.status == "NOT_YET_RELEASED" && anime.media.date.start != null}
          <PlanningRelease dateString={anime.media.date.start} />
        {:else if anime.media.status == "NOT_YET_RELEASED" && anime.media.date.start == null}
          <PlanningRelease status={anime.media.status} />
        {:else if anime.media.status == "RELEASING" || anime.media.status == "FINISHED" || !anime.media.dates}
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

<UpdatedTime date={updatedAt} service="AniList" />
