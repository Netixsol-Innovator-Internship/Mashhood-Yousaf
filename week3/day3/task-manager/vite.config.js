import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173, // Use port 5174 consistently
    strictPort: true, // Don't try other ports if 5174 is in use
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
