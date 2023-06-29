import {defineConfig} from "vite"
import react from "@vitejs/plugin-react"
import { wrapWidget } from "./sdk/dev/vite-plugin-widget-loader"

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [
    react(),
    wrapWidget({
      width: "300px",
      height: "300px",
      developerPortalUrl: "https://lester-apim.developer.azure-api.net/",
      portalStyles: true
    }),
  ],
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
  publicDir: "static"
}))
