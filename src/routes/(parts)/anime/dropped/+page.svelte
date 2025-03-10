<script>
    import BaseCard from '../../../../components/cards/BaseCard.svelte';
    import Informations from '../../../../components/cards/bottom/Informations.svelte';
    import AnimeInfo from '../../../../components/cards/bottom/AnimeInfo.svelte';
    import RelativeTimeInfo from '../../../../components/cards/top/RelativeTimeInfo.svelte';
    import DroppedPaused from '../../../../components/cards/bottom/DroppedPaused.svelte'

    import NoEntriesMessage from '../../../../components/NoEntriesMessage.svelte';
    import UpdatedTime from '../../../../components/UpdatedTime.svelte';

    export let data
    const { dropped, updatedAt } = data.animeData;

    import { _ } from 'svelte-i18n';
</script>

{#if dropped.length > 0}

{#if dropped.filter(anime => anime.userStatus === "PAUSED").length > 0}
<h2>paused <span>· {dropped.filter(anime => anime.userStatus === "PAUSED").length} anime</span></h2>

<div id="paused" class="elements-wrapper">
  {#each dropped as anime}
    {#if anime.userStatus === "PAUSED" && anime.status !== "NOT_YET_RELEASED" && anime.episodesProgress > 0}

      <BaseCard accent={anime.accentColor} background={anime.coverLink} status={anime.status}>
        <!-- top -->
        {#if anime.status === "RELEASING"}
          <RelativeTimeInfo number={anime.nextEpisode.number} timestamp={anime.nextEpisode.timestamp} mediaType={anime.mediaType} />
        {/if}

        <!-- bottom -->
        <Informations title={anime.title} link={anime.mediaLink}>
          <AnimeInfo number={anime.episodesNumber} duration={anime.episodesDuration}/>
          <DroppedPaused progress={anime.episodesProgress} type={anime.userStatus} mediaType={anime.mediaType}/>
        </Informations>
      </BaseCard>

    {/if}
  {/each}
</div>
{/if}

{#if dropped.filter(anime => anime.userStatus === "DROPPED").length !== 0}
<h2>dropped <span>· {dropped.filter(anime => anime.userStatus === "DROPPED").length} anime</span></h2>

<div id="dropped" class="elements-wrapper">
  {#each dropped as anime}
    {#if anime.userStatus === "DROPPED" && anime.status !== "NOT_YET_RELEASED" && anime.episodesProgress > 0}

      <BaseCard accent={anime.accentColor} background={anime.coverLink} status={anime.status}>
        <!-- top -->
        {#if anime.status === "RELEASING"}
          <RelativeTimeInfo number={anime.nextEpisode.number} timestamp={anime.nextEpisode.timestamp} mediaType={anime.mediaType} />
        {/if}

        <!-- bottom -->
        <Informations title={anime.title} link={anime.mediaLink}>
          <AnimeInfo number={anime.episodesNumber} duration={anime.episodesDuration}/>
          <DroppedPaused progress={anime.episodesProgress} type={anime.userStatus} mediaType={anime.mediaType}/>
        </Informations>
      </BaseCard>

    {/if}
  {/each}
</div>
{/if}

{:else}
  <NoEntriesMessage/>
{/if}

<UpdatedTime date={updatedAt} service="AniList"/>
