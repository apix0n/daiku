<script>
    export let progress, type, mediaType

    const dict = {
        dropped: null,
        paused: null
    }

    if (mediaType === "anime") {
        dict.dropped = "droppedEpN",
        dict.paused = "pausedEpN"
    } else if (mediaType === "manga") {
        dict.dropped = "droppedChapN",
        dict.paused = "pausedChapN"
    }

    let typeKey;
    if (type === "DROPPED") {
        typeKey = dict.dropped 
    } else if (type === "PAUSED") {
        typeKey = dict.paused
    }

    import { _ } from "svelte-i18n";
</script>

<div class="more">
    <span class="episodes-info">{$_(typeKey, { values: { n: progress }})}</span>
</div>