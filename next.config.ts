import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  reactStrictMode: true,

  // Fix Turbopack workspace root inference in Z.ai sandbox
  ...(process.env.NODE_ENV !== "production" && {
    turbopack: {
      root: "/home/z/my-project",
    },
    allowedDevOrigins: ["*"],
  }),
};

export default nextConfig;