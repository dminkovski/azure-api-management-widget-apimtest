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
  resolve: {
    alias: {
      "@widget-tools":
        "./src/tools",
    },
  },
  base: "",
  server: {
    port: 3000,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: "./index.html",
        editor: "./editor.html",
      },
    },
  },
  publicDir: "static",
}))
