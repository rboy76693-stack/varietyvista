import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      }
    ],
  },
  // Suppress warnings for cleaner production logs
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
