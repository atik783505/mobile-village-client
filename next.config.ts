import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["@prisma/client", "prisma"],
  experimental: {
    agentFeedback: true,
  },

  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", 
      },
      {
        protocol: "http",
        hostname: "**", 
      },
    ],
  },
};

export default nextConfig;
