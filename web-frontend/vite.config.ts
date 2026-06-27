import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    build: {
        rolldownOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                fam: resolve(__dirname, 'fam.html')
            }
        }
    },
    plugins: [
        react(),
        tailwindcss()
    ]
})
