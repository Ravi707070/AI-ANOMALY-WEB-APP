import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, "."),  // Set root to project folder
  build: {
    outDir: "dist",
  },
});
