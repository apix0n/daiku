<script lang="ts">
  import UpdatedTime from '$components/UpdatedTime.svelte';

    import BaseCard from '$components/cards/BaseCard.svelte';
    import Informations from '$components/cards/bottom/Informations.svelte';
    import DateProgess from '$components/cards/bottom/DateProgess.svelte'
    import Rating from '$components/cards/top/Rating.svelte';
    import MangaInfo from '$components/cards/bottom/MangaInfo.svelte';
    import RelativeTimeInfo from '$components/cards/top/ReleaseInfo.svelte';

    export let data
    const { current, read, updatedAt } = data.mangaData;

    let isChecked = false;
    let selectedManga: MediaElement | null = null;

    function handleCardClick(manga: MediaElement) {
        selectedManga = manga;
    }

    import { _ } from 'svelte-i18n';
    import Overlay from '$components/overlay/Overlay.svelte';
    import type { MediaElement } from '$lib/types/media.js';
</script>

{#if selectedManga}
    <Overlay entry={selectedManga} on:close={() => selectedManga = null} />
{/if}

{#if current.length !== 0}
<h2>
  {$_("currentlyReading")}
  <span>· {current.length} manga</span>
</h2>

  <div id="current" class="elements-wrapper elements-manga">
    {#each current as manga}
        {#if manga.media.status !== "notYetReleased" && (manga.progress?.chapter ?? 0) > 0}

        <BaseCard accent={manga.media.accentColor} background={manga.media.cover.medium} status={manga.media.status} on:click={() => handleCardClick(manga)}>
          <!-- top -->
          {#if manga.media.status === "airing" && manga.media.chapters?.last && manga.progress?.chapter && (manga.progress?.chapter ?? 0) <= manga.media.chapters.last.number && manga.media.chapters.last.number - (manga.progress?.chapter ?? 0) < 20 }
            <RelativeTimeInfo episode={manga.media.chapters.last} mediaType={manga.media.type} catchUp={manga.progress.chapter < manga.media.chapters.last.number} />
          {/if}

          <!-- bottom -->
           <Informations title={manga.media.title.english || manga.media.title.romaji || manga.media.title.native}>
              <MangaInfo chapters={manga.media.chapters?.count} volumes={manga.media.volumes?.count}/>
              <DateProgess userStatus={manga.status} startDate={manga.dates?.started} progress={manga.progress?.chapter ?? 0} total={manga.media.chapters?.count ?? 0} mediaType={manga.media.type}/>
           </Informations>
        </BaseCard>

        {/if}
    {/each}
  </div>
{/if}

{#if read.length !== 0}
    <h2>
      {$_("read")}
      <span>· {read.filter(manga => !manga.media.special).length} manga & {read.filter(manga => manga.media.special).length} specials</span>
      <div class="checkboxdiv"><input type="checkbox" id="toggle" bind:checked={isChecked}><label for="toggle" class="toggle-label">{$_("specialsOneShotsToggle")}</label></div>
    </h2>
    
    <div id="watched" class="elements-wrapper elements-manga">
      {#each read as manga}
        {#if manga.media.status !== "notYetReleased" }

          <BaseCard accent={manga.media.accentColor} background={manga.media.cover.medium} status={manga.media.status} ova={manga.media.special} bind:visible={isChecked} on:click={() => handleCardClick(manga)}>
          <!-- top -->
          {#if manga.review.rating !== 0}
              <Rating value={manga.review.rating} />
          {/if}

          <!-- bottom -->
           <Informations title={manga.media.title.english || manga.media.title.romaji || manga.media.title.native}>
              <MangaInfo chapters={manga.media.chapters?.count} volumes={manga.media.volumes?.count}/>
            </Informations>
          </BaseCard>
          
          {/if}
          {/each}
        </div>
{/if}
      
<UpdatedTime info={updatedAt}/>