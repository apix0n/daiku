<!-- loading animation: updated version of https://github.com/scosman/sveltekit-navigation-loader -->

<script lang="ts">
  import { navigating } from "$app/state"
  import { expoOut } from "svelte/easing"
  import { slide } from "svelte/transition"

  import { onMount } from 'svelte';

  import { locale, locales } from "svelte-i18n";
  import { defaultLocale } from "$lib/i18n";
  import { get } from "svelte/store";

  let currentLocale = get(locale) || "en";
  currentLocale = currentLocale.length > 2 ? currentLocale.slice(0, 2) : currentLocale;
  let allLocales = get(locales);

  if (!allLocales.includes(currentLocale)) {
    locale.set(defaultLocale);
  }

  onMount(() => {
    document.getElementsByClassName('loader-container')[0]?.classList.add("hidden");
  });
</script>

{#if navigating.to}
  <!-- 
    Loading animation for next page since svelte doesn't show any indicator. 
     - delay 70ms because most page loads are instant, and we don't want to flash 
     - long 12s duration because we don't actually know how long it will take
     - exponential easing so fast loads (>100ms and <1s) still see enough progress,
       while slow networks see it moving for a full 12 seconds
  -->
  <div class="navigation-loader" in:slide={{ delay: 70, duration: 12000, axis: "x", easing: expoOut }}></div>
{/if}
<slot />

<style>
  .navigation-loader {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    height: 4px;
    z-index: 10;
    background-color: var(--app-accent);
  }
</style>