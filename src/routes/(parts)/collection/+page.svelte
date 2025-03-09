<script>
    import UpdatedTime from '../../../components/UpdatedTime.svelte';
    import { seriesWithPossessions, totalVolumes } from '$lib/mangacollec/calculations';

    export let data
    const { collection, updatedAt } = data.mangaCollection;
    
    // Calculer le nombre total de volumes possédés
    $: nbTotalVolumes = totalVolumes(collection);

    // Calculer le nombre de séries avec des possessions
    $: nbSeriesWithPossessions = seriesWithPossessions(collection);
</script>

<h2>collection<span>· {nbTotalVolumes} tomes sur {nbSeriesWithPossessions.length} séries</span></h2>
<div class="manga-list">
    {#each nbSeriesWithPossessions as manga}
        <div class="manga">
            <h2>{manga.titre}{#if manga.typeLivre}<span class="series-info">{manga.typeLivre}</span>{/if}</h2>
            {#each manga.editions as edition}
            {#if edition.possessions.length > 0}
            <div class="edition">
                <div class="edition-info">
                    <h3>{edition.titreEdition}{#if edition.typeLivre}<span class="series-info">{edition.typeLivre}</span>{/if}</h3>
                    <span class="volume-info possessed">{edition.possessions.length}/{edition.nombreVolumesParus}</span>
                    {#if edition.possessions.length == edition.nombreVolumesTotal}
                        <span class="volume-info possessed">collection terminée</span>
                    {/if}
                    {#if edition.nombreVolumesEdition - edition.nombreVolumesParus > 0 || edition.nombreVolumesTotal - edition.nombreVolumesParus > 0 && edition.title === "Edition simple"}
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
                        <span>{possession.titre}</span>
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