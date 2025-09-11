import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.nasa.gov',
        port: '',
        pathname: '/sites/default/files/**',
      },
      {
        protocol: 'https',
        hostname: 'eol.jsc.nasa.gov',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // Strict mode for better performance
  reactStrictMode: true,
};

export default nextConfig;
