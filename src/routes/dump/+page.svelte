<script>
    export let data
</script>

<svelte:head>
    <title>data dump</title>
</svelte:head>

<pre>{JSON.stringify(data, null, 2)}</pre>