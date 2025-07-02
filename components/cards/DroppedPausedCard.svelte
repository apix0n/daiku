<script lang="ts">
	import BaseCard from "./BaseCard.svelte";
	import type { MediaElement } from "$lib/types/media";

	export let destination: string;
	import { _ } from "svelte-i18n";
	export let dropped: MediaElement[];
</script>

{#if dropped.length > 0}
	<a class="dropped-section-link" href={destination}>
		<BaseCard background="">
			<div class="dropped-info">
				{#if dropped.filter((entry) => entry.status === "paused").length > 0}
					<span>
						{$_("paused")}
						<i>
							· {dropped.filter(
								(entry) => entry.status === "paused",
							).length}
						</i>
					</span>
				{/if}
				{#if dropped.filter((entry) => entry.status === "dropped").length > 0}
					<span>
						{$_("dropped")}
						<i>
							· {dropped.filter(
								(entry) => entry.status === "dropped",
							).length}
						</i>
					</span>
				{/if}
			</div>
		</BaseCard>
	</a>
{/if}

<style>
	.dropped-section-link :global(.element) {
		--accentColor: var(--app-accent);
		background-image: unset;
		background: var(--background-2);
		color: var(--text);
		&:hover {
			scale: unset;
			background: var(--background-2);
		}
	}

	.dropped-info {
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	i {
		color: var(--app-accent);
		font-style: normal;
	}
</style>
