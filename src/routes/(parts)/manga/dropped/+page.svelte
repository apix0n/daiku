<script>
    import BaseCard from '../../../../components/cards/BaseCard.svelte';
    import Informations from '../../../../components/cards/bottom/Informations.svelte';
    import MangaInfo from '../../../../components/cards/bottom/MangaInfo.svelte';
    import RelativeTimeInfo from '../../../../components/cards/top/ReleaseInfo.svelte';
    import DroppedPaused from '../../../../components/cards/bottom/DroppedPaused.svelte'

    import NoEntriesMessage from '../../../../components/NoEntriesMessage.svelte';
    import UpdatedTime from '../../../../components/UpdatedTime.svelte';

    export let data
    const { dropped, updatedAt } = data.mangaData;

    import { _ } from 'svelte-i18n';
</script>

{#if dropped.length > 0}

{#if dropped.filter(manga => manga.userStatus === "PAUSED").length > 0}
  <h2>{$_("paused")} <span>· {dropped.filter(manga => manga.userStatus === "PAUSED").length} manga</span></h2>

  <div id="paused" class="elements-wrapper elements-manga">
    {#each dropped as manga}
      {#if manga.userStatus === "PAUSED" && manga.status !== "NOT_YET_RELEASED" && manga.chaptersProgress > 0}
        
      <BaseCard accent={manga.accentColor} background={manga.coverLink} status={manga.status}>
        <!-- bottom -->
        <Informations title={manga.title} link={manga.mediaLink}>
          <MangaInfo chapters={manga.chapterCount} volumes={manga.volumesCount}/>
          <DroppedPaused progress={manga.chaptersProgress} type={manga.userStatus} mediaType={manga.mediaType}/>
        </Informations>
      </BaseCard>

      {/if}
    {/each}
  </div>
  {/if}

{#if dropped.filter(manga => manga.userStatus === "DROPPED").length !== 0}
  <h2>{$_("dropped")} <span>· {dropped.filter(manga => manga.userStatus === "DROPPED").length} manga</span></h2>
  <div id="dropped" class="elements-wrapper elements-manga">
  {#each dropped as manga}
      {#if manga.userStatus === "DROPPED" && manga.status !== "NOT_YET_RELEASED" && manga.chaptersProgress > 0}
      
      <BaseCard accent={manga.accentColor} background={manga.coverLink} status={manga.status}>
        <!-- bottom -->
        <Informations title={manga.title} link={manga.mediaLink}>
          <MangaInfo chapters={manga.chapterCount} volumes={manga.volumesCount}/>
          <DroppedPaused progress={manga.chaptersProgress} type={manga.userStatus} mediaType={manga.mediaType}/>
        </Informations>
      </BaseCard>

      {/if}
  {/each}
  </div>
  {/if}
  
  {:else}
  <NoEntriesMessage updateTime={updatedAt}/>
  {/if}
  
  <UpdatedTime date={updatedAt} service="AniList"/>