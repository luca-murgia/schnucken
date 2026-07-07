import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // React Compiler is intentionally OFF. It requires a Babel pass on every
  // file, which makes Turbopack dev builds much heavier (high CPU / heat) for
  // negligible benefit at this size. To re-enable only for production builds:
  //   reactCompiler: process.env.NODE_ENV === "production",
  experimental: {
    // Admin uploads are submitted to server actions as base64 data URLs, so
    // allow a larger request body than the 1 MB default (still safely bounded —
    // see MAX_IMAGE_CHARS / MAX_DOWNLOAD_CHARS). Menu download files may be up to
    // ~6 MB, which is ~8 MB once base64-encoded, plus the action envelope.
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(nextConfig);
