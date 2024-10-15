import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import glsl from "vite-plugin-glsl";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    glsl(),
    react(),
    VitePWA({
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "Grab Rescue",
        short_name: "Grab Rescue",
        theme_color: "#ffffff",
        scope: "/",
        start_url: "/",
        orientation: "portrait",
        icons: [
          {
            src: "/pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
            purpose: "favicon",
          },
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "favicon",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "favicon",
          },
          {
            src: "/apple-touch-icon-180x180.png",
            sizes: "180x180",
            type: "image/png",
            purpose: "apple touch icon",
          },
          {
            src: "/maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  assetsInclude: ["**/*.gltf", "**/*.glb"],
});
