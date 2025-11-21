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
    "react/jsx-runtime",
    "@radix-ui/react-accordion",
    "@radix-ui/react-alert-dialog",
    "@radix-ui/react-avatar",
    "@radix-ui/react-checkbox",
    "@radix-ui/react-dialog",
    "@radix-ui/react-dropdown-menu",
    "@radix-ui/react-label",
    "@radix-ui/react-popover",
    "@radix-ui/react-progress",
    "@radix-ui/react-radio-group",
    "@radix-ui/react-scroll-area",
    "@radix-ui/react-select",
    "@radix-ui/react-separator",
    "@radix-ui/react-slot",
    "@radix-ui/react-switch",
    "@radix-ui/react-tabs",
    "@radix-ui/react-tooltip",
    "lucide-react",
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
    "tailwindcss",
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
