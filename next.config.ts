import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  reactStrictMode: true,

  // Allow cross-domain requests from sandbox proxy (Z.ai preview panel)
  allowedDevOrigins: ["*"],
};

export default nextConfig;