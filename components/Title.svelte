<script lang="ts">
    import type { MediaTitles } from "$lib/types/media";
    import { settings } from "$lib/client/stores/settings";

    export let titles: MediaTitles;

    $: title =
        $settings.titleLanguage === "locale" ? titles.locale || titles.english || titles.romaji || titles.native :
        $settings.titleLanguage === "english" ? titles.english || titles.romaji || titles.native :
        $settings.titleLanguage === "romaji" ? titles.romaji || titles.english || titles.native :
        $settings.titleLanguage === "native" ? titles.native :
        titles.english || titles.romaji || titles.native;
</script>

{title}