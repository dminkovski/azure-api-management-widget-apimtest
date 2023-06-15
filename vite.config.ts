import {defineConfig} from "vite"
import react from "@vitejs/plugin-react"
import {wrapWidget} from "./src/vite-plugins"

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [
    react(),
    wrapWidget({
      width: "300px",
      height: "300px",
    }),
  ],
  base: "",
  server: {
    port: 3000,
    //open: "https://apimreacttesting.developer.azure-api.net/?MS_APIM_CW_localhost_port=3000",
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: "./index.html",
        wrapper: "./wrapper.html",
        editor: "./editor.html",
        iframe1: "./iframe1.html",
        iframe2: "./iframe2.html",
      },
    },
  },
  publicDir: "static",
}))
