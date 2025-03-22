<script>
    import { page } from '$app/state';
</script>

<svelte:head>
    <title>error {page.status} | daiku</title>
</svelte:head>

<div id="error">
    <div>
        <h1>{page.status}</h1>
        <span>{page.error.message}</span>
    </div>
    <span>there seems to have been an error.</span>
    <a href="/">back to daiku</a>
</div>

<style>
    #error {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        height: fit-content;
        min-height: 100dvh;
        width: 100vw;
        gap: 20px;
    }

    @supports not (height: 100dvh) {
        #error {
            height: 100vh;
        }
    }

    h1 {
        margin: 0;
        font-family: var(--fonts-monospace);
        font-size: 5em;
    }

    span {
        font-size: 1.5em;
    }

    #error div {
        display: flex;
        flex-direction: column;
        background: var(--background-3);
        padding: 10px 20px;
        border-radius: 8px;
    }

    a {
        padding: 5px 30px;
        background: var(--app-accent);
        color: var(--app-accent-contrast);
        font-size: 1.25em;
        border-radius: 0.5em;
    }

    a:hover {
        opacity: .9;
    }
</style>