<script>
    import RecentActivity from '../../components/RecentActivity.svelte';
    import Stats from '../../components/Stats.svelte';
    import WatchTime from '../../components/WatchTime.svelte';
    export let data;

    import { totalVolumes, seriesWithPossessions } from '$lib/mangacollec/calculations';
	import { _ } from 'svelte-i18n';
	import Continuing from '../../components/Continuing.svelte'
	import Favourites from '../../components/Favourites.svelte'
</script>

<svelte:head>
    <title>daiku</title>
</svelte:head>

<div class="container" data-section="dashboard">
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
    
    <div class="cards">
        <Favourites data={data} />
        <Continuing data={data}/>
        <Stats data={data} />
        <RecentActivity data={data} />
        <WatchTime data={data}/>
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        padding: 0 max(env(safe-area-inset-left), 10px);
        gap: 8px;
    }

    .cards {
        display: grid;
        grid-template-columns: 1.75fr 1.5fr 1fr 1.25fr;
        grid-template-rows: .5fr 1fr;
        grid-column-gap: 15px;
        grid-row-gap: 15px;
        max-height: 600px;
    }

.header { margin: 5em 0; } 

.links {
    display: flex;
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

@media screen and (max-width: 900px) {
    .header {
        margin: 0;
    }

    .cards {
        display: flex;
        flex-direction: column;
    }

    .links {
        gap: 10px;
    }
}
</style>