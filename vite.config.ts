import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from "@vite-pwa/sveltekit"
import { defineConfig, searchForWorkspaceRoot } from 'vite';

export default defineConfig({
    plugins: [
        sveltekit(),
        SvelteKitPWA({
            registerType: 'autoUpdate',
            manifest: false,
            workbox: {
                globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,webmanifest,woff2}', 'prerendered/**/*.{html,json}'],
                navigateFallbackDenylist: [/^\/api\//],
            }
        })
    ],
    preview: {
        allowedHosts: true,
    },
    server: {
        port: parseInt(process.env.PORT || '5173'),
        allowedHosts: true,
        fs: {
            allow: [searchForWorkspaceRoot(process.cwd())]
        }
    }
});