import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // React Compiler is intentionally OFF. It requires a Babel pass on every
  // file, which makes Turbopack dev builds much heavier (high CPU / heat) for
  // negligible benefit at this size. To re-enable only for production builds:
  //   reactCompiler: process.env.NODE_ENV === "production",
};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(nextConfig);
