<script lang="ts">
	import { page } from "$app/state";
	import { version } from "$app/environment";
	import { haptic } from "$lib/client/haptics";

	import { _ } from "svelte-i18n";

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
	import SettingsIcon from "./icons/Settings.svelte";

	// check if the link is active (to highlight it) and if it is, set it as lastPage for / redirect

	function isActive(href: string, saveInStorage = true) {
		const active = page.url.pathname === href;
		if (active && saveInStorage) {
			localStorage.setItem("lastPage", href);
		}
		return active;
	}

	const handleClick = () => {
		haptic();
	};

	import Settings from "$components/Settings.svelte";

	let settingsOpen = false;

	function scrollActive(node: HTMLElement) {
    // Scroll on mount
    setTimeout(() => {
        const active = node.querySelector(".isActive");
        if (active) {
            const rect = active.getBoundingClientRect();
            const parentRect = node.getBoundingClientRect();
            const dx = Math.abs(rect.left - parentRect.left - (parentRect.width / 2 - rect.width / 2));
            if (dx > 50) {
                active.scrollIntoView({
                    block: "nearest",
                    inline: "center",
                });
            }
        }
    }, 0);

    // observe for class changes (so route changes)
    const observer = new MutationObserver(() => {
        const active = node.querySelector(".isActive");
        const settings = node.querySelector(".settingsActive");
        if (active && !settings) {
            const rect = active.getBoundingClientRect();
            const parentRect = node.getBoundingClientRect();
            const dx = Math.abs(rect.left - parentRect.left - (parentRect.width / 2 - rect.width / 2));
            if (dx > 50) {
                active.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center",
                });
            }
        }
    });
    observer.observe(node, {
        subtree: true,
        attributes: true,
        attributeFilter: ["class"],
    });

    return {
        destroy() {
            observer.disconnect();
        },
    };
}
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
	<div class="navbtns" use:scrollActive>
		<div>daiku</div>
		<a
			href="/anime"
			onclick={handleClick}
			class:isActive={isActive("/anime")}
			><Anime />{$_("navigation.anime")}</a
		>
		<a
			href="/anime/dropped"
			onclick={handleClick}
			class="hidden-button"
			class:isActive={isActive("/anime/dropped", false)}
			><PausedAnime />{$_("navigation.paused")}</a
		>
		<a
			href="/manga"
			onclick={handleClick}
			class:isActive={isActive("/manga")}
			><Book />{$_("navigation.manga")}</a
		>
		<a
			href="/manga/dropped"
			onclick={handleClick}
			class="hidden-button"
			class:isActive={isActive("/manga/dropped", false)}
			><PausedBook />{$_("navigation.paused")}</a
		>
		<a
			href="/books"
			onclick={handleClick}
			class:isActive={isActive("/books")}
			><Shelf />{$_("navigation.library")}</a
		>
		<a
			href="/books/next"
			onclick={handleClick}
			class:isActive={isActive("/books/next")}
			><ShelfSparkle />{$_("navigation.wished")}</a
		>
		<a
			href="/movies"
			onclick={handleClick}
			class:isActive={isActive("/movies")}
			><Movie />{$_("navigation.movies")}</a
		>
		<a
			href="/planning"
			onclick={handleClick}
			class:isActive={isActive("/planning")}
			><CalendarClock />{$_("navigation.planned")}</a
		>
		<a
			href="/planning/season"
			onclick={handleClick}
			class:isActive={isActive("/planning/season")}
			><CalendarClock />{$_("navigation.season")}</a
		>
		<!-- svelte-ignore a11y_missing_attribute -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<a
			onclick={() => {
				settingsOpen = !settingsOpen;
				handleClick();
			}}
			class:settingsActive={settingsOpen}
			><SettingsIcon />{$_("navigation.settings")}</a
		>
	</div>
</nav>

<Settings open={settingsOpen} onClose={() => (settingsOpen = false)} />

<style>
	nav {
		width: calc(var(--navbar-width) - env(safe-area-inset-left));
		background: var(--background-2);
		margin-left: env(safe-area-inset-left);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		flex: 0 0 auto;
		padding: 0 4px;
		position: relative;
		text-align: center;
		overflow-y: auto;
		z-index: 7;

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
		height: 100%;

		@media screen and (max-width: 1000px) {
			flex-direction: row;
			gap: 8px;
			width: 100%;
			padding: 2px 0.5em;
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

	.navbtns > a,
	.navbtns > div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 4px 0;
		width: 100%;
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
		user-drag: none; /* Non-standard but supported */
		pointer-events: auto; /* Ensure normal clicks still work */
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
			aspect-ratio: 12 / 9;
		}
		&:last-child {
			margin-top: auto;
			margin-bottom: 4px;
		}
	}

	.navbtns a {
		cursor: pointer;
	}

	:global .navbtns > a > svg {
		height: unset;
		width: 35%;
	}

	@media (hover: hover) {
		.navbtns > a:not(.isActive):hover {
			background: var(--background-3-hover);
			color: var(--text-2);
		}
	}

	.navbtns > a:active {
		transform: scale(0.95);
	}

	.navbtns > a:active::after {
		all: unset;
	}

	a.isActive {
		background: var(--app-accent);
		color: var(--app-accent-contrast);
	}

	a.hidden-button {
		display: none;
	}

	a.hidden-button.isActive {
		display: inherit;
		background: var(--background-3-hover);
		color: var(--app-accent);
	}

	.settingsActive {
		background: var(--background-3-hover) !important;
		color: var(--text-2) !important;
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
