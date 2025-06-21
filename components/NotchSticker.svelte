<script lang="ts">
    import { onMount } from "svelte";

    // edited version of NotchSticker.svelte from cobalt (https://github.com/imputnet/cobalt)
    // thanks for their incredible work
    // https://github.com/imputnet/cobalt/blob/main/web/src/components/misc/NotchSticker.svelte

    let safeAreaTopContainer: HTMLElement;
    let safeAreaBottomContainer: HTMLElement;

    $: safeAreaTop = 0;
    $: safeAreaBottom = 0;
    $: state = "hidden"; // "notch", "island", "notch x"

    const islandValues = [
        53, // 16 pro max: larger text
        59, // regular & plus: default
        48, // regular: larger text
        49, // 16: larger text
        51, // plus only: larger text
        62, // 16: regular
    ];

    const xNotch = [44];

    const getSafeAreaTop = () => {
        return getComputedStyle(safeAreaTopContainer)
            .getPropertyValue("height")
            .trim();
    };

    const getSafeAreaBottom = () => {
        return getComputedStyle(safeAreaBottomContainer)
            .getPropertyValue("height")
            .trim();
    };

    onMount(() => {
        safeAreaTop = Number(getSafeAreaTop().replace("px", ""));
        safeAreaBottom = Number(getSafeAreaBottom().replace("px", ""));
    });

    $: if (safeAreaTop > 20) {
        state = "notch";
        if (islandValues.includes(safeAreaTop)) {
            state = "island";
        }
        if (xNotch.includes(safeAreaTop)) {
            state = "notch x";
        }
        // exception for XR and 11 at regular screen zoom
        if (safeAreaTop === 48 && safeAreaBottom === 34) {
            state = "notch";
        }

        // exception for iPhone 16 Pro Max
        if (safeAreaTop === 53 && safeAreaBottom === 29) {
            state = "notch sixteen-pro-max";
        }
    }
</script>

{#if state !== "hidden"}
    <div id="notch-sticker" aria-hidden="true" class={state}>
        <svg width="236" height="70" viewBox="0 0 236 70" xmlns="http://www.w3.org/2000/svg">
            <path id="bg" d="M 200.5,0 H 35 C 15.67,0 0,15.67 0,35 0,54.33 15.67,70 35,70 h 165.5 c 19.33,0 35,-15.67 35,-35 0,-19.33 -15.67,-35 -35,-35 z" fill="#000000" />
            <path id="text" d="M 164.311,28.272 V 48 h -3.276 v -2.916 c -0.624,1.008 -1.5,1.8 -2.628,2.376 -1.104,0.552 -2.328,0.828 -3.672,0.828 -1.536,0 -2.916,-0.312 -4.14,-0.936 -1.224,-0.648 -2.196,-1.608 -2.916,-2.88 -0.696,-1.272 -1.044,-2.82 -1.044,-4.644 V 28.272 h 3.24 v 11.124 c 0,1.944 0.492,3.444 1.476,4.5 0.984,1.032 2.328,1.548 4.032,1.548 1.752,0 3.132,-0.54 4.14,-1.62 1.008,-1.08 1.512,-2.652 1.512,-4.716 V 28.272 Z M 139.304,48 131.564,39.288 V 48 h -3.276 V 21.36 h 3.276 v 15.66 l 7.596,-8.748 h 4.572 l -9.288,9.828 9.324,9.9 z M 121.12,25.068 c -0.624,0 -1.152,-0.216 -1.584,-0.648 -0.432,-0.432 -0.648,-0.96 -0.648,-1.584 0,-0.624 0.216,-1.152 0.648,-1.584 0.432,-0.432 0.96,-0.648 1.584,-0.648 0.6,0 1.104,0.216 1.512,0.648 0.432,0.432 0.648,0.96 0.648,1.584 0,0.624 -0.216,1.152 -0.648,1.584 -0.408,0.432 -0.912,0.648 -1.512,0.648 z m 1.584,3.204 V 48 h -3.276 V 28.272 Z m -28.8279,9.792 c 0,-2.016 0.408,-3.78 1.224,-5.292 0.816,-1.536 1.932,-2.724 3.348,-3.564 1.44,-0.84 3.0359,-1.26 4.7879,-1.26 1.728,0 3.228,0.372 4.5,1.116 1.272,0.744 2.22,1.68 2.844,2.808 v -3.6 h 3.312 V 48 h -3.312 v -3.672 c -0.648,1.152 -1.62,2.112 -2.916,2.88 -1.272,0.744 -2.76,1.116 -4.464,1.116 -1.752,0 -3.3359,-0.432 -4.7519,-1.296 -1.416,-0.864 -2.532,-2.076 -3.348,-3.636 -0.816,-1.56 -1.224,-3.336 -1.224,-5.328 z M 110.58,38.1 c 0,-1.488 -0.3,-2.784 -0.9,-3.888 -0.6,-1.104 -1.416,-1.944 -2.448,-2.52 -1.008,-0.6 -2.124,-0.9 -3.348,-0.9 -1.224,0 -2.34,0.288 -3.348,0.864 -1.0079,0.576 -1.8119,1.416 -2.4119,2.52 -0.6,1.104 -0.9,2.4 -0.9,3.888 0,1.512 0.3,2.832 0.9,3.96 0.6,1.104 1.404,1.956 2.4119,2.556 1.008,0.576 2.124,0.864 3.348,0.864 1.224,0 2.34,-0.288 3.348,-0.864 1.032,-0.6 1.848,-1.452 2.448,-2.556 0.6,-1.128 0.9,-2.436 0.9,-3.924 z M 69.548,38.064 c 0,-2.016 0.408,-3.78 1.224,-5.292 0.816,-1.536 1.932,-2.724 3.348,-3.564 1.44,-0.84 3.048,-1.26 4.824,-1.26 1.536,0 2.964,0.36 4.284,1.08 1.32,0.696 2.328,1.62 3.024,2.772 V 21.36 h 3.312 V 48 h -3.312 v -3.708 c -0.648,1.176 -1.608,2.148 -2.88,2.916 -1.272,0.744 -2.76,1.116 -4.464,1.116 -1.752,0 -3.348,-0.432 -4.788,-1.296 -1.416,-0.864 -2.532,-2.076 -3.348,-3.636 -0.816,-1.56 -1.224,-3.336 -1.224,-5.328 z M 86.252,38.1 c 0,-1.488 -0.3,-2.784 -0.9,-3.888 -0.6,-1.104 -1.416,-1.944 -2.448,-2.52 -1.008,-0.6 -2.124,-0.9 -3.348,-0.9 -1.224,0 -2.34,0.288 -3.348,0.864 -1.008,0.576 -1.812,1.416 -2.412,2.52 -0.6,1.104 -0.9,2.4 -0.9,3.888 0,1.512 0.3,2.832 0.9,3.96 0.6,1.104 1.404,1.956 2.412,2.556 1.008,0.576 2.124,0.864 3.348,0.864 1.224,0 2.34,-0.288 3.348,-0.864 1.032,-0.6 1.848,-1.452 2.448,-2.556 0.6,-1.128 0.9,-2.436 0.9,-3.924 z" style="fill:#ffffff" />
         </svg>
    </div>
{/if}

<div class="safe-area-probe">
    <div class="top" bind:this={safeAreaTopContainer}></div>
    <div class="bottom" bind:this={safeAreaBottomContainer}></div>
</div>

<style>
    .safe-area-probe {
        display: none;
        .top {
            height: env(safe-area-inset-top);
        }
        .bottom {
            height: env(safe-area-inset-bottom);
        }
    }

    #notch-sticker {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        width: 100%;
        z-index: 999;
    }

    #notch-sticker.island {
        padding-top: 15px;
    }

    #notch-sticker.notch {
        padding-top: 2px;
    }

    #notch-sticker.sixteen-pro-max {
        padding-top: 12px;
    }

    #notch-sticker.notch.x :global(svg) {
        height: 28px;
    }

    #notch-sticker :global(svg) {
        width: 100px;
        height: 30px;
    }

    /* regular iphone size, larger text display mode */
    @media screen and (max-width: 350px) {
        #notch-sticker.notch :global(svg) {
            height: 24px;
        }

        #notch-sticker.island {
            padding-top: 9px;
        }
    }

    /* regular & plus iphone size, dynamic island, larger text display mode */
    @media screen and (max-width: 375px) {
        #notch-sticker.island :global(svg) {
            height: 26px;
        }

        #notch-sticker.island {
            padding-top: 11px;
        }
    }

    @media screen and (orientation: landscape) {
        #notch-sticker {
            display: none;
        }
    }

    #bg {
        fill: var(--background-2)        
    }
</style>
