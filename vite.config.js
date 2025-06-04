 // vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  // ------------------------------------------------------
  // Tell Vite: “The project root (.) contains index.html
  // so don’t look inside a `src/` folder for entry points.”
  // ------------------------------------------------------
  root: ".",

  // ------------------------------------------------------
  // If you use absolute imports like `@/components/Foo`,
  // this alias makes "@/..." point to the project root.
  // If you prefer "@/some/path" → "<repo-root>/some/path".
  // ------------------------------------------------------
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."), // “@” → repo root
    },
  },

  // ------------------------------------------------------
  // Enable React support (JSX, fast refresh, etc.).
  // ------------------------------------------------------
  plugins: [react()],

  build: {
    // ----------------------------------------------------
    // Output folder when building (the “dist” directory).
    // ----------------------------------------------------
    outDir: "dist",

    // ----------------------------------------------------
    // Explicitly tell Rollup that “index.html” at the root
    // is your input file. Vite will then read index.html
    // and look for <script type="module" src="/main.jsx">
    // ----------------------------------------------------
    rollupOptions: {
      input: "index.html",
    },
  },
});
