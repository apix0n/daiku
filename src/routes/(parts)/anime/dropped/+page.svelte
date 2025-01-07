<script>
    import { ratingStars } from '$lib/ratingStars.js';
	import NextAiringEpisode from '../../../../components/NextAiringEpisode.svelte'
    import NoEntriesMessage from '../../../../components/NoEntriesMessage.svelte';
    import UpdatedTime from '../../../../components/UpdatedTime.svelte';

    export let data
    const { dropped, updatedAt } = data.animeData;
    const cssHexAccentOpacity = "80";
    let isChecked = false;
</script>

{#if dropped.length !== 0}

{#if dropped.filter(anime => anime.userStatus === "DROPPED").length !== 0}
<h2>dropped <span>· {dropped.filter(anime => anime.userStatus === "DROPPED").length} anime</span></h2>

<div id="dropped" class="elements-wrapper">
  {#each dropped as anime}
    {#if anime.userStatus === "DROPPED" && anime.status !== "NOT_YET_RELEASED" && anime.episodesProgress > 0}
      <div class="element" class:releasing={anime.status === 'RELEASING'} style:background-image="url({anime.coverLink})" style="{anime.accentColor !== null ? `--accentColor: ${anime.accentColor + cssHexAccentOpacity}` : ''}">
        {#if anime.status === "RELEASING"} <!-- for airing/releasing anime -->
          <div class="informations top">
            <NextAiringEpisode nextAiringEpisode={anime.nextAiringEpisode} airingAt={anime.airingAt} />
          </div>
        {/if}
        <div class="informations">
          <div class="upper">
            <a class="media-title" href="{anime.mediaLink}" target="_blank">{anime.title}</a>
          </div>
          <span class="episodes-info">{anime.episodesNumber !== null ? anime.episodesNumber : '?'} episodes × {anime.episodesDuration} min.</span>
          <div class="more">
            <span class="episodes-info">dropped after ep. {anime.episodesProgress}</span>
          </div>
        </div>
      </div>
    {/if}
  {/each}
</div>
{/if}

{#if dropped.filter(anime => anime.userStatus === "PAUSED").length !== 0}
<h2>paused <span>· {dropped.filter(anime => anime.userStatus === "PAUSED").length} anime</span></h2>

<div id="paused" class="elements-wrapper">
  {#each dropped as anime}
    {#if anime.userStatus === "PAUSED" && anime.status !== "NOT_YET_RELEASED" && anime.episodesProgress > 0}
      <div class="element" class:releasing={anime.status === 'RELEASING'} style:background-image="url({anime.coverLink})" style="{anime.accentColor !== null ? `--accentColor: ${anime.accentColor + cssHexAccentOpacity}` : ''}">
        <div class="informations">
          <div class="upper">
            <a class="media-title" href="{anime.mediaLink}" target="_blank">{anime.title}</a>
          </div>
          <span class="episodes-info">{anime.episodesNumber !== null ? anime.episodesNumber : '?'} episodes × {anime.episodesDuration} min.</span>
          <div class="more">
            <span class="episodes-info">paused at ep. {anime.episodesProgress}</span>
          </div>
        </div>
      </div>
    {/if}
  {/each}
</div>
{/if}

{:else}
  <NoEntriesMessage/>
{/if}

<UpdatedTime date={updatedAt} service="AniList"/>
