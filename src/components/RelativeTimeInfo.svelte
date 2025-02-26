<script>
    import { getRelativeTime } from "$lib/getRelativeTime";
    export let timestamp;
    export let number;
    export let mediaType;

    let timestampDate = getRelativeTime(new Date(timestamp * 1000));
    if (timestampDate === "today" && timestamp > Date.now() / 1000) {
        timestampDate = `today at ${new Date(timestamp * 1000).toLocaleTimeString([], { timeStyle: 'short' })}`
    } else if (timestampDate === "today" && timestamp < Date.now() / 1000) {
        timestampDate = `${getRelativeTime(new Date(timestamp * 1000), 'hour')}`
    }
</script>

<span class="next-episode" title={new Date(timestamp * 1000).toLocaleString()}>{mediaType} {number} {timestampDate}</span>