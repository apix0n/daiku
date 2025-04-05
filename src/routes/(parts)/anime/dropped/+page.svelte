<script>
    import BaseCard from '$components/cards/BaseCard.svelte';
    import Informations from '$components/cards/bottom/Informations.svelte';
    import AnimeInfo from '$components/cards/bottom/AnimeInfo.svelte';
    import RelativeTimeInfo from '$components/cards/top/ReleaseInfo.svelte';
    import DroppedPaused from '$components/cards/bottom/DroppedPaused.svelte'

    import NoEntriesMessage from '$components/NoEntriesMessage.svelte';
    import UpdatedTime from '$components/UpdatedTime.svelte';

    export let data
    const { dropped, updatedAt } = data.animeData;

    import { _ } from 'svelte-i18n';
</script>

{#if dropped.length > 0}

{#if dropped.filter(anime => anime.status === "PAUSED").length > 0}
<h2>{$_("paused")} <span>· {$_("Nanime", { values: { n : dropped.filter(anime => anime.status === "PAUSED").length }})}</span></h2>

<div id="paused" class="elements-wrapper">
  {#each dropped as anime}
    {#if anime.status === "PAUSED" && anime.status !== "NOT_YET_RELEASED" && anime.progress.episode > 0}

      <BaseCard accent={anime.media.accentColor} background={anime.media.cover.medium} status={anime.media.status}>
        <!-- top -->
        {#if anime.status === "RELEASING"}
          <RelativeTimeInfo number={anime.media.episodes.next.number} timestamp={anime.media.episodes.next.timestamp} mediaType={anime.media.type} />
        {/if}

        <!-- bottom -->
        <Informations title={anime.media.title.english || anime.media.title.romaji} link={'https://anilist.co/anime/' + anime.media.id.anilist}>
          <AnimeInfo number={anime.media.episodes.count} duration={anime.media.runtime}/>
          <DroppedPaused progress={anime.progress.episode} type={anime.status} mediaType={anime.media.type}/>
        </Informations>
      </BaseCard>

    {/if}
  {/each}
</div>
{/if}

{#if dropped.filter(anime => anime.status === "DROPPED").length !== 0}
<h2>{$_("dropped")} <span>· {$_("Nanime", { values: { n : dropped.filter(anime => anime.status === "DROPPED").length }})}</span></h2>

<div id="dropped" class="elements-wrapper">
  {#each dropped as anime}
    {#if anime.status === "DROPPED" && anime.status !== "NOT_YET_RELEASED" && anime.progress.episode > 0}

      <BaseCard accent={anime.media.accentColor} background={anime.media.cover.medium} status={anime.media.status}>
        <!-- top -->
        {#if anime.status === "RELEASING"}
          <RelativeTimeInfo number={anime.media.episodes.next.number} timestamp={anime.media.episodes.next.timestamp} mediaType={anime.media.type} />
        {/if}

        <!-- bottom -->
        <Informations title={anime.media.title.english || anime.media.title.romaji} link={'https://anilist.co/anime/' + anime.media.id.anilist}>
          <AnimeInfo number={anime.media.episodes.count} duration={anime.media.runtime}/>
          <DroppedPaused progress={anime.progress.episode} type={anime.status} mediaType={anime.media.type}/>
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
