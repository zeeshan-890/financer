import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: '../server/public',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
