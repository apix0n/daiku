<script>
    import UpdatedTime from "./UpdatedTime.svelte";

    export let updateTime;
</script>

<div>
    <h1>no entries found in this category</h1>
    <UpdatedTime margin=0 date={updateTime} prefix="last"/>
</div>

<style>
    div {
        height: calc(100dvh - 16px); /* room for margin */
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        text-align: center;
    }

    h1 {
        margin-top: -1em;
        margin-bottom: .5rem;
    }

    @media screen and (max-width: 1000px) {
        div {
            height: calc(100dvh - (76px + 16px + env(safe-area-inset-bottom))); /* To make space for the navbar on mobile */
        }

        h1 {
            margin-top: unset;
        }
    }
</style>