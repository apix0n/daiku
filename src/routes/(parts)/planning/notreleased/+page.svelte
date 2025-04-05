<script>
    import BaseCard from '../../../../components/cards/BaseCard.svelte';
    import Informations from '../../../../components/cards/bottom/Informations.svelte';
    import PlanningRelease from '../../../../components/cards/bottom/PlanningRelease.svelte';
    import UpdatedTime from '../../../../components/UpdatedTime.svelte';
    import RelativeTimeInfo from '../../../../components/cards/top/ReleaseInfo.svelte';

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
    anime.filter(a => a.type !== "MOVIE")
        .filter(a => {
            if (a.status === "NOT_YET_RELEASED") return true;
            if (a.status === "RELEASING" && isRecentlyStarted(a.startDate)) return true;
            return false;
        })
        .filter(a => a.startDate != null && a.startDate.length > 4)
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    const announcedAnime = anime.filter(a => a.type !== "MOVIE")
        .filter(a => a.status === "NOT_YET_RELEASED" && (a.startDate == null || a.startDate.length <= 4))
        .sort((a, b) => {
            // Put null dates at the end and those with a release year at the beginning
            if (a.startDate === null) return 1;
            if (b.startDate === null) return -1;
            
            return a.startDate.localeCompare(b.startDate); // Sort by year
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
        const season = getSeason(anime.startDate);
        if (!acc[season]) acc[season] = [];
        acc[season].push(anime);
        return acc;
    }, {});

    const seasons = Object.keys(groupedPlanned).sort((a, b) => {
        const dateA = new Date(groupedPlanned[a][0].startDate);
        const dateB = new Date(groupedPlanned[b][0].startDate);
        return dateA - dateB;
    });
</script>

<h2>anime <span>· {animePlanned.length} planned</span></h2>

{#each seasons as season}
    <h3>{season}</h3>
    <div class="elements-wrapper">
        {#each groupedPlanned[season] as anime}
            <BaseCard accent={anime.accentColor} background={anime.coverLink} status={anime.status}>
                <Informations title={anime.title} link={anime.mediaLink}>
                    {#if anime.startDate != null}
                        <PlanningRelease dateString={anime.startDate}/>
                    {:else}
                        <PlanningRelease status={anime.status}/>
                    {/if}
                </Informations>
            </BaseCard>
        {/each}
    </div>
{/each}

<h2>announced <span>· {announcedAnime.length} announced</span></h2>

<div id="anime" class="elements-wrapper elements-planned">
  {#each announcedAnime as anime}

    <BaseCard accent={anime.accentColor} background={anime.coverLink} status={anime.status}>
      <!-- top -->
      {#if anime.status === "RELEASING"} <!-- for airing/releasing anime -->
        <RelativeTimeInfo number={anime.nextEpisode.number} timestamp={anime.nextEpisode.timestamp} mediaType={anime.mediaType} />
      {/if}

      <!-- bottom -->
      <Informations title={anime.title} link={anime.mediaLink}>
        {#if anime.startDate != null}
          <PlanningRelease dateString={anime.startDate}/>
        {:else}
          <PlanningRelease status={anime.status}/>
        {/if}
      </Informations>
    </BaseCard>

  {/each}
</div>

<UpdatedTime date={updatedAt} service="AniList"/>