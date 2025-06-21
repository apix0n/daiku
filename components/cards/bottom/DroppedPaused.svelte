<script lang="ts">
    import { MediaType, UserMediaStatus } from "$lib/types/media";
    export let progress: number, type: typeof UserMediaStatus[number], mediaType: typeof MediaType[number];

    const dict = {
        dropped: '',
        paused: '',
    }

    if (mediaType === "anime") {
        dict.dropped = "droppedEpN",
        dict.paused = "pausedEpN"
    } else if (mediaType === "manga") {
        dict.dropped = "droppedChapN",
        dict.paused = "pausedChapN"
    }

    let typeKey: string;
    if (type === "dropped") {
        typeKey = dict.dropped 
    } else if (type === "paused") {
        typeKey = dict.paused
    }

    import { _ } from "svelte-i18n";
</script>

<div class="more">
    <span class="episodes-info">{$_(typeKey, { values: { n: progress }})}</span>
</div>