// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  // Tell Vite that the "root" (where index.html lives) is the project root.
  root: ".", 

  // In case you’re using absolute imports (@"…" + jsconfig.json),
  // adjust alias to point to the root folder or "src" if you have one
  resolve: {
    alias: {
      "@": path.resolve(__dirname) // If "@/something" → project‐root/something
      // Or if you do have a src/ folder, use path.resolve(__dirname, "src")
    }
  },
  plugins: [react()],
  build: {
    // Tell Vite where to output the final files.
    outDir: "dist",
    rollupOptions: {
      input: "index.html", // Keep index.html at root
      output: {
        // You can customize chunking if desired:
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        }
      }
    }
  }
});
 
