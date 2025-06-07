<script lang="ts">
    import type { MediaTitles } from "$lib/types/media";
    import { locale } from "svelte-i18n";
    import { get } from "svelte/store";

    $: localeValue = get(locale);

    export let titles: MediaTitles;

    $: title = titles.english || titles.romaji || titles.native;
</script>

{title}