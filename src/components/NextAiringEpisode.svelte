<script>
    import { getRelativeTime } from "$lib/getRelativeTime";
    export let airingAt;
    export let nextAiringEpisode;

    let airingAtDate = getRelativeTime(new Date(airingAt * 1000));
    if (airingAtDate === "today") {
        airingAtDate = `today at ${new Date(airingAt * 1000).toLocaleTimeString([], { timeStyle: 'short' })}`
    }
</script>

<span class="next-episode" title={new Date(airingAt * 1000).toLocaleString()}>episode {nextAiringEpisode} {airingAtDate}</span>

<style>
    .next-episode {
        width: 100%;
        text-align: center;
        text-shadow: 0 0 5px var(--black);
        overflow: unset;
        font-size: .8em;
    }
</style>