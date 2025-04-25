import tsconfigPaths from "vite-tsconfig-paths";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: [...(configDefaults.coverage.exclude ?? []), "drizzle.config.*"],
    },
    setupFiles: ["./vitest.setup.ts"],
  },
});
