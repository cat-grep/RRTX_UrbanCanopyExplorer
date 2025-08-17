import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/RRTX_UrbanCanopyExplorer/",
  plugins: [react()],
  server: { open: true },
  build: { outDir: "dist" },
});