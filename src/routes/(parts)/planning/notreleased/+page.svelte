<script>
    import BaseCard from '$components/cards/BaseCard.svelte';
    import Informations from '$components/cards/bottom/Informations.svelte';
    import PlanningRelease from '$components/cards/bottom/PlanningRelease.svelte';
    import UpdatedTime from '$components/UpdatedTime.svelte';
    import RelativeTimeInfo from '$components/cards/top/ReleaseInfo.svelte';

    export let data;
    const { anime, updatedAt } = data.plannedData;

    import { _ } from 'svelte-i18n';

    function isRecentlyStarted(startDate) {
        if (!startDate) return false;
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const animeStartDate = new Date(startDate);
        return animeStartDate >= oneMonthAgo;
    }

    const animePlanned = 
    anime.filter(a => {
            if (a.media.status === "NOT_YET_RELEASED") return true;
            if (a.media.status === "RELEASING" && isRecentlyStarted(a.media.dates.start)) return true;
            return false;
        })
        .filter(a => a.media.dates.start != null && a.media.dates.start.length > 4)
        .sort((a, b) => new Date(a.media.dates.start) - new Date(b.media.dates.start));

    const announcedAnime = anime.filter(a => a.media.status === "NOT_YET_RELEASED" && (a.media.dates.start == null || a.media.dates.start.length <= 4))
        .sort((a, b) => {
            // Put null dates at the end and those with a release year at the beginning
            if (a.media.dates.start === null) return 1;
            if (b.media.dates.start === null) return -1;
            
            return a.media.dates.start.localeCompare(b.media.dates.start); // Sort by year
        });

    function getSeason(dateString) {
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        
        let season;
        if (month >= 1 && month <= 3) season = 'Winter';
        else if (month >= 4 && month <= 6) season = 'Spring';
        else if (month >= 7 && month <= 9) season = 'Summer';
        else season = 'Fall';
        
        return `${season} ${year}`;
    }

    const groupedPlanned = animePlanned.reduce((acc, anime) => {
        const season = getSeason(anime.media.dates.start);
        if (!acc[season]) acc[season] = [];
        acc[season].push(anime);
        return acc;
    }, {});

    const seasons = Object.keys(groupedPlanned).sort((a, b) => {
        const dateA = new Date(groupedPlanned[a][0].media.dates.start);
        const dateB = new Date(groupedPlanned[b][0].media.dates.start);
        return dateA - dateB;
    });
</script>

<h2>anime <span>· {animePlanned.length} planned</span></h2>

{#each seasons as season}
    <h3>{season}</h3>
    <div class="elements-wrapper">
        {#each groupedPlanned[season] as anime}
            <BaseCard accent={anime.media.accentColor} background={anime.media.cover.medium} status={anime.media.status}>
                <Informations title={anime.media.title.english || anime.media.title.romaji}>
                    {#if anime.media.dates.start != null}
                        <PlanningRelease dateString={anime.media.dates.start}/>
                    {:else}
                        <PlanningRelease status={anime.media.status}/>
                    {/if}
                </Informations>
            </BaseCard>
        {/each}
    </div>
{/each}

<h2>announced <span>· {announcedAnime.length} announced</span></h2>

<div id="anime" class="elements-wrapper elements-planned">
  {#each announcedAnime as anime}

    <BaseCard accent={anime.media.accentColor} background={anime.media.cover.medium} status={anime.media.status}>
      <!-- top -->
      {#if anime.media.status === "RELEASING"} <!-- for airing/releasing anime -->
        <RelativeTimeInfo number={anime.nextEpisode.number} timestamp={anime.nextEpisode.timestamp} mediaType={anime.mediaType} />
      {/if}

      <!-- bottom -->
      <Informations title={anime.media.title.english || anime.media.title.romaji}>
        {#if anime.media.dates.start != null}
          <PlanningRelease dateString={anime.media.dates.start}/>
        {:else}
          <PlanningRelease status={anime.media.status}/>
        {/if}
      </Informations>
    </BaseCard>

  {/each}
</div>

<UpdatedTime date={updatedAt} service="AniList"/>