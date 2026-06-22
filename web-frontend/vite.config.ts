import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    build: {
        rolldownOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                fam: resolve(__dirname, 'fam.html')
            }
        }
    }
})
