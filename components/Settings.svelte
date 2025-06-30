<!-- src/lib/components/SettingsPopup.svelte -->
<script lang="ts">
    import { settings } from "$lib/client/stores/settings";
    import LanguagePicker from "./LanguagePicker.svelte";
    import { _ } from "svelte-i18n";

    export let open = false;
    export let onClose: () => void = () => {};
</script>

{#if open}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div id="settingsBackdrop" class="backdrop" on:click={onClose}></div>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div id="settings" class="modal" on:click|stopPropagation>
        <label>
            {$_("settings.language")}
            <LanguagePicker />
        </label>

        <label>
            {$_("settings.title")}
            <select bind:value={$settings.titleLanguage}>
                <option value="locale">Locale</option>
                <option value="english">English</option>
                <option value="romaji">Romaji</option>
                <option value="native">Native</option>
            </select>
        </label>

        <label>
            {$_("settings.theme")}
            <select bind:value={$settings.theme}>
                <option value="">daiku</option>
                <option value="Letterboxd">Letterboxd</option>
                <option value="AniList">AniList</option>
            </select>
        </label>

        <label>
            <input type="checkbox" bind:checked={$settings.showSpecials} />
            {$_("settings.specials")}
        </label>

        <label>
            <input type="checkbox" bind:checked={$settings.showNotchSticker} />
            {$_("settings.notchSticker")}
        </label>
    </div>
{/if}

<style>
    .backdrop {
        position: fixed;
        inset: 0;
        z-index: 6;
        width: calc(100% - var(--navbar-width) - 8px);
        left: calc(var(--navbar-width) + 8px);
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(1px);
        border-radius: var(--border-radius) 0 0 var(--border-radius);
        @media screen and (max-width: 1000px) {
            border-radius: 0 0 var(--border-radius) var(--border-radius);
            width: revert;
            height: calc(
                100% - var(--navbar-width) - env(safe-area-inset-bottom)
            );
            left: 0;
        }
    }

    .modal {
        position: fixed;
        bottom: 0;
        left: calc(var(--navbar-width) + 8px);
        margin: 1em;
        background: var(--background-2);
        padding: 1rem;
        border-radius: var(--border-radius);
        z-index: 7;
        box-sizing: border-box;
        width: 400px;
        @media screen and (max-width: 1000px) {
            & {
                width: calc(
                    100% - 2em - env(safe-area-inset-left) -
                        env(safe-area-inset-right)
                );
                left: 50%;
                transform: translateX(-50%);
                margin: 0;
                bottom: calc(
                    var(--navbar-width) + env(safe-area-inset-bottom) + 1em
                );
            }
        }
    }

    label {
        display: block;
        margin: 0.5rem 0;
    }
</style>
