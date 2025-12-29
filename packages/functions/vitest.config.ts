import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.{spec,test}.{ts,tsx,js}"],
    setupFiles: ["./dotenv-config.js"],
  },
});
