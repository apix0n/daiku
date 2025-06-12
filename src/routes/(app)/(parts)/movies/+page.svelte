<script lang="ts">
    export let data;
    import UpdatedTime from '$components/UpdatedTime.svelte';

    import BaseCard from '$components/cards/BaseCard.svelte';
    import Rating from '$components/cards/top/Rating.svelte';
    import Informations from '$components/cards/bottom/Informations.svelte';
    import RuntimeDate from '$components/cards/bottom/RuntimeDate.svelte';

    const { watched, updatedAt } = data.watchedMovies;

    import { _ } from 'svelte-i18n';
    import Overlay from '$components/overlay/Overlay.svelte';
    import type { MediaElement } from '$lib/types/media.js';

    let selectedMovie: MediaElement | null = null;

    function handleCardClick(movie: MediaElement) {
        selectedMovie = movie;
    }
</script>

{#if selectedMovie}
  <Overlay entry={selectedMovie} on:close={() => selectedMovie = null} />
{/if}

<h2>{$_("watched")} <span>· {watched.length} movies</span></h2>

<div id="watched" class="elements-wrapper watched-movies-wrapper">
  {#each watched as movie}
  
  <BaseCard background={movie.media.cover.medium} on:click={() => handleCardClick(movie)}>
    <!-- top -->
    {#if movie.review?.rating && movie.review.rating > 0}
      <Rating value={movie.review.rating} />
    {/if}

    <!-- bottom -->
    <Informations titles={movie.media.title} rewatch={Boolean(movie.repeat)}>
      <RuntimeDate runtime={movie.media.runtime} watchedDate={movie.dates?.finished}/>
    </Informations>
  </BaseCard>

  {/each}
</div>

<UpdatedTime info={updatedAt}/>