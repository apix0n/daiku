import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from "@vite-pwa/sveltekit"
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			devOptions: {
				enabled: true
			}
		})
	],
	preview: {
		allowedHosts: true,
	},
	server: {
		port: parseInt(process.env.PORT || '5173')
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					overrides: ['./src/lib/overrides/data.js']
				}
			}
		}
	}
});