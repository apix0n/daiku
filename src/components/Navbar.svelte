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

	// Fonction pour vérifier si le lien est actif
	const isActive = (href) => page.url.pathname === href;
</script>

<svelte:head>
	<style>
		:root {
			--navbar-width: calc(76px + env(safe-area-inset-left));
		}
	</style>
</svelte:head>

<nav class="nav">
	<div class="navbtns">
		daiku
		<!-- <a href="/" aria-label="Back to dashboard"><Back/></a> -->
		<!-- <span class="sep"></span> -->
		<a
			href="/anime"
			class:isActive={isActive("/anime")}
			aria-label="Currently watching & watched anime"><Anime /> anime</a
		>
		<a
			href="/anime/dropped"
			class:isActive={isActive("/anime/dropped")}
			aria-label="Dropped & paused anime"><PausedAnime /></a
		>
		<a
			href="/manga"
			class:isActive={isActive("/manga")}
			aria-label="Currently reading & read manga"><Book /> manga</a
		>
		<a
			href="/manga/dropped"
			class:isActive={isActive("/manga/dropped")}
			aria-label="Dropped & paused manga"><PausedBook /></a
		>
		<a
			href="/collection"
			class:isActive={isActive("/collection")}
			aria-label="Manga collection"><Shelf /> library</a
		>
		<a
			href="/collection/next"
			class:isActive={isActive("/collection/next")}
			aria-label="Wished manga to complete the collection"
			><ShelfSparkle /> wished</a
		>
		<a
			href="/movies"
			class:isActive={isActive("/movies")}
			aria-label="Last 50 watched movies"><Movie /> movies</a
		>
		<a
			href="/planning"
			class:isActive={isActive("/planning")}
			aria-label="To-watch & to-read lists"><CalendarClock /> planned</a
		>
		<a
			href="/planning/notreleased"
			class:isActive={isActive("/planning/notreleased")}
			aria-label="To-watch & to-read lists"><CalendarClock /> season</a
		>
	</div>
</nav>

<style>
	nav {
		width: var(--navbar-width);
		height: 100vh;
		height: 100dvh;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		flex: 0 0 auto;
		padding: 0 4px;
		background: var(--background-2);
		border-left: none;
		position: relative;
		box-sizing: border-box;
		text-align: center;
		@media screen and (max-width: 1000px) {
			width: 100%;
			height: var(--navbar-width);
			padding-bottom: env(safe-area-inset-bottom);
			border-radius: 0;
			border: none;
			border-top-left-radius: 12px;
			border-top-right-radius: 12px;
			margin-left: 0;
			margin-right: 0;
			order: 2;
		}
		&::before {
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
	}

	.navbtns {
		display: flex;
		flex-direction: column;
		gap: 11px;
	}

	.navbtns > a {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 4px 0;
		width: 100%;
		box-sizing: border-box;
		background: var(--background-3);
		border-radius: 14px;
		position: relative;
		color: var(--text-3);
		aspect-ratio: 1;
	}

	:global .navbtns > a > svg {
		height: unset;
		width: 50%;
	}

	.navbtns > a:hover::after {
		content: attr(aria-label);
		position: absolute;
		left: 100%;
		background: var(--background-2);
		box-shadow: inset 0 0 0 1px var(--background-3);
		border-radius: 5px;
		padding: 2px 8px;
		margin-left: 4px;
		width: max-content;
		max-width: 10em;
		color: var(--text);
		z-index: 6;
	}

	.sep {
		width: 100%;
		height: 1px;
		background: var(--text-3);
	}

	.navbtns > a:hover,
	.navbtns > a:active {
		background: var(--background-3-hover);
		color: var(--text-2);
	}

	.navbtns > a:first-of-type {
		--background-3-hover: var(--app-accent-dark);
		--text-2: var(--app-accent-dark-contrast);
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
		box-shadow: inset 0 0 0 1px var(--background-3);
	}

	@media screen and (max-width: 1000px) {
		.navbtns {
			flex-direction: row;
			height: 100%;
			width: 100%;
			overflow-x: auto;
		}

		.navbtns > a:hover::after {
			content: none;
		}

		.sep {
			width: 1px;
			height: auto;
		}
	}
</style>
