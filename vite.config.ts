import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  pack: {
    entry: "src/cli.ts",
    outDir: "dist",
    format: ["esm"],
    platform: "node",
    dts: false,
  },
});
