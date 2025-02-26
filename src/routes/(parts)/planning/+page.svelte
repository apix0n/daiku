<script>
  import { ratingStars } from '$lib/ratingStars.js';
  import { planningListFormatDate } from '$lib/anilist/global.js';
  import UpdatedTime from '../../../components/UpdatedTime.svelte';
	import { getRelativeTime } from '$lib/getRelativeTime'
	import RelativeTimeInfo from '../../../components/RelativeTimeInfo.svelte'

  export let data;
  const { anime, manga, updatedAt } = data.plannedData;
  const cssHexAccentOpacity = "80";
  let isChecked = false;
</script>

<h2>anime <span>· {anime.filter(a => a.type !== "MOVIE").length} planned</span></h2>

<div id="anime" class="elements-wrapper">
  {#each anime.filter(a => a.type !== "MOVIE") as anime}
       <div class="element" class:releasing={anime.status == "RELEASING" || anime.status == "NOT_YET_RELEASED"} class:notyet={anime.status == "NOT_YET_RELEASED"} style:background-image="url({anime.coverLink})" style="{anime.accentColor !== null ? `--accentColor: ${anime.accentColor + cssHexAccentOpacity}` : ''}">
        {#if anime.status === "RELEASING"} <!-- for airing/releasing anime -->
          <div class="informations top">
            <RelativeTimeInfo number={anime.nextEpisode.number} timestamp={anime.nextEpisode.timestamp} mediaType="episode" />
          </div>
        {/if}
         <div class="informations">
           <div class="upper">
             <a class="media-title" href="{anime.mediaLink}" target="_blank">{anime.title}</a>
            </div>
            {#if anime.status == "NOT_YET_RELEASED" && anime.startDate != null}
              <span class="episodes-info">{planningListFormatDate(anime.startDate)}</span>
            {:else if anime.status == "NOT_YET_RELEASED" && anime.startDate == null}
              <span class="episodes-info">announced</span>
            {:else if anime.status == "RELEASING" || anime.status == "FINISHED"}
              {#if anime.episodesNumber == 1 && anime.episodesDuration !== null}
                <span class="episodes-info">{anime.episodesDuration} min.</span>
              {:else if anime.episodesNumber !== null && anime.episodesDuration !== null}
                <span class="episodes-info">{anime.episodesNumber} episode{anime.episodesNumber > 1 ? 's' : ''} × {anime.episodesDuration} min.</span>
              {:else}
                <span class="episodes-info">releasing</span>
              {/if}
            {/if}
          </div>
        </div>
  {/each}
</div>

<h2>manga <span>· {manga.length} planned</span></h2>

<div id="watched" class="elements-wrapper">
  {#each manga as manga}
      <div class="element" class:releasing={manga.status == "RELEASING" || manga.status == "NOT_YET_RELEASED"} class:notyet={manga.status == "NOT_YET_RELEASED"} style:background-image="url({manga.coverLink})" style="{manga.accentColor !== null ? `--accentColor: ${manga.accentColor + cssHexAccentOpacity}` : ''}">
        <div class="informations">
          <div class="upper">
            <a class="media-title" href="{manga.mediaLink}" target="_blank">{manga.title}</a>
          </div>
          {#if manga.chapterCount !== null || manga.volumesCount !== null}
            <span class="episodes-info">{manga.chapterCount !== null ? `${manga.chapterCount} chapter${manga.chapterCount > 1 ? 's' : ''}` : ''}{manga.chapterCount !== null && manga.volumesCount !== null ? ' · ' : ''}{manga.volumesCount !== null ? `${manga.volumesCount} volume${manga.volumesCount > 1 ? 's' : ''}` : ''}</span>
          {:else if manga.status == "RELEASING"}
            <span class="episodes-info">releasing</span>
          {:else if manga.status == "NOT_YET_RELEASED" && manga.startDate != null}
            <span class="episodes-info">releases {planningListFormatDate(manga.startDate)}</span>
          {:else if manga.status == "NOT_YET_RELEASED" && manga.startDate == null}
            <span class="episodes-info">announced</span>
          {/if}
        </div>
      </div>
  {/each}
</div>

<h2>anime movies <span>· {anime.filter(a => a.type === "MOVIE").length} planned</span></h2>

<div id="movie" class="elements-wrapper">
  {#each anime.filter(a => a.type === "MOVIE") as anime}
       <div class="element" class:releasing={anime.status == "NOT_YET_RELEASED"} class:notyet={anime.status == "NOT_YET_RELEASED"} style:background-image="url({anime.coverLink})" style="{anime.accentColor !== null ? `--accentColor: ${anime.accentColor + cssHexAccentOpacity}` : ''}">
         <div class="informations">
           <div class="upper">
             <a class="media-title" href="{anime.mediaLink}" target="_blank">{anime.title}</a>
            </div>
            {#if anime.episodesDuration}
              <span class="episodes-info">{anime.episodesNumber > 1 ? `${anime.episodesNumber} parts × ` : ''}{anime.episodesDuration} min.</span>
            {/if}
            {#if anime.status == "NOT_YET_RELEASED" && anime.startDate != null}
            <span class="episodes-info">releases {`${planningListFormatDate(anime.startDate)}`.slice(7)}</span> <!-- remove the 'starts ' portion of the string -->
          {:else if anime.status == "NOT_YET_RELEASED" && anime.startDate == null}
            <span class="episodes-info">announced</span>
            {/if}
          </div>
        </div>
  {/each}
</div>

<UpdatedTime date={updatedAt} service="AniList"/>
