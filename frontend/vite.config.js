/* eslint-disable no-undef */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// https://vite.dev/config/
export default defineConfig({
    build: {
        chunkSizeWarningLimit: 1600,
    },
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
