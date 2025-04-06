<script>
    import Rewatch from "../../icons/Rewatch.svelte";

    export let title, rewatch;
</script>

<div class="informations">
    <div class="upper">
        <span class="media-title">
            {title}
            {#if rewatch}
                <Rewatch />
            {/if}
        </span>
    </div>
    <slot />
</div>

<style>
    .informations {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 0.5em;
        padding-top: 2em;
        gap: 0.4em;
        background: linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.8) 0%,
            rgba(0, 0, 0, 0.4) 65%,
            rgba(0, 0, 0, 0) 100%
        );
        border-radius: 0 0 var(--border-radius) var(--border-radius);
        flex: none;
        align-self: stretch;
        flex-grow: 0;
        box-sizing: border-box;
        max-height: 100%;
        overflow: hidden;
    }

    .media-title {
        font-weight: 600;
        font-size: 1.3em;
        text-align: center;
        line-height: 120%;
        overflow-wrap: anywhere;
        text-shadow: 0 0 10px var(--black);
    }

    @media screen and (max-width: 1200px) {
        .media-title {
            font-size: 1.2em;
        }
    }
</style>
