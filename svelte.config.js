import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import * as child_process from 'node:child_process';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
		version: { // get commit number from git, if in dev mode returns 'dev'
			name: process.env.NODE_ENV === 'development' ? 'dev' : child_process.execSync('git rev-parse HEAD').toString().trim().slice(0, 7),
		},
		env: {
			publicPrefix: "DAIKU_"
		}
	}
};

export default config;
