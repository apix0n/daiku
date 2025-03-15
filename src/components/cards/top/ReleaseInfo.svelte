<script>
    export let timestamp, number, mediaType;
    import { _, locale as localeStore } from "svelte-i18n"
    import { get } from "svelte/store";

    const locale = get(localeStore)

    import RelativeRelease from "./RelativeRelease.svelte";

    export let catchUp = false;
</script>

<div class="informations top" class:toCatchUp={catchUp}>
    <span class="next-episode" title={(new Date(timestamp * 1000)).toLocaleString(locale)}>
        <RelativeRelease timestamp={timestamp} number={number} mediaType={mediaType}/>
    </span>
</div>