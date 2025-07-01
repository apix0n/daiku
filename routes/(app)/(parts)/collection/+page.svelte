<script lang="ts">
	import UpdatedTime from "$components/UpdatedTime.svelte";
	import { totalVolumes } from "$lib/client/mangacollec/calculations.js";
	import type { BookGroup } from "$lib/types/media.js";
	import { _ } from "svelte-i18n";
	import BookGroupDisplay from "./BookGroup.svelte";

	export let data;
	const { list, updatedAt } = data.mangaCollection;

	const copiedList = JSON.parse(JSON.stringify(list)) as BookGroup[];

	copiedList.sort((a, b) => {
		// Sort by the first book's title in each group
		const titleA = a.title?.toLowerCase() || "";
		const titleB = b.title?.toLowerCase() || "";
		return titleA.localeCompare(titleB);
	});

	// Calculate the total number of volumes
	$: totalVolumeCount = totalVolumes(list);
</script>

<h2>
	{$_("navigation.library")}<span
		>· {$_("Nvolumes", { values: { n: totalVolumeCount } })}
		| {$_("Nseries", { values: { n: list.length } })}
	</span>
</h2>
<div class="bookshelf">
	{#each copiedList as bookGroup}
		<BookGroupDisplay {bookGroup} />
	{/each}
</div>

<UpdatedTime info={updatedAt} />

<style>
	@media screen and (max-width: 1000px) {
		.bookshelf {
			width: 100%;
			height: 100%;
			padding: 0 10px;
			box-sizing: border-box;
		}
	}
</style>
