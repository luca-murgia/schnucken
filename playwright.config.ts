import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    // Dedicated port so tests never latch onto another dev server on :3000.
    baseURL: "http://localhost:3199",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // Production build => pre-compiled, deterministic routes. `next dev`
    // compiles on demand and flakes under Playwright's parallel load.
    command: "npm run build && npm run start -- -p 3199",
    url: "http://localhost:3199/de",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
