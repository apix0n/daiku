<script>
    import RecentActivity from '../../components/RecentActivity.svelte';
    import Stats from '../../components/Stats.svelte';
    import WatchTime from '../../components/WatchTime.svelte';
    export let data;

    import { totalVolumes, seriesWithPossessions } from '$lib/mangacollec/calculations';
	import { _ } from 'svelte-i18n';
</script>

<svelte:head>
    <title>daiku</title>
</svelte:head>

<div class="container">
    <div class="header">
        <h1>{$_('home')}</h1>
    </div>
    
    <div class="links">
        <a href="/anime">{$_("mainTitles.anime")} <span>{$_('watchingNumber', { values: { n: data.animeData.current.length } })}</span></a>
        <a href="/manga">{$_("mainTitles.manga")} <span>{$_('readingNumber', { values: { n: data.mangaData.current.length } })}</span></a>
        <a href="/movies">{$_("mainTitles.movies")} <span>{$_('watchedNumber', { values: { n: data.watchedMovies.watched.length } })}</span></a>
        <a href="/planning">{$_("mainTitles.planned")}</a>
        <a href="/collection">{$_("mainTitles.mangaCollection")} <span>{$_('volumesCount', { values: { n: totalVolumes(data.mangaCollection.collection) } })} · {$_('seriesCount', { values: { n: seriesWithPossessions(data.mangaCollection.collection).length } })}</span></a>
    </div>
    
        <RecentActivity data={data} />
        <Stats data={data} />
        <WatchTime data={data}/>
</div>

<style>
    .container {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        grid-template-rows: 1fr .5fr 5fr;
        grid-column-gap: 15px;
        grid-row-gap: 15px; 
        flex-direction: column;
        padding: 0 max(env(safe-area-inset-left), 10px);
    }

.header { grid-area: 1 / 1 / 2 / 7; } 

.links {
    display: flex;
    grid-area: 2 / 1 / 3 / 7;
    gap: 15px;
    text-align: center;
    flex-wrap: wrap;
}

.links > a {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background: var(--background-2);
    border: 1px solid var(--background-3);
    border-radius: 17px;
    font-size: 2em;
    flex-grow: 1;
    padding: 5px 10px;
}

.links > a:hover {
    background: var(--background-3);
    border: 1px solid var(--background-3-hover);
}

.links > a > span {
    font-weight: 500;
    font-size: 1rem;
    color: var(--text-3);
}

.div7 { grid-area: 3 / 1 / 4 / 7; } 

@media screen and (max-width: 900px) {
    .container {
        display: flex;
    }

    .links {
        gap: 10px;
    }
}
</style>