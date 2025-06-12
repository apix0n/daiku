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
		border-radius: var(--border-radius) 0 0 var(--border-radius);
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
			padding-bottom: 1em;
			border-radius: 0 0 var(--border-radius) var(--border-radius);
			margin-left: env(safe-area-inset-left);
			margin-right: env(safe-area-inset-right);
		}
	}

	:global {
		h2 {
			position: sticky;
			top: 0;
			z-index: 4;
			display: flex;
			justify-content: center;
			gap: 0 0.3em;
			flex-wrap: wrap;
			align-items: center;
			margin-left: auto;
			margin-right: auto;
			gap: 0 .3em;
			width: fit-content;
			box-sizing: border-box;
			min-width: 100%;
			max-width: 100%;
			background-color: var(--background-2);
			padding: 0 .8em;
			border-radius: 5em;
			font-size: 1.3rem;
			text-align: center;
			&:first-of-type {
				margin-top: 0;
				&::before {
					content: '';
					position: absolute;
					top: 0;
					left: 0;
					background-color: var(--background-2);
					z-index: -1;
					border-radius: 0 0 50% 50%;
					width: 100%;
					height: 100%;
				}
			}
			@media screen and (max-width: 1000px) {
				top: 0;
				width: 100%;
				padding: 0;
				&:first-of-type {
					margin-top: 0;
				}
			}
			@media screen and (max-height: 600px) {
				position: revert;
			}
		}

		h2 span {
			font-size: .8em;
			font-weight: 400;
			color: var(--app-accent);
		}
	}
</style>
