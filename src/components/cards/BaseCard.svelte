<script>
    let cssHexAccentOpacity = "80";
    export let accent, background, status, ova;
    export let visible = false;
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
    class="element"
    style:background-image="url({background})"
    style={accent
        ? `--tAccentColor: ${accent + cssHexAccentOpacity}; --accentColor: ${accent}`
        : ""}
    class:releasing={status === "RELEASING" || status === "NOT_YET_RELEASED"}
    class:notyet={status === "NOT_YET_RELEASED"}
    class:ova
    class:visible={ova && visible}
    on:click
>
    <slot />
</div>

<style>
    .element {
        --element-width: 200px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        width: var(--element-width);
        height: calc(var(--element-width) * 1.5);
        border-radius: var(--border-radius);
        background-size: cover;
        position: relative;
        background-position: 50%;
        outline: 2px solid var(--background-2);
        color: var(--white);
        cursor: pointer;
        transition: all 0.1s ease-in-out;
        &:hover {
            scale: 1.04;
            outline-color: var(--accentColor, var(--background-4));
            z-index: 3;
        }
    }

    @media screen and (max-width: 1200px) {
        .element {
            font-size: 15px;
            --element-width: 170px;
        }
    }

    @media screen and (max-width: 768px), 
    (max-height: 600px) and (orientation: landscape) {
        .element {
            font-size: 14px;
            --element-width: 150px;
        }
    }
    .element.ova {
        display: none;
        outline: 2px var(--accentColor, var(--background-4)) solid;
    }

    .element.ova.visible {
        display: flex;
    }

    :global .element ::selection {
        background: var(--tAccentColor, rgba(168, 168, 168, 0.5));
    }
</style>
