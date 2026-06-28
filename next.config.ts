import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  reactStrictMode: true,
  output: process.env.GITHUB_PAGES === "true" ? "export" : undefined,
  basePath: process.env.GITHUB_PAGES === "true" ? "/tdv-wiki" : undefined,
  images: { unoptimized: true },

  // Allow cross-domain requests from sandbox proxy (Z.ai preview panel)
  allowedDevOrigins: ["*"],
};

export default nextConfig;