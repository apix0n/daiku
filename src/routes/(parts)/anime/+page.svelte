<script>
    import { ratingStars } from '$lib/ratingStars.js';
    import { formatDateLocale } from '$lib/formatDateLocale.js';
    import Rewatch from '../../../components/icons/Rewatch.svelte';
    import UpdatedTime from '../../../components/UpdatedTime.svelte';
	import { getRelativeTime } from '$lib/getRelativeTime'
	import RelativeTimeInfo from '../../../components/RelativeTimeInfo.svelte'

    export let data
    const { current, watched, updatedAt } = data.animeData;
    const cssHexAccentOpacity = "80";
    let isChecked = false;
</script>

<h2>currently watching <span>· {current.length} anime</span></h2>

<div id="current" class="elements-wrapper">
  {#each current as anime}
    {#if anime.status !== "NOT_YET_RELEASED" && anime.episodesProgress > 0 && anime.episodesProgress !== anime.episodesNumber} <!-- avoid displaying unreleased, finished or not started anime -->
      <div class="element" class:releasing={anime.status === 'RELEASING'} style:background-image="url({anime.coverLink})" style="{anime.accentColor !== null ? `--tAccentColor: ${anime.accentColor + cssHexAccentOpacity}; --accentColor: ${anime.accentColor}` : ''}">
        {#if anime.status === "RELEASING" && anime.nextEpisode.number - 1 === anime.episodesProgress} <!-- for airing/releasing anime, only show next episode in ... label if the user's is up to-date -->
          <div class="informations top">
            <RelativeTimeInfo number={anime.nextEpisode.number} timestamp={anime.nextEpisode.timestamp} mediaType="episode" />
          </div>
        {:else if anime.status === "RELEASING" && anime.episodesProgress > 0 && anime.episodesProgress < anime.episodesNumber}
          <div class="informations top" class:toCatchUp={anime.episodesProgress < anime.lastEpisode.number}>
            <RelativeTimeInfo number={anime.lastEpisode.number} timestamp={anime.lastEpisode.timestamp} mediaType="episode" />
          </div>
        {/if}
        <div class="informations">
          <div class="upper">
            <a class="media-title" href="{anime.mediaLink}" target="_blank">{anime.title}</a>
          </div>
          <span class="episodes-info">{anime.episodesNumber !== null ? anime.episodesNumber : '?'} episodes × {anime.episodesDuration} min.</span>
          <div class="more">
            {#if anime.userStatus === "REPEATING"}
              <div class="dates">
                <div class="start-date"><Rewatch/> rewatching</div>
              </div>
            {:else if anime.startedDate !== null}
              <div class="dates">
                <span class="start-date">{formatDateLocale(anime.startedDate).toLocaleDateString()}</span>
              </div>
            {/if}
            <span class="episodes-info">{anime.episodesNumber !== null ? `${anime.episodesProgress}/${anime.episodesNumber}` : `at ep.${anime.episodesProgress}`}</span>
          </div>
        </div>
      </div>
    {/if}
  {/each}
</div>

<h2>
  watched
  <span>· {watched.filter(anime => anime.episodesNumber > 2).length} anime & {watched.filter(anime => anime.episodesNumber <= 2).length} specials</span>
  <div class="checkboxdiv"><input type="checkbox" id="toggle" bind:checked={isChecked}><label for="toggle" class="toggle-label">Show specials/OVAs</label></div>
</h2>

<div id="watched" class="elements-wrapper">
  {#each watched as anime}
  <div class="element" class:ova={anime.episodesNumber <= 2} class:visible={isChecked && anime.episodesNumber <= 2} style:background-image="url({anime.coverLink})" style="{anime.accentColor !== null ? `--tAccentColor: ${anime.accentColor + cssHexAccentOpacity}; --accentColor: ${anime.accentColor}` : ''}">
    {#if anime.rating !== 0}
          <div class="informations top">
            <span class="rating">{@html ratingStars(anime.rating)}</span>
          </div>
        {/if}
        <div class="informations">
          <div class="upper">
            <a class="media-title" href="{anime.mediaLink}" target="_blank">{anime.title}{#if anime.rewatch !== 0}<Rewatch Number={anime.rewatch}/>{/if}</a>
          </div>
          {#if anime.episodesNumber == 1 && anime.episodesDuration !== null}
            <span class="episodes-info">{anime.episodesDuration} min.</span>
            {:else if anime.episodesNumber !== null && anime.episodesDuration !== null}
            <span class="episodes-info">{anime.episodesNumber} episode{anime.episodesNumber > 1 ? 's' : ''} × {anime.episodesDuration} min.</span>
            {/if}
            <div class="more">
              {#if anime.startedDate == anime.finishedDate && anime.startedDate != null}
              <div class="dates">
                <span class="finish-date">{formatDateLocale(anime.finishedDate).toLocaleDateString()}</span>
              </div>
              {:else if anime.startedDate != null && anime.finishedDate != null}
                <div class="dates">
                  <span class="start-date">{formatDateLocale(anime.startedDate).toLocaleDateString()}</span>
                  <span class="finish-date">{formatDateLocale(anime.finishedDate).toLocaleDateString()}</span>
                </div>
              {/if}
            </div>
          </div>
      </div>
  {/each}
</div>

<UpdatedTime date={updatedAt} service="AniList"/>