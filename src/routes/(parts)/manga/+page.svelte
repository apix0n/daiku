<script>
  import UpdatedTime from '../../../components/UpdatedTime.svelte';

    import BaseCard from '../../../components/cards/BaseCard.svelte';
    import Informations from '../../../components/cards/bottom/Informations.svelte';
    import DateProgess from '../../../components/cards/bottom/DateProgess.svelte'
    import Rating from '../../../components/cards/top/Rating.svelte';
    import MangaInfo from '../../../components/cards/bottom/MangaInfo.svelte';
    import RelativeTimeInfo from '../../../components/cards/top/RelativeTimeInfo.svelte';
    import Dates from '../../../components/cards/bottom/Dates.svelte'

    export let data
    const { current, read, updatedAt } = data.mangaData;

    let isChecked = false;

    import { _ } from 'svelte-i18n';
	import { scale } from 'svelte/transition'
</script>

{#if current.length !== 0}
<h2>
  {$_("currentlyReading")}
  <span>· {current.length} manga</span>
</h2>

  <div id="current" class="elements-wrapper elements-manga">
    {#each current as manga}
        {#if manga.status !== "NOT_YET_RELEASED" && manga.chaptersProgress > 0}

        <BaseCard accent={manga.accentColor} background={manga.coverLink} status={manga.status}>
          <!-- top -->
          {#if manga.status === "RELEASING" && manga.lastChapter && manga.chaptersProgress <= manga.lastChapter.number }
            <RelativeTimeInfo number={manga.lastChapter.number} timestamp={Math.floor(manga.lastChapter.timestamp / 1000)} mediaType={manga.mediaType} catchUp={manga.chaptersProgress < manga.lastChapter.number} />
          {/if}

          <!-- bottom -->
           <Informations title={manga.title} link={manga.mediaLink}>
              <MangaInfo chapters={manga.chapterCount} volumes={manga.volumesCount}/>
              <DateProgess userStatus={manga.userStatus} startDate={manga.startedDate} progress={manga.chaptersProgress} total={manga.chapterCount} media={manga.mediaType}/>
           </Informations>
        </BaseCard>

        {/if}
    {/each}
  </div>
{/if}


{#if read.length !== 0}
    <h2>
      {$_("read")}
      <span>· {read.filter(manga => manga.chapterCount > 4).length} manga & {read.filter(manga => manga.chapterCount <= 4).length} specials</span>
      <div class="checkboxdiv"><input type="checkbox" id="toggle" bind:checked={isChecked}><label for="toggle" class="toggle-label">Show one-shots/specials</label></div>
    </h2>
    
    <div id="watched" class="elements-wrapper elements-manga">
      {#each read as manga}
        {#if manga.status !== "NOT_YET_RELEASED" }

          <BaseCard accent={manga.accentColor} background={manga.coverLink} status={manga.status} ova={manga.chapterCount <= 4 && !manga.volumesCount} bind:visible={isChecked}>
          <!-- top -->
          {#if manga.rating !== 0}
              <Rating value={manga.rating} />
          {/if}

          <!-- bottom -->
           <Informations title={manga.title} link={manga.mediaLink}>
              <MangaInfo chapters={manga.chapterCount} volumes={manga.volumesCount}/>
              <Dates start={manga.startedDate} end={manga.finishedDate} />
            </Informations>
          </BaseCard>
          
          {/if}
          {/each}
        </div>
{/if}
      
<UpdatedTime date={updatedAt} service="AniList"/>