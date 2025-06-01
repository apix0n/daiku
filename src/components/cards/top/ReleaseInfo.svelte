<script lang="ts">
    import type { MediaType, SingleEpisodeInfo } from "$lib/types/media";
    export let episode: SingleEpisodeInfo, mediaType: typeof MediaType[number];
    import { _, locale as localeStore } from "svelte-i18n"
    import { get } from "svelte/store";

    const locale = get(localeStore) ?? "en"

    import RelativeRelease from "./RelativeRelease.svelte";
    import InformationsTop from "./InformationsTop.svelte";

    export let catchUp: boolean = false;

    console.log("ReleaseInfo", episode, mediaType, catchUp);
</script>

<InformationsTop {catchUp}>
    <span class="next-episode" title={(new Date(episode.timestamp)).toLocaleString(locale)}>
        <RelativeRelease timestamp={episode.timestamp} number={episode.number} mediaType={mediaType}/>
    </span>
</InformationsTop>