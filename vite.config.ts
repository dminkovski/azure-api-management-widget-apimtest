import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { wrapWidget } from "./sdk/dev/vite-plugin-widget-loader"
import { valuesDefault } from "./src/values"

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [
    react(),
    //this plugin provides local viewing and debugging
    //for your custom widget.  It has no effect on build or deployment
    wrapWidget(
      //WidgetWrapperOptions
      {
        developerPortalUrl: "https://lester-apim.developer.azure-api.net/",
        startPage: '/',
        impersonateUserId: "1", 
        portalStyles: true
      },
      //any values the widget needs to function or scenarios you want to test
      valuesDefault
    ),
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
