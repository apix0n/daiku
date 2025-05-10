<script>
    import UpdatedTime from '$components/UpdatedTime.svelte';

    import BaseCard from '$components/cards/BaseCard.svelte';
    import Informations from '$components/cards/bottom/Informations.svelte';
    import DateProgess from '$components/cards/bottom/DateProgess.svelte'
    import Rating from '$components/cards/top/Rating.svelte';
    import AnimeInfo from '$components/cards/bottom/AnimeInfo.svelte';
    import ReleaseInfo from '$components/cards/top/ReleaseInfo.svelte';
    import Dates from '$components/cards/bottom/Dates.svelte'
    import Overlay from '$components/overlay/Overlay.svelte';
    import { _ } from "svelte-i18n"

    export let data
    const { current, watched, updatedAt } = data.animeData;
    let isChecked = false;
    let selectedAnime = null;

    function handleCardClick(anime) {
        selectedAnime = anime;
    }
</script>

{#if selectedAnime}
    <Overlay entry={selectedAnime} on:close={() => selectedAnime = null} />
{/if}

{#if current}
<h2>{$_('currentlyWatching')} <span>· {$_("Nanime", { values: { n : current.length }})}</span></h2>

<div id="current" class="elements-wrapper">
  {#each current as anime}
    {#if anime.media.status !== "NOT_YET_RELEASED" && anime.progress.episode > 0 && anime.progress.episode !== anime.media.episodes.count} <!-- avoid displaying unreleased, finished or not started anime -->
    
    <BaseCard accent={anime.media.accentColor} background={anime.media.cover.medium} status={anime.media.status} on:click={() => handleCardClick(anime)}>
      <!-- top -->
      {#if anime.media.status === "RELEASING" && anime.media.episodes.next && anime.media.episodes.next?.number - 1 === anime.progress.episode} <!-- for airing/releasing anime, only show next episode in ... label if the user's is up to-date -->
        <ReleaseInfo number={anime.media.episodes.next.number} timestamp={anime.media.episodes.next.timestamp} mediaType={anime.media.type}/>
      {:else if anime.media.status === "RELEASING" && anime.media.episodes.last && anime.progress.episode > 0 && anime.media.episodes.last.number - anime.progress.episode <= 2}
        <ReleaseInfo number={anime.media.episodes.last.number} timestamp={anime.media.episodes.last.timestamp} mediaType={anime.media.type} catchUp/>
      {:else if anime.media.status === "RELEASING" && anime.media.episodes.next && anime.media.episodes.next.number - anime.progress.episode > 50 }
        <ReleaseInfo number={anime.media.episodes.next.number} timestamp={anime.media.episodes.next.timestamp} mediaType={anime.media.type} />
      {/if}

      <!-- bottom -->
      <Informations title={anime.media.title.english || anime.media.title.romaji}>
        <AnimeInfo number={anime.media.episodes.count} duration={anime.media.runtime} rewatch={anime.repeat}/>
        <DateProgess userStatus={anime.status} startDate={anime.dates.started} progress={anime.progress.episode} total={anime.media.episodes.count} media={anime.media.type}/>
      </Informations>
    </BaseCard>

    {/if}
  {/each}
</div>
{/if}


{#if watched}
<h2>
  {$_("watched")}
  <span>· {$_("Nanime", { values: { n: watched.filter(anime => anime.media.episodes.count > 2).length }})} & {$_("Nspecials", { values: { n: watched.filter(anime => anime.media.episodes.count <= 2).length }})}</span>
  <div class="checkboxdiv"><input type="checkbox" id="toggle" bind:checked={isChecked}><label for="toggle" class="toggle-label">{$_('specialsOVAsToggle')}</label></div>
</h2>

<div id="watched" class="elements-wrapper">
  {#each watched as anime}

  <BaseCard accent={anime.media.accentColor} background={anime.media.cover.medium} ova={anime.media.episodes.count <= 2} bind:visible={isChecked} on:click={() => handleCardClick(anime)}>
    <!-- top -->
    {#if anime.review?.rating}
      <Rating value={anime.review.rating}/>
    {/if}

    <!-- bottom -->
     <Informations title={anime.media.title.english || anime.media.title.romaji}>
       <AnimeInfo number={anime.media.episodes.count} duration={anime.media.runtime} rewatch={anime.repeat}/>
    </Informations>
  </BaseCard>

  {/each}
</div>
{/if}

<UpdatedTime date={updatedAt} service="AniList"/>