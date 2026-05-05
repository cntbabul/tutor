import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.parallelism = 2;
    }
    return config;
  },
};

export default nextConfig;
