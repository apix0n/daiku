<script>
    import { ratingStars } from '$lib/ratingStars.js';
    import { formatDateLocale } from '$lib/formatDateLocale.js';
    import Rewatch from '../../../components/icons/Rewatch.svelte';
    import UpdatedTime from '../../../components/UpdatedTime.svelte';
	import { getRelativeTime } from '$lib/getRelativeTime'

    export let data
    const { current, watched, updatedAt } = data.animeData;
    const cssHexAccentOpacity = "80";
    let isChecked = false;
</script>

<h2>currently watching <span>· {current.length} anime</span></h2>

<div id="current" class="elements-wrapper">
  {#each current as anime}
    {#if anime.status !== "NOT_YET_RELEASED" && anime.episodesProgress > 0 && anime.episodesProgress !== anime.episodesNumber} <!-- avoid displaying unreleased, finished or not started anime -->
      <div class="element" class:releasing={anime.status === 'RELEASING'} style:background-image="url({anime.coverLink})" style="{anime.accentColor !== null ? `--accentColor: ${anime.accentColor + cssHexAccentOpacity}` : ''}">
        {#if anime.status === "RELEASING"}
          <div class="informations top">
            <span class="next-episode">next episode {getRelativeTime(new Date(anime.airingAt * 1000))}</span>
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
            <span class="episodes-info">{anime.episodesProgress}/{anime.episodesNumber}</span>
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
  <div class="element" class:ova={anime.episodesNumber <= 2} class:visible={isChecked && anime.episodesNumber <= 2} style:background-image="url({anime.coverLink})" style="{anime.accentColor !== null ? `--accentColor: ${anime.accentColor + cssHexAccentOpacity}` : ''}">
    {#if anime.rating !== 0 || anime.rewatch !== 0}
          <div class="informations top">
            {#if anime.rewatch !== 0}<Rewatch Number={anime.rewatch}/>{/if}
            <span class="rating">{@html ratingStars(anime.rating)}</span>
          </div>
        {/if}
        <div class="informations">
          <div class="upper">
            <a class="media-title" href="{anime.mediaLink}" target="_blank">{anime.title}</a>
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

<style>
  #current .next-episode {
    display: revert;
    width: 100%;
    text-align: center;
    text-shadow: 0 0 10px var(--black);
    overflow: unset;
    font-size: .8em;
  }
</style>