import tsconfigPaths from "vite-tsconfig-paths";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    coverage: {
      exclude: [...(configDefaults.coverage.exclude ?? []), "drizzle.config.*"],
      reporter: ["text", "json", "html"],
    },
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
  },
});
