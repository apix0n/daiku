<script>
    let cssHexAccentOpacity = "80"
    export let accent, background, status, ova;
    export let visible = false;
</script>

<div class="element" 
    style:background-image="url({background})" 
    style="{accent ? `--tAccentColor: ${accent + cssHexAccentOpacity}; --accentColor: ${accent}` : ''}"
    class:releasing={status === "RELEASING"}
    class:ova={ova}
    class:visible={ova && visible}
    >
    <slot />
</div>