import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from "@vite-pwa/sveltekit"
import { defineConfig, searchForWorkspaceRoot } from 'vite';

export default defineConfig({
    plugins: [
        sveltekit(),
        SvelteKitPWA({
            registerType: 'autoUpdate',
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