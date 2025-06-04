 // vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  root: ".", // project root holds index.html
  resolve: {
    alias: {
      "@": path.resolve(__dirname) // "@/..." → project root
    }
  },
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: "index.html"
    }
  }
});

