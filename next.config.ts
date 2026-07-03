import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // React Compiler is intentionally OFF. It requires a Babel pass on every
  // file, which makes Turbopack dev builds much heavier (high CPU / heat) for
  // negligible benefit at this size. To re-enable only for production builds:
  //   reactCompiler: process.env.NODE_ENV === "production",
  experimental: {
    // Admin event images are downscaled client-side and submitted to the
    // saveEvent server action as a data URL, so allow a larger request body
    // than the 1 MB default (still safely bounded — see MAX_IMAGE_CHARS).
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(nextConfig);
