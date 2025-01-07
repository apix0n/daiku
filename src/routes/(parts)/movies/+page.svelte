<script>
    export let data;
    import { ratingStars } from '$lib/ratingStars.js';
    import { formatDateLocale } from '$lib/formatDateLocale.js';
    import Rewatch from '../../../components/icons/Rewatch.svelte';
    import UpdatedTime from '../../../components/UpdatedTime.svelte';

    const { watched, boxdUpdatedAt, alUpdatedAt } = data.watchedMovies;
    const cssHexAccentOpacity = "80";
</script>

<h2>watched <span>· {watched.length} movies</span></h2>

<div id="watched" class="elements-wrapper watched-movies-wrapper">
  {#each watched as movie}
      <div class="element" style:background-image="url({movie.coverLink})">
        {#if movie.rating !== 0 || movie.rewatch}
          <div class="informations top">
            {#if movie.rewatch}<Rewatch/>{/if}
            <span class="rating">{@html ratingStars(movie.rating)}</span>
          </div>
        {/if}
        <div class="informations">
          <div class="upper">
            <a class="media-title" href={movie.link} target="_blank">{movie.title}</a>
          </div>
          <div class="more">
            <div class="dates">
              {#if movie.movieRuntime != null}
                <span class="episodes-info">{movie.movieRuntime} min.</span>
              {/if}
              {#if movie.finishedDate }
                <span class="finish-date">{formatDateLocale(movie.finishedDate).toLocaleDateString()}</span>
              {/if}
            </div>
          </div>
        </div>
      </div>
  {/each}
</div>

<div class="updated-times">
  <UpdatedTime margin=0 date={alUpdatedAt} service="AniList"/>
  <UpdatedTime margin=0 date={boxdUpdatedAt} service="Letterboxd"/>
</div>

<style>
  .updated-times {
    display: flex;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 1em;
  }
</style>