<script>
	import Rewatch from "../../icons/Rewatch.svelte"

    export let title, link, rewatch;
</script>

<div class="informations">
    <div class="upper">
        <a class="media-title" href="{link}" target="_blank">
            {title}
            {#if rewatch}
                <Rewatch />
            {/if}
        </a>
    </div>
    <slot />
</div>