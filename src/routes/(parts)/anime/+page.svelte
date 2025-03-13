<script>
    import UpdatedTime from '../../../components/UpdatedTime.svelte';

    import BaseCard from '../../../components/cards/BaseCard.svelte';
    import Informations from '../../../components/cards/bottom/Informations.svelte';
    import DateProgess from '../../../components/cards/bottom/DateProgess.svelte'
    import Rating from '../../../components/cards/top/Rating.svelte';
    import AnimeInfo from '../../../components/cards/bottom/AnimeInfo.svelte';
    import RelativeTimeInfo from '../../../components/cards/top/ReleaseInfo.svelte';
    import Dates from '../../../components/cards/bottom/Dates.svelte'

    export let data
    const { current, watched, updatedAt } = data.animeData;
    let isChecked = false;

    import {_} from "svelte-i18n"
</script>

{#if current}
<h2>{$_('currentlyWatching')} <span>· {$_("Nanime", { values: { n : current.length }})}</span></h2>

<div id="current" class="elements-wrapper">
  {#each current as anime}
    {#if anime.status !== "NOT_YET_RELEASED" && anime.episodesProgress > 0 && anime.episodesProgress !== anime.episodesNumber} <!-- avoid displaying unreleased, finished or not started anime -->
    
    <BaseCard accent={anime.accentColor} background={anime.coverLink} status={anime.status}>
      <!-- top -->
      {#if anime.status === "RELEASING" && anime.nextEpisode && anime.nextEpisode?.number - 1 === anime.episodesProgress} <!-- for airing/releasing anime, only show next episode in ... label if the user's is up to-date -->
        <RelativeTimeInfo number={anime.nextEpisode.number} timestamp={anime.nextEpisode.timestamp} mediaType={anime.mediaType} />
      {:else if anime.status === "RELEASING" && anime.lastEpisode && anime.episodesProgress > 0 && anime.episodesProgress < anime.episodesNumber && anime.lastEpisode.number - anime.episodesProgress <= 2}
        <RelativeTimeInfo number={anime.lastEpisode.number} timestamp={anime.lastEpisode.timestamp} mediaType={anime.mediaType} />
      {:else if anime.status === "RELEASING" && anime.nextEpisode && anime.nextEpisode.number - anime.episodesProgress > 50 }
        <RelativeTimeInfo number={anime.nextEpisode.number} timestamp={anime.nextEpisode.timestamp} mediaType={anime.mediaType} />
      {/if}

      <!-- bottom -->
      <Informations title={anime.title} link={anime.mediaLink}>
        <AnimeInfo number={anime.episodesNumber} duration={anime.episodesDuration} rewatch={anime.rewatch}/>
        <DateProgess userStatus={anime.userStatus} startDate={anime.startedDate} progress={anime.episodesProgress} total={anime.episodesNumber} media={anime.mediaType}/>
      </Informations>
    </BaseCard>

    {/if}
  {/each}
</div>
{/if}


{#if watched}
<h2>
  {$_("watched")}
  <span>· {$_("Nanime", { values: { n: watched.filter(anime => anime.episodesNumber > 2).length }})} & {$_("Nspecials", { values: { n: watched.filter(anime => anime.episodesNumber <= 2).length }})}</span>
  <div class="checkboxdiv"><input type="checkbox" id="toggle" bind:checked={isChecked}><label for="toggle" class="toggle-label">{$_('specialsOVAsToggle')}</label></div>
</h2>

<div id="watched" class="elements-wrapper">
  {#each watched as anime}

  <BaseCard accent={anime.accentColor} background={anime.coverLink} ova={anime.episodesNumber <= 2} bind:visible={isChecked}>
    <!-- top -->
    {#if anime.rating}
      <Rating value={anime.rating}/>
    {/if}

    <!-- bottom -->
     <Informations title={anime.title} link={anime.mediaLink}>
       <AnimeInfo number={anime.episodesNumber} duration={anime.episodesDuration} rewatch={anime.rewatch}/>
       <Dates start={anime.startedDate} end={anime.finishedDate} />
    </Informations>
  </BaseCard>

  {/each}
</div>
{/if}

<UpdatedTime date={updatedAt} service="AniList"/>