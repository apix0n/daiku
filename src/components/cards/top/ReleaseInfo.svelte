<script>
    export let timestamp, number, mediaType;
    import { _ } from "svelte-i18n"
    import RelativeRelease from "./RelativeRelease.svelte";

    export let catchUp = false;
</script>

<div class="informations top" class:toCatchUp={catchUp}>
    <span class="next-episode" title={(new Date(timestamp)).toLocaleString()}>
        <RelativeRelease timestamp={timestamp} number={number} mediaType={mediaType}/>
    </span>
</div>