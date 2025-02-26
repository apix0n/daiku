<script>
    import { onMount } from 'svelte';
    import Cultura from '../../../../components/enseignes/Cultura.svelte';
    import Fnac from '../../../../components/enseignes/Fnac.svelte';
    import Amazon from '../../../../components/enseignes/Amazon.svelte';
    import FuretDuNord from '../../../../components/enseignes/FuretDuNord.svelte';
    import UpdatedTime from '../../../../components/UpdatedTime.svelte';

    export let data;
    const { collection, updatedAt } = data.mangaCollection;

    let showModal = false;
    let selectedVolume = {};

    function openModal(volume, edition, manga) {
        selectedVolume = { ...volume, editionTitle: edition.titreEdition, mangaTitle: manga.titre };
        showModal = true;
    }

    function closeModal() {
        showModal = false;
        selectedVolume = {};
    }

    function handleKeydown(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    }

    onMount(() => {
        window.addEventListener('keydown', handleKeydown);
        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    });

    // Calculer le nombre total de volumes possédés
    $: totalVolumes = collection.reduce((total, manga) => {
        return total + manga.editions.reduce((editionTotal, edition) => {
            return editionTotal + edition.next.length;
        }, 0);
    }, 0);

    $: seriesWithNext = collection // TODO: sort mangas with possessions (to complete) at the top
        .filter(manga => manga.editions.some(edition => edition.next.length > 0)) // filter out series without next volumes
        .sort((a, b) => { // sort series with only non-released volumes then no cover at the bottom
            const aHasOnlyReleaseDate = a.editions.every(edition => 
                edition.next.every(volume => volume.releaseDate != null)
            );
            const bHasOnlyReleaseDate = b.editions.every(edition => 
                edition.next.every(volume => volume.releaseDate != null)
            );

            const aHasOnlyNoCover = a.editions.every(edition => 
                edition.next.every(volume => volume.noCover)
            );
            const bHasOnlyNoCover = b.editions.every(edition => 
                edition.next.every(volume => volume.noCover)
            );

            if (aHasOnlyReleaseDate !== bHasOnlyReleaseDate) {
                return aHasOnlyReleaseDate - bHasOnlyReleaseDate;
            }

            return aHasOnlyNoCover - bHasOnlyNoCover;
        });
</script>

<h2>wished mangas<span>· {totalVolumes} tomes sur {seriesWithNext.length} séries</span></h2>
<div class="manga-list">
    {#each seriesWithNext as manga}
        <div class="manga">
            <h2>{manga.titre}</h2>
            {#each manga.editions as edition}
            {#if edition.next.length > 0}
            <div class="edition">
                <div class="edition-info">
                    <h3>{edition.titreEdition}</h3>
                    {#if edition.next.filter(volume => volume.releaseDate == null).length != 0}
                        <span class="volume-info possessed">{edition.next.filter(volume => volume.releaseDate == null).length} voulus</span>
                    {/if}
                    {#if edition.nombreVolumesEdition - edition.nombreVolumesParus > 0 || edition.nombreVolumesTotal - edition.nombreVolumesParus > 0}
                        <span class="volume-info">
                            {edition.nombreVolumesTotal - edition.nombreVolumesParus > 0 ? `${edition.nombreVolumesTotal - edition.nombreVolumesParus} annoncé${edition.nombreVolumesTotal - edition.nombreVolumesParus > 1 ? 's' : ''}` : ''}
                            {edition.nombreVolumesTotal - edition.nombreVolumesParus > 0 && edition.nombreVolumesEdition - edition.nombreVolumesParus ? ' · ' : '' }  <!-- Add a separator if both conditions are true -->
                            {edition.nombreVolumesEdition - edition.nombreVolumesParus > 0 ? `${edition.nombreVolumesEdition - edition.nombreVolumesParus} à paraître` : ''}
                        </span>
                    {/if}
                </div>
                <div class="possessions">
                    {#each edition.next as next}
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <div class="possession" class:torelease={next.releaseDate} class:nocover={next.noCover} releaseDate={next.releaseDate != null ? new Date(next.releaseDate).toLocaleDateString() : ''} role="button" tabindex="0" on:click={() => openModal(next, edition, manga)}>
                        <img src={next.coverLink} alt={`Cover of volume ${next.numeroTome}`} class="cover" />
                        <span>Tome {next.numeroTome}</span>
                    </div>
                    {/each}
                </div>
            </div>
            {/if}
            {/each}
        </div>
    {/each}
</div>

{#if showModal}
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="modal" on:click={closeModal}>
    <div class="modal-content" on:click|stopPropagation>
        <button class="close" on:click={closeModal} aria-label="Close modal">&times;</button>
        {#if !selectedVolume.noCover}
            <img src={selectedVolume.coverLink} alt={`Cover of volume ${selectedVolume.numeroTome}`} class="cover" />
        {/if}
        <h2>{selectedVolume.mangaTitle}</h2>
        <h3>{selectedVolume.editionTitle} · Tome {selectedVolume.numeroTome}</h3>
        {#if selectedVolume.releaseDate != null}
            <h3>releases on {new Date(selectedVolume.releaseDate).toLocaleDateString()}</h3>
        {/if}
        <p class="isbn">ISBN: {selectedVolume.isbn}</p>
        <div class="enseignes">
            <a href={"https://www.cultura.com/search/results?search_query=" + selectedVolume.isbn} target="_blank" style="--accent: #014886; --accentHover: #00396a; --accentText: var(--white)">
                <Cultura/>
            </a>
            <a href={"https://www.furet.com/rechercher/result?q=" + selectedVolume.isbn} target="_blank" style="--accent: #e30613; --accentHover: #b7040e; --accentText: var(--white)">
                <FuretDuNord/>
            </a>
            <a href={"https://www.fnac.com/SearchResult/ResultList.aspx?Search=" + selectedVolume.isbn} target="_blank" style="--accent: #e9aa00; --accentHover: #b78707; --accentText: var(--white)">
                <Fnac/>
            </a>
            <a href={"https://www.amazon.fr/s?k=" + selectedVolume.isbn} target="_blank">
                <Amazon/>
            </a>
        </div>
    </div>
</div>
{/if}

<UpdatedTime date={updatedAt} service="Mangacollec"/>

<noscript>
    <style>
        .possession:hover::after {
            content: none !important;
        }

        .possession {
            cursor: inherit !important;
        }
    </style>
</noscript>

<style>
    .modal {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 7;
    }

    .modal h2 {
        margin: 0;
        background: revert;
        border: revert;
        display: revert;
        position: revert;
    }

    .modal h3 {
        margin: 0;
        margin-top: .5em;
        font-weight: 500;
    }

    .modal-content {
        background-color: var(--background-2);
        padding: 20px;
        width: 300px;
        max-width: 95vw;
        border-radius: 13px;
        text-align: center;
        position: relative;
    }

    .close {
        all: unset;
        position: absolute;
        top: 0;
        right: 10px;
        font-size: 24px;
        cursor: pointer;
    }

    .possession {
        cursor: pointer;
        position: relative;
    }

    .possession:hover::after {
        content: '';
        background: var(--background-3);
        border-radius: 5px;
        position: absolute;
        top: 50%;
        left: 50%;
        height: 100%;
        width: 100%;
        z-index: -1;
        padding: 5px;
        transform: translate(-50%, -50%);
    }

    .enseignes {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(2, 1fr);
        grid-column-gap: 10px;
        grid-row-gap: 10px;
        height: 100px;
    }

    .enseignes a {
        background: var(--accent, var(--background-3));
        color: var(--accentText, var(--text));
        padding: 10px;
        border-radius: 7px;
        align-items: center;
        display: flex;
        justify-content: center;
        font-size: 1.3em;
    }

    .enseignes a:hover {
        background: var(--accentHover, var(--background-3-hover));
    }

    .isbn {
        font-size: 0.8em;
        /* font-family: var(--fonts-monospace); */
        font-weight: 400;
        letter-spacing: 8px;
        text-indent: 1em;
    }

    .torelease img {
        filter: grayscale(40%);
    }

    .torelease::before {
        content: attr(releaseDate);
        position: absolute;
        height: calc(100% - 1rem * 1.2 - 5px); /* 1rem * 1.2 is the height of the span, 5px is the gap */
        width: 100%;
        z-index: 1;
        color: var(--white);
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(2px);
        border-radius: 2px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2px;
        box-sizing: border-box;
    }

    @media screen and (max-width: 600px) {
        .torelease::before {
            font-size: .8em;
        }
    }

    .torelease.nocover img {
        border-radius: 3px;
    }

    .torelease.nocover::before {
        background: var(--background-3-hover);
        color: var(--text);
    }
</style>