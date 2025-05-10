<script>
    export let timestamp, number, mediaType;
    import { _, locale as localeStore } from "svelte-i18n"
    import { get } from "svelte/store";

    const locale = get(localeStore)

    import RelativeRelease from "./RelativeRelease.svelte";
    import InformationsTop from "./InformationsTop.svelte";

    export let catchUp;
</script>

<InformationsTop {catchUp}>
    <span class="next-episode" title={(new Date(timestamp)).toLocaleString(locale)}>
        <RelativeRelease timestamp={timestamp} number={number} mediaType={mediaType}/>
    </span>
</InformationsTop>