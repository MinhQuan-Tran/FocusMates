import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true // Disable ESLint during the build process
  },
  typescript: {
    ignoreBuildErrors: true // Disable TypeScript errors during the build process
  },
  reactStrictMode: false // Disable React strict mode
};

export default nextConfig;
