import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  transpilePackages: ["@zai/select-element"],
  // Allow cross-domain requests from sandbox proxy (Z.ai preview panel)
  allowedDevOrigins: ["*"],
};

export default nextConfig;
