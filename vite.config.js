import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/RRTX_UrbanCanopyExplorer/",   // <-- move here (top-level)
  plugins: [react()],
  server: { open: true },
  build: { outDir: "dist" },
});