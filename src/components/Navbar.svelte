<script>
	import { page } from "$app/state";
	import { version } from "$app/environment";

	// Import des icônes
	import Anime from "./icons/Anime.svelte";
	import Back from "./icons/Back.svelte";
	import Shelf from "./icons/Shelf.svelte";
	import CalendarClock from "./icons/CalendarClock.svelte";
	import Movie from "./icons/Movie.svelte";
	import Book from "./icons/Book.svelte";
	import PausedAnime from "./icons/PausedAnime.svelte";
	import Document from "./icons/Document.svelte";
	import PausedBook from "./icons/PausedBook.svelte";
	import ShelfSparkle from "./icons/ShelfSparkle.svelte";

	// check if the link is active (to highlight it) and if it is, set it as lastPage for / redirect
	const isActive = (href) => {
		const active = page.url.pathname === href;
		if (active) {
			localStorage.setItem('lastPage', href);
		}
		return active;
	};
</script>

<svelte:head>
	<style>
		:root {
			--navbar-width: calc(68px + env(safe-area-inset-left));
		}

		@media screen and (max-width: 1000px) {
			:root {
				--navbar-width: 52px;
			}
		}
	</style>
</svelte:head>

<nav class="nav">
	<div class="navbtns">
		<div>daiku</div>
		<a href="/anime" class:isActive={isActive("/anime")}><Anime /> anime</a>
		<a href="/anime/dropped" class:isActive={isActive("/anime/dropped")}
			><PausedAnime /> paused</a
		>
		<a href="/manga" class:isActive={isActive("/manga")}><Book /> manga</a>
		<a href="/manga/dropped" class:isActive={isActive("/manga/dropped")}
			><PausedBook />paused</a
		>
		<a href="/collection" class:isActive={isActive("/collection")}
			><Shelf /> library</a
		>
		<a href="/collection/next" class:isActive={isActive("/collection/next")}
			><ShelfSparkle /> wished</a
		>
		<a href="/movies" class:isActive={isActive("/movies")}
			><Movie /> movies</a
		>
		<a href="/planning" class:isActive={isActive("/planning")}
			><CalendarClock /> planned</a
		>
		<a
			href="/planning/notreleased"
			class:isActive={isActive("/planning/notreleased")}
			><CalendarClock /> season</a
		>
	</div>
</nav>

<style>
	nav {
		width: calc(var(--navbar-width) - env(safe-area-inset-left));
		margin-left: env(safe-area-inset-left);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		flex: 0 0 auto;
		padding: 0 4px;
		position: relative;
		text-align: center;
		overflow-y: auto;

		@media screen and (max-width: 1000px) {
			width: 100%;
			height: var(--navbar-width);
			padding: 0;
			margin-bottom: env(safe-area-inset-bottom);
			border-radius: 0;
			order: 2;
			overflow: hidden;
		}
	}

	.navbtns {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: 100%;

		@media screen and (max-width: 1000px) {
			flex-direction: row;
			gap: 8px;
			width: 100%;
			padding: 2px .5em;
			overflow-y: hidden;
			scroll-snap-type: x mandatory;
			scroll-padding-left: 0.5em;
			scroll-padding-right: 0.5em;
			-webkit-overflow-scrolling: touch;
			&::after {
				content: "";
				flex: 0 0 0.5em;
				pointer-events: none;
				scroll-snap-align: end;
			}
		}
	}

	.navbtns > a, .navbtns > div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 4px 0;
		width: 100%;
		aspect-ratio: 12 / 9;
		box-sizing: border-box;
		border-radius: 14px;
		position: relative;
		color: var(--text-3);
		line-height: 1.2em;
		overflow: hidden;
		-webkit-touch-callout: none; /* Disable iOS link preview */
		user-select: none; /* Prevent text selection */
		-moz-user-select: none;
		-webkit-user-drag: none;
		-webkit-user-select: none;
		touch-action: manipulation; /* Optimize for taps */
		user-drag: none;             /* Non-standard but supported */
		pointer-events: auto;        /* Ensure normal clicks still work */
		-webkit-tap-highlight-color: transparent; /* Disable highlight on tap */

		@media screen and (max-width: 1000px) {
			scroll-snap-align: start;
			flex: 0 0 auto;
			width: auto;
			aspect-ratio: 12 / 9;
			min-width: 72px;
			scroll-snap-align: center;
			&:first-child {
				display: none;
			}
		}
		&:first-child {
			margin-top: 0.5em;
		}
	}

	:global .navbtns > a > svg {
		height: unset;
		width: 35%;
	}

	.navbtns > a:hover,
	.navbtns > a:active {
		background: var(--background-3-hover);
		color: var(--text-2);
	}

	.navbtns > a:active {
		transform: scale(0.95);
	}

	.navbtns > a:active::after {
		all: unset;
	}

	.isActive {
		background: var(--app-accent) !important;
		color: var(--app-accent-contrast) !important;
		/* box-shadow: inset 0 0 0 1px var(--background-3); */
	}

	@media screen and (max-width: 1000px) {
		.navbtns {
			flex-direction: row;
			height: 100%;
			width: 100%;
			overflow-x: auto;
			scrollbar-width: none; /* Firefox */
			-ms-overflow-style: none; /* IE 10+ */
		}

		.navbtns > a {
			justify-content: center;
			align-items: center;
			padding: 0 4px;
			height: 100%;
		}

		.navbtns::-webkit-scrollbar {
			display: none; /* Chrome, Safari */
		}
	}
</style>
