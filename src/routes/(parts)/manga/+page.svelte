<script>
    import { formatDateLocale } from '$lib/formatDateLocale.js';
    import { ratingStars } from '$lib/ratingStars.js';
    import Rewatch from '../../../components/icons/Rewatch.svelte';
    import UpdatedTime from '../../../components/UpdatedTime.svelte';
    import { getRelativeTime } from '$lib/getRelativeTime';
	import RelativeTimeInfo from '../../../components/RelativeTimeInfo.svelte'

    export let data
    const { current, read, updatedAt } = data.mangaData;
    const cssHexAccentOpacity = "80";

    let isChecked = false;
</script>

{#if current.length !== 0}
<h2>
  currently reading
  <span>· {current.length} manga</span>
</h2>

  <div id="current" class="elements-wrapper">
    {#each current as manga}
        {#if manga.status !== "NOT_YET_RELEASED" && manga.chaptersProgress > 0}
          <div class="element" class:releasing={manga.status === 'RELEASING'} style:background-image="url({manga.coverLink})" style="{manga.accentColor !== null ? `--tAccentColor: ${manga.accentColor + cssHexAccentOpacity}; --accentColor: ${manga.accentColor}` : ''}">
            {#if manga.status === "RELEASING" && manga.lastChapter !== null}
              <div class="informations top" class:toCatchUp={manga.chaptersProgress < manga.lastChapter.number}>
                <RelativeTimeInfo number={manga.lastChapter.number} timestamp={Math.floor(manga.lastChapter.timestamp / 1000)} mediaType="chapter" />
              </div>
            {/if}
            <div class="informations">
              <div class="upper">
                <a class="media-title" href="{manga.mediaLink}" target="_blank">{manga.title}</a>
              </div>
              {#if manga.chapterCount !== null || manga.volumesCount !== null}
                 <span class="episodes-info">{manga.chapterCount !== null ? `${manga.chapterCount} chapter${manga.chapterCount > 1 ? 's' : ''}` : ''}{manga.chapterCount !== null && manga.volumesCount !== null ? ' · ' : ''}{manga.volumesCount !== null ? `${manga.volumesCount} volume${manga.volumesCount > 1 ? 's' : ''}` : ''}</span>
              {/if}
              <div class="more">
              {#if manga.userStatus === "REPEATING"}
              <div class="dates">
                <div class="start-date"><Rewatch/> re-reading</div>
              </div>
              {:else if manga.startedDate !== null}
                <div class="dates">
                  <span class="start-date">{formatDateLocale(manga.startedDate).toLocaleDateString()}</span>
                </div>
              {/if}
                <span class="episodes-info">{manga.chaptersProgress}{manga.chapterCount !== null ? `/${manga.chapterCount}` : '/?'}</span>
              </div>
            </div>
          </div>
        {/if}
    {/each}
  </div>
{/if}


{#if read.length !== 0}
    <h2>
      read
      <span>· {read.filter(manga => manga.chapterCount > 4).length} manga & {read.filter(manga => manga.chapterCount <= 4).length} specials</span>
      <div class="checkboxdiv"><input type="checkbox" id="toggle" bind:checked={isChecked}><label for="toggle" class="toggle-label">Show one-shots/specials</label></div>
    </h2>
    
    <div id="watched" class="elements-wrapper">
      {#each read as manga}
        {#if manga.status !== "NOT_YET_RELEASED" }
          <div class="element" class:ova={manga.chapterCount <= 4 && !manga.volumesCount} class:visible={isChecked && manga.chapterCount <= 4} style:background-image="url({manga.coverLink})" style="{manga.accentColor !== null ? `--tAccentColor: ${manga.accentColor + cssHexAccentOpacity}; --accentColor: ${manga.accentColor}` : ''}">
            {#if manga.rating !== 0}
              <div class="informations top">
                <span class="rating">{@html ratingStars(manga.rating)}</span>
              </div>
            {/if}
            <div class="informations">
              <div class="upper">
                <a class="media-title" href="{manga.mediaLink}" target="_blank">{manga.title}</a>
              </div>
              {#if manga.chapterCount !== null || manga.volumesCount !== null}
                 <span class="episodes-info">{manga.chapterCount !== null ? `${manga.chapterCount} ${!manga.reread ? `chapter${manga.chapterCount > 1 ? 's' : ''}` : "chap."}` : ''}{manga.chapterCount !== null && manga.volumesCount !== null ? ' · ' : ''}{manga.volumesCount !== null ? `${manga.volumesCount} ${!manga.reread ? `volume${manga.volumesCount > 1 ? 's' : ''}` : "vol." }` : ''} {#if manga.reread}<Rewatch Number={manga.reread}/>{/if}</span>
              {/if}
              <div class="more">
                {#if manga.startedDate == manga.finishedDate && manga.startedDate != null}
                <div class="dates">
                  <span class="finish-date">{new Date(manga.finishedDate).toLocaleDateString()}</span>
                </div>
                {:else if manga.startedDate != null && manga.finishedDate != null}
                <div class="dates">
                  <span class="start-date">{new Date(manga.startedDate).toLocaleDateString()}</span>
                  <span class="finish-date">{new Date(manga.finishedDate).toLocaleDateString()}</span>
                </div>
                {/if}
              </div>
            </div>
          </div>
          {/if}
          {/each}
        </div>
{/if}

<UpdatedTime date={updatedAt} service="AniList"/>

<style>
    .elements-wrapper .element {
        --border-radius: .8em;
        height: calc(var(--element-width) * 1.425);
    }

    @media screen and (max-width: 1200px) {
        .elements-wrapper .element {
            --element-width: 150px;
        }

        #current .element .media-title {
          font-size: 1.1em;
        }
    }
</style>