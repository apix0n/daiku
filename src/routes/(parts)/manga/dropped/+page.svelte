<script>
    import { ratingStars } from '$lib/ratingStars.js';
    import NoEntriesMessage from '../../../../components/NoEntriesMessage.svelte';
    import UpdatedTime from '../../../../components/UpdatedTime.svelte';

    export let data
    const { dropped, updatedAt } = data.mangaData;
    const cssHexAccentOpacity = "80";
    let isChecked = false;
</script>

{#if dropped.length !== 0}

{#if dropped.filter(manga => manga.userStatus === "PAUSED").length !== 0}
  <h2>paused <span>· {dropped.filter(manga => manga.userStatus === "PAUSED").length} manga</span></h2>

  <div id="paused" class="elements-wrapper">
    {#each dropped as manga}
      {#if manga.userStatus === "PAUSED" && manga.status !== "NOT_YET_RELEASED" && manga.chaptersProgress > 0}
        <div class="element" class:releasing={manga.status === 'RELEASING'} style:background-image="url({manga.coverLink})" style="{manga.accentColor !== null ? `--tAccentColor: ${manga.accentColor + cssHexAccentOpacity}; --accentColor: ${manga.accentColor}` : ''}">
          <div class="informations">
            <div class="upper">
              <a class="media-title" href="{manga.mediaLink}" target="_blank">{manga.title}</a>
            </div>
            {#if manga.chapterCount !== null || manga.volumesCount !== null}
              <span class="episodes-info">{manga.chapterCount !== null ? `${manga.chapterCount} chapter${manga.chapterCount > 1 ? 's' : ''}` : ''}{manga.chapterCount   !== null && manga.volumesCount !== null ? ' · ' : ''}{manga.volumesCount !== null ? `${manga.volumesCount} volume${manga.volumesCount > 1 ? 's' : ''}` :  ''}</span>
            {/if}
            <div class="more">
              <span class="episodes-info">paused at chap. {manga.chaptersProgress}</span>
            </div>
          </div>
        </div>
      {/if}
    {/each}
  </div>
  {/if}

{#if dropped.filter(manga => manga.userStatus === "DROPPED").length !== 0}
  <h2>dropped <span>· {dropped.filter(manga => manga.userStatus === "DROPPED").length} manga</span></h2>
  <div id="dropped" class="elements-wrapper">
  {#each dropped as manga}
      {#if manga.userStatus === "DROPPED" && manga.status !== "NOT_YET_RELEASED" && manga.chaptersProgress > 0}
      <div class="element" class:releasing={manga.status === 'RELEASING'} style:background-image="url({manga.coverLink})" style="{manga.accentColor !== null ? `--tAccentColor: ${manga.accentColor + cssHexAccentOpacity}; --accentColor: ${manga.accentColor}` : ''}">
        <div class="informations">
          <div class="upper">
              <a class="media-title" href="{manga.mediaLink}" target="_blank">{manga.title}</a>
            </div>
            {#if manga.chapterCount !== null || manga.volumesCount !== null}
              <span class="episodes-info">{manga.chapterCount !== null ? `${manga.chapterCount} chapter${manga.chapterCount > 1 ? 's' : ''}` : ''}{manga.chapterCount !== null && manga.volumesCount !== null ? ' · ' : ''}{manga.volumesCount !== null ? `${manga.volumesCount} volume${manga.volumesCount > 1 ? 's' : ''}` :  ''}</span>
              {/if}
              <div class="more">
                <span class="episodes-info">dropped after chap. {manga.chaptersProgress}</span>
              </div>
            </div>
          </div>
          {/if}
          {/each}
        </div>
  {/if}
  
  {:else}
  <NoEntriesMessage updateTime={updatedAt}/>
  {/if}
  
  <UpdatedTime date={updatedAt} service="AniList"/>

<style>
    .elements-wrapper .element {
        --border-radius: .8em;
        height: calc(var(--element-width) * 1.425);
    }
</style>