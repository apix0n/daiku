<script>
  import UpdatedTime from '$components/UpdatedTime.svelte';

    import BaseCard from '$components/cards/BaseCard.svelte';
    import Informations from '$components/cards/bottom/Informations.svelte';
    import DateProgess from '$components/cards/bottom/DateProgess.svelte'
    import Rating from '$components/cards/top/Rating.svelte';
    import MangaInfo from '$components/cards/bottom/MangaInfo.svelte';
    import RelativeTimeInfo from '$components/cards/top/ReleaseInfo.svelte';
    import Dates from '$components/cards/bottom/Dates.svelte'

    export let data
    const { current, read, updatedAt } = data.mangaData;

    let isChecked = false;
    let selectedManga = null;

    function handleCardClick(manga) {
        selectedManga = manga;
    }

    import { _ } from 'svelte-i18n';
    import Overlay from '$components/overlay/Overlay.svelte';
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
        {#if manga.media.status !== "NOT_YET_RELEASED" && manga.progress.chapter > 0}

        <BaseCard accent={manga.media.accentColor} background={manga.media.cover.medium} status={manga.media.status} on:click={() => handleCardClick(manga)}>
          <!-- top -->
          {#if manga.media.status === "RELEASING" && manga.media.chapters.last && manga.progress.chapter <= manga.media.chapters.last.number && manga.media.chapters.last.number - manga.progress.chapter < 20 }
            <RelativeTimeInfo number={manga.media.chapters.last.number} timestamp={Math.floor(manga.media.chapters.last.timestamp)} mediaType={manga.media.type} catchUp={manga.progress.chapter < manga.media.chapters.last.number} />
          {/if}

          <!-- bottom -->
           <Informations title={manga.media.title.english || manga.media.title.romaji}>
              <MangaInfo chapters={manga.media.chapters.count} volumes={manga.media.volumes.count}/>
              <DateProgess userStatus={manga.status} startDate={manga.dates.started} progress={manga.progress.chapter} total={manga.media.chapters.count} media={manga.media.type}/>
           </Informations>
        </BaseCard>

        {/if}
    {/each}
  </div>
{/if}

{#if read.length !== 0}
    <h2>
      {$_("read")}
      <span>· {read.filter(manga => manga.media.chapters.count > 4).length} manga & {read.filter(manga => manga.media.chapters.count <= 4).length} specials</span>
      <div class="checkboxdiv"><input type="checkbox" id="toggle" bind:checked={isChecked}><label for="toggle" class="toggle-label">{$_("specialsOneShotsToggle")}</label></div>
    </h2>
    
    <div id="watched" class="elements-wrapper elements-manga">
      {#each read as manga}
        {#if manga.media.status !== "NOT_YET_RELEASED" }

          <BaseCard accent={manga.media.accentColor} background={manga.media.cover.medium} status={manga.media.status} ova={manga.media.chapters.count <= 4 && !manga.media.volumes.count} bind:visible={isChecked} on:click={() => handleCardClick(manga)}>
          <!-- top -->
          {#if manga.review.rating !== 0}
              <Rating value={manga.review.rating} />
          {/if}

          <!-- bottom -->
           <Informations title={manga.media.title.english || manga.media.title.romaji}>
              <MangaInfo chapters={manga.media.chapters.count} volumes={manga.media.volumes.count}/>
            </Informations>
          </BaseCard>
          
          {/if}
          {/each}
        </div>
{/if}
      
<UpdatedTime date={updatedAt} service="AniList"/>