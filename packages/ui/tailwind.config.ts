import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [sharedConfig],
};

export default config;
