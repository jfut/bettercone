import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
  },
  format: ["cjs", "esm"],
  dts: {
    resolve: true,
    compilerOptions: {
      skipLibCheck: true,
      strict: false,
      noImplicitAny: false,
      strictNullChecks: false,
      strictFunctionTypes: false,
      strictPropertyInitialization: false,
    },
  },
  sourcemap: true,
  clean: true,
  external: [
    "react", 
    "react-dom", 
    "better-auth",
  ],
  noExternal: [
    // Bundle all internal imports
    /.*/
  ],
  treeshake: true,
  minify: false,
  splitting: false,
  bundle: true,
  tsconfig: "./tsconfig.json",
  esbuildOptions(options) {
    // Help esbuild find relative imports
    options.resolveExtensions = ['.tsx', '.ts', '.jsx', '.js', '.json'];
  },
});
