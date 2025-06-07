<script lang="ts">
    import BaseCard from "$components/cards/BaseCard.svelte";
    import Informations from "$components/cards/bottom/Informations.svelte";
    import PlanningRelease from "$components/cards/bottom/PlanningRelease.svelte";
    import UpdatedTime from "$components/UpdatedTime.svelte";

    export let data;
    const { anime, updatedAt } = data.plannedData;

    import { _ } from "svelte-i18n";

    function isRecentlyStarted(startDate: string | null | undefined): boolean {
        if (!startDate) return false;
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const animeStartDate = new Date(startDate);
        return animeStartDate >= oneMonthAgo;
    }

    const animePlanned = anime
        .filter((a) => {
            if (a.media.status === "notYetReleased") return true;
            if (
                a.media.status === "airing" &&
                isRecentlyStarted(a.media.dates?.start)
            )
                return true;
            return false;
        })
        .filter(
            (a) =>
                a.media.dates?.start != null && a.media.dates.start.length > 4,
        )
        .sort((a, b) => {
            const aStart = a.media.dates?.start ?? "";
            const bStart = b.media.dates?.start ?? "";
            const aTime = aStart ? new Date(aStart).getTime() : 0;
            const bTime = bStart ? new Date(bStart).getTime() : 0;
            return aTime - bTime;
        });

    const announcedAnime = anime
        .filter(
            (a) =>
                a.media.status === "notYetReleased" &&
                (a.media.dates?.start == null ||
                    a.media.dates.start.length <= 4),
        )
        .sort((a, b) => {
            // Put null dates at the end and those with a release year at the beginning
            if (a.media.dates?.start === null) return 1;
            if (b.media.dates?.start === null) return -1;

            return (a.media.dates?.start ?? "").localeCompare(
                b.media.dates?.start ?? "",
            ); // Sort by year
        });

    function getSeason(dateString: string): string {
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        let season;
        if (month >= 1 && month <= 3) season = "Winter";
        else if (month >= 4 && month <= 6) season = "Spring";
        else if (month >= 7 && month <= 9) season = "Summer";
        else season = "Fall";

        return `${season} ${year}`;
    }

    const groupedPlanned = animePlanned.reduce(
        (acc: { [key: string]: typeof animePlanned }, anime) => {
            const season = getSeason(anime.media.dates?.start ?? "");
            if (!acc[season]) acc[season] = [];
            acc[season].push(anime);
            return acc;
        },
        {} as { [key: string]: typeof animePlanned },
    );

    const seasons = Object.keys(groupedPlanned).sort((a, b) => {
        const dateAString = groupedPlanned[a]?.[0]?.media?.dates?.start ?? "";
        const dateBString = groupedPlanned[b]?.[0]?.media?.dates?.start ?? "";
        const dateA = new Date(dateAString).getTime();
        const dateB = new Date(dateBString).getTime();
        return dateA - dateB;
    });

    import Overlay from "$components/overlay/Overlay.svelte";
    import type { MediaElement } from "$lib/types/media.js";
    let selectedAnime: MediaElement | null = null;

    function handleCardClick(anime: MediaElement) {
        selectedAnime = anime;
    }
</script>

{#if selectedAnime}
    <Overlay entry={selectedAnime} on:close={() => (selectedAnime = null)} />
{/if}

<h2>anime <span>· {animePlanned.length} planned</span></h2>

{#each seasons as season}
    <h3>{season}</h3>
    <div class="elements-wrapper">
        {#each groupedPlanned[season] as anime}
            <BaseCard
                accent={anime.media.accentColor}
                background={anime.media.cover.medium}
                status={anime.media.status}
                on:click={() => handleCardClick(anime)}
            >
                <Informations titles={anime.media.title}>
                    {#if anime.media.dates?.start != null}
                        <PlanningRelease
                            dateString={anime.media.dates.start}
                            status={anime.media.status}
                        />
                    {:else}
                        <PlanningRelease status={anime.media.status} />
                    {/if}
                </Informations>
            </BaseCard>
        {/each}
    </div>
{/each}

<h2>announced <span>· {announcedAnime.length} announced</span></h2>

<div id="anime" class="elements-wrapper elements-planned">
    {#each announcedAnime as anime}
        <BaseCard
            accent={anime.media.accentColor}
            background={anime.media.cover.medium}
            status={anime.media.status}
            on:click={() => handleCardClick(anime)}
        >
            <!-- bottom -->
            <Informations titles={anime.media.title}>
                {#if anime.media.dates?.start != null}
                    <PlanningRelease
                        dateString={anime.media.dates.start}
                        status={anime.media.status}
                    />
                {:else}
                    <PlanningRelease status={anime.media.status} />
                {/if}
            </Informations>
        </BaseCard>
    {/each}
</div>

<UpdatedTime info={updatedAt} />
