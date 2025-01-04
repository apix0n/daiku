<script>
    import UpdatedTime from '../../../components/UpdatedTime.svelte';

    export let data
    const { collection, updatedAt } = data.mangaCollection;
    
    // Calculer le nombre total de volumes possédés
    $: totalVolumes = collection.reduce((total, manga) => {
        return total + manga.editions.reduce((editionTotal, edition) => {
            return editionTotal + edition.possessions.length;
        }, 0);
    }, 0);

    // Calculer le nombre de séries avec des possessions
    $: seriesWithPossessions = collection.filter(manga => 
        manga.editions.some(edition => edition.possessions.length > 0)
    );
</script>

<h2>collection<span>· {totalVolumes} tomes sur {seriesWithPossessions.length} séries</span></h2>
<div class="manga-list">
    {#each seriesWithPossessions as manga}
        <div class="manga">
            <h2>{manga.titre}</h2>
            {#each manga.editions as edition}
            {#if edition.possessions.length > 0}
            <div class="edition">
                <div class="edition-info">
                    <h3>{edition.titreEdition}</h3>
                    <span class="volume-info possessed">{edition.possessions.length}/{edition.nombreVolumesParus}</span>
                    {#if edition.possessions.length == edition.nombreVolumesTotal}
                        <span class="volume-info possessed">collection terminée</span>
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
                    {#each edition.possessions as possession}
                    <div class="possession">
                        <img src={possession.coverLink} alt={`Cover of volume ${possession.numeroTome}`} class="cover" />
                        <span>Tome {possession.numeroTome}</span>
                    </div>
                    {/each}
                </div>
            </div>
            {/if}
        {/each}
        </div>
    {/each}
</div>

<UpdatedTime date={updatedAt} service="Mangacollec"/>
