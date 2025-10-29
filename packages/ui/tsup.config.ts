import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "better-auth"],
  treeshake: true,
  minify: false,
  splitting: false,
  bundle: true,
});
