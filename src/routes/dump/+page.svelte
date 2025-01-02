<script>
    export let data

    function createFile(dataName, fileName) {
        var blob = new Blob([JSON.stringify(data[dataName], null, 2)], { type: 'application/json' });
        var file = new File([blob], fileName, {type: "application/json"});
        var blobUrl = URL.createObjectURL(file);

        // Create a temporary link element
        var link = document.getElementById('download');
        link.href = blobUrl
        link.download = "";
        link.click(); // Simulate a click on the link to initiate the download
        URL.revokeObjectURL(blobUrl);
    }
</script>

<svelte:head>
    <title>data dump</title>
</svelte:head>

<a id="download" download="" aria-label=" "></a>

<h2>recent activity <button type="button" on:click={() => createFile("animeData", "anime.json")}>down</button></h2>

<pre>{JSON.stringify(data.recentActivity, null, 2)}</pre>

<h2>anime data <button type="button" on:click={() => createFile("animeData", "anime.json")}>down</button></h2>

<pre>{JSON.stringify(data.animeData, null, 2)}</pre>

<h2>manga data <button type="button" on:click={() => createFile("mangaData", "manga.json")}>down</button></h2>

<pre>{JSON.stringify(data.mangaData, null, 2)}</pre>

<h2>planning data <button type="button" on:click={() => createFile("plannedData", "planned.json")}>down</button></h2>

<pre>{JSON.stringify(data.plannedData, null, 2)}</pre>

<h2>manga collection <button type="button" on:click={() => createFile("mangaCollection", "mangaCollection.json")}>down</button></h2>

<pre>{JSON.stringify(data.mangaCollection, null, 2)}</pre>

<h2>movies <button type="button" on:click={() => createFile("watchedMovies", "movies.json")}>down</button></h2>

<pre>{JSON.stringify(data.watchedMovies, null, 2)}</pre>