import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        ignores: ['src/wasm/**/*']
    },
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], 
        plugins: {
            js,
            'react': reactPlugin,
            'react-hooks': {
                rules: reactHooks.rules,
            },
        },
        extends: ["js/recommended"], 
        languageOptions: { 
            globals: globals.browser 
        }, 
        rules: {
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn'
        } 
    },
    tseslint.configs.recommended,
    reactPlugin.configs.flat.recommended,
]);
