import { browser } from '$app/environment';
import '$lib/i18n';
import { waitLocale } from 'svelte-i18n';

export const load = async () => {
    console.log('%cdaiku, by apix - https://github.com/apix0n', 'background:rgb(196, 144, 66); color: black; font-size: large; font-weight: bold; padding: 2px 6px; border-radius: 3px;');

    // Wait for translations to load
    await waitLocale();
};