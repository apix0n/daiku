<script lang="ts">
	let { children } = $props();
	import { page } from '$app/state';
	import Navbar from '../../components/Navbar.svelte';
	import Footer from '../../components/Footer.svelte';
</script>

<svelte:head>
	<title>{[...page.url.pathname.split("/").slice(1)].filter(Boolean).join(" - ")} | daiku</title>
</svelte:head>

<div class="container">
	<Navbar/>
	{@render children()}
	<Footer></Footer>
</div>

<noscript>
	<style>
		.checkboxdiv {
			display: none;
		}
	</style>
</noscript>