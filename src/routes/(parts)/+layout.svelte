<script lang="ts">
	import { page } from "$app/state";
	import Navbar from "$components/Navbar.svelte";
	import Footer from "$components/Footer.svelte";

	let containerElem: HTMLElement;

	import { afterNavigate } from "$app/navigation";
  	afterNavigate(() => {
  	  containerElem.scrollTo({ top: 0, behavior: 'auto' });
  	});
</script>

<svelte:head>
	<title>
		{[...page.url.pathname.split("/").slice(1)]
			.filter(Boolean)
			.join(" - ")} | daiku</title
	>
</svelte:head>

<div class="layout">
	<Navbar />
	<div class="container" data-section="parts" bind:this={containerElem}>
		<slot></slot>
		<Footer />
	</div>
</div>

<style>
	.layout {
		display: flex;
		flex-direction: row;
		height: 100vh;
		height: 100dvh;
		background-color: var(--background-2);
		@media screen and (max-width: 1000px) {
			flex-direction: column;
		}
	}

	.container {
		background-color: var(--background);
		border-radius: 16px 0 0 16px;
		overflow-y: auto;
		overflow-x: hidden;
		flex-grow: 1;
		--padding: 5vw;
		padding: 0 var(--padding);
		padding-right: calc(var(--navbar-width) + var(--padding));
		@media screen and (max-width: 1400px) {
			--padding: 2.5vw;
		}
		@media screen and (max-width: 1000px) {
			--padding: 0;
		}
	}

	:global {
		h2 {
			background: var(--background-2);
			position: sticky;
			top: 0;
			z-index: 5;
			margin-left: -100%;
			margin-right: -100%;
			border-bottom: solid 1px var(--background-3);
			border-top: solid 1px var(--background-3);
			align-items: center;
			display: flex;
			justify-content: center;
			gap: 0 0.3em;
			flex-wrap: wrap;
			@media screen and (max-height: 600px) {
				position: static;
			}
		}

		h2:first-of-type {
			margin-top: 0;
		}

		h2 span {
			font-size: 1rem;
			font-weight: 400;
			color: var(--app-accent);
			position: relative;
			top: 0.1em;
		}
	}
</style>
