<script>
  import BaseCard from '../../../components/cards/BaseCard.svelte'
  import Informations from '../../../components/cards/bottom/Informations.svelte';
  import AnimeInfo from '../../../components/cards/bottom/AnimeInfo.svelte';
	import MangaInfo from '../../../components/cards/bottom/MangaInfo.svelte'
  import PlanningRelease from '../../../components/cards/bottom/PlanningRelease.svelte';
  import UpdatedTime from '../../../components/UpdatedTime.svelte';
	import RelativeTimeInfo from '../../../components/cards/top/RelativeTimeInfo.svelte'
  
  export let data;
  const { anime, manga, updatedAt } = data.plannedData;

  import { _, locale as localeStore } from 'svelte-i18n';
</script>

<h2>anime <span>· {anime.filter(a => a.type !== "MOVIE").length} planned</span></h2>

<div id="anime" class="elements-wrapper elements-planned">
  {#each anime.filter(a => a.type !== "MOVIE") as anime}

    <BaseCard accent={anime.accentColor} background={anime.coverLink} status={anime.status}>
      <!-- top -->
      {#if anime.status === "RELEASING"} <!-- for airing/releasing anime -->
        <RelativeTimeInfo number={anime.nextEpisode.number} timestamp={anime.nextEpisode.timestamp} mediaType={anime.mediaType} />
      {/if}

      <!-- bottom -->
      <Informations title={anime.title} link={anime.mediaLink}>
        {#if anime.status == "NOT_YET_RELEASED" && anime.startDate != null}
          <PlanningRelease dateString={anime.startDate}/>
        {:else if anime.status == "NOT_YET_RELEASED" && anime.startDate == null}
          <PlanningRelease status={anime.status}/>
        {:else if anime.status == "RELEASING" || anime.status == "FINISHED"}
          {#if anime.episodesNumber || anime.episodesDuration}
            <AnimeInfo number={anime.episodesNumber} duration={anime.episodesDuration}/>
          {:else}
            <PlanningRelease status={anime.status}/>
          {/if}
        {/if}
      </Informations>
    </BaseCard>

  {/each}
</div>

<h2>manga <span>· {manga.length} planned</span></h2>

<div id="watched" class="elements-wrapper elements-planned elements-manga">
  {#each manga as manga}

      <BaseCard accent={manga.accentColor} background={manga.coverLink} status={manga.status}>

        <!-- bottom -->
        <Informations title={manga.title} link={manga.mediaLink}>
          {#if manga.status === "NOT_YET_RELEASED" && manga.startDate}
            <PlanningRelease dateString={manga.startDate}/>
          {:else if manga.status === "NOT_YET_RELEASED" && !manga.startDate}
            <PlanningRelease status={manga.status}/>
          {:else if manga.status === "RELEASING" || manga.status === "FINISHED"}
            {#if manga.chapterCount || manga.volumesCount}
              <MangaInfo chapters={manga.chapterCount} volumes={manga.volumesCount}/>
            {:else}
              <PlanningRelease status={manga.status}/>
            {/if}
          {/if}
        </Informations>
    </BaseCard>

  {/each}
</div>

<h2>anime movies <span>· {anime.filter(a => a.type === "MOVIE").length} planned</span></h2>

<div id="movie" class="elements-wrapper elements-planned">
  {#each anime.filter(a => a.type === "MOVIE") as anime}

    <BaseCard accent={anime.accentColor} background={anime.coverLink} status={anime.status}>
      <!-- bottom -->
      <Informations title={anime.title} link={anime.mediaLink}>
        {#if anime.status == "NOT_YET_RELEASED" && anime.startDate != null}
          <PlanningRelease dateString={anime.startDate}/>
        {:else if anime.status == "NOT_YET_RELEASED" && anime.startDate == null}
          <PlanningRelease status={anime.status}/>
        {:else if anime.status == "RELEASING" || anime.status == "FINISHED"}
          {#if anime.episodesNumber || anime.episodesDuration}
            <AnimeInfo number={anime.episodesNumber} duration={anime.episodesDuration}/>
          {:else}
            <PlanningRelease status={anime.status}/>
          {/if}
        {/if}
      </Informations>
    </BaseCard>

  {/each}
</div>

<UpdatedTime date={updatedAt} service="AniList"/>