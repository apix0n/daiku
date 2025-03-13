<script>
    import { page } from '$app/state';
	import { dev } from '$app/environment';
    import { version } from '$app/environment';

	// Import des icônes
	import Anime from './icons/Anime.svelte';
	import Back from './icons/Back.svelte';
	import Shelf from './icons/Shelf.svelte';
	import CalendarClock from './icons/CalendarClock.svelte';
	import Movie from './icons/Movie.svelte';
    import Book from './icons/Book.svelte';
	import PausedAnime from './icons/PausedAnime.svelte';
	import Document from './icons/Document.svelte';
    import PausedBook from './icons/PausedBook.svelte';
    import ShelfSparkle from './icons/ShelfSparkle.svelte';

    // Fonction pour vérifier si le lien est actif
    const isActive = (href) => page.url.pathname === href;
</script>

<nav class="nav">
	<div class="navbtns">
		<a href="/" aria-label="Back to dashboard"><Back/></a>
		<span class="sep"></span>
		<a href="/combined" class:isActive={isActive('/combined')} aria-label="Watched anime & movies"><Anime/></a>
		<a href="/anime" class:isActive={isActive('/anime')} aria-label="Currently watching & watched anime"><Anime/></a>
		<a href="/anime/dropped" class:isActive={isActive('/anime/dropped')} aria-label="Dropped & paused anime"><PausedAnime/></a>
		<a href="/manga" class:isActive={isActive('/manga')} aria-label="Currently reading & read manga"><Book/></a>
		<a href="/manga/dropped" class:isActive={isActive('/manga/dropped')} aria-label="Dropped & paused manga"><PausedBook/></a>
		<a href="/collection" class:isActive={isActive('/collection')} aria-label="Manga collection"><Shelf/></a>
		<a href="/collection/test" class:isActive={isActive('/collection/test')} aria-label="Manga collection"><Shelf/></a>
		<a href="/collection/next" class:isActive={isActive('/collection/next')} aria-label="Wished manga to complete the collection"><ShelfSparkle/></a>
		<a href="/movies" class:isActive={isActive('/movies')} aria-label="Last 100 watched movies"><Movie/></a>
		<a href="/planning" class:isActive={isActive('/planning')} aria-label="To-watch & to-read lists"><CalendarClock/></a>
	</div>
	{#if (dev)}
	<div class="navbtns">
		<a href="/dump" class:isActive={isActive('/dump')} aria-label="Display all loaded data"><Document/></a>
	</div>
	{/if}
</nav>

<style>
	nav {
		position: fixed;
		top: 0;
		left: 0;
		width: calc(76px + env(safe-area-inset-left));
		height: 100dvh;

		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 9px;

		background: var(--background-2);
		border: 1px solid var(--background-3);
		border-left: none;
		border-radius: 0 12px 12px 0;

		box-sizing: border-box;
		z-index: 6;
		gap: 22px;
		align-items: end;
		
		/* overflow-y: auto; */
		overflow-x: visible;
	}

	@supports not (height: 100dvh) {
	  	nav {
	  	  height: 100vh;
	  	}
	}

	.navbtns {
		display: flex;
		flex-direction: column;
		gap: 11px;
	}

	.navbtns > a {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 7px;
		gap: 10px;
		width: 44px;
		height: 44px;
		background: var(--background-3);
		border-radius: 16px;
		position: relative;
		color: var(--text-3);
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
		--text-2: var(--white);
	}
	
	.navbtns > a:active {
		transform: scale(0.95);
	}

	.navbtns > a:active::after {
		all: unset;
	}

	.isActive {
		background: var(--app-accent) !important;
		color: var(--white) !important;
		box-shadow: inset 0 0 0 1px var(--background-3);
	}

	@media screen and (max-width: 1000px) {
		nav {
			height: calc(76px + env(safe-area-inset-bottom));
			width: calc(100% - env(safe-area-inset-left) - env(safe-area-inset-right));
			top: unset;
			bottom: 0;
			right: 0;
			flex-direction: row;
			border-radius: 12px 12px 0 0;
			border: 1px solid var(--background-3);
			border-bottom: none;
			margin-left: env(safe-area-inset-left);
			margin-right: env(safe-area-inset-right);

			align-items: start;
			padding-left: 9px;
			padding-bottom: 10px;
			/* margin-bottom: env(safe-area-inset-bottom); */

			overflow-y: hidden;
			/* overflow-x: auto; */
		}

		.navbtns {
			flex-direction: row;
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
