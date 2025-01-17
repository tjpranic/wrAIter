import { sveltekit }     from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { defineConfig }  from 'vitest/config';

export default defineConfig(
    {
        plugins: [sveltekit( ), svelteTesting( )],
        test: {
            include: ['tests/unit/**/*.{test,spec}.{js,ts}']
        },
        server: {
            host: '0.0.0.0',
            port: 8080,
            open: true
        },
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler' // or "modern"
                }
            }
        }
    }
);
