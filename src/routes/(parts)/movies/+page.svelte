<script>
    export let data;
    import UpdatedTime from '../../../components/UpdatedTime.svelte';

    import BaseCard from '../../../components/cards/BaseCard.svelte';
    import Rating from '../../../components/cards/top/Rating.svelte';
    import Informations from '../../../components/cards/bottom/Informations.svelte';
    import RuntimeDate from '../../../components/cards/bottom/RuntimeDate.svelte';

    const { watched, boxdUpdatedAt, alUpdatedAt } = data.watchedMovies;

    import { _ } from 'svelte-i18n';
</script>

<h2>{$_("watched")} <span>· {watched.length} movies</span></h2>

<div id="watched" class="elements-wrapper watched-movies-wrapper">
  {#each watched as movie}
  
  <BaseCard background={movie.coverLink}>
    <!-- top -->
    {#if movie.rating > 0}
      <Rating value={movie.rating} />
    {/if}

    <!-- bottom -->
    <Informations title={movie.title} link={movie.link} rewatch={movie.rewatch}>
      <RuntimeDate runtime={movie.movieRuntime} watchedDate={movie.finishedDate}/>
    </Informations>
  </BaseCard>

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