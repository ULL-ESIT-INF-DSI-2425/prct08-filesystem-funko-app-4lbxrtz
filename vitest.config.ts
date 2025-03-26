import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      include: ["src/**/*"],
      exclude: ["docs/**/*"], // Exclude unwanted files if needed
    },
  },
});
