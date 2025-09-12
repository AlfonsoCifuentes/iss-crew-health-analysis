import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization - Vercel compatible
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
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Ensure static images are properly handled in Vercel
    unoptimized: false,
    loader: 'default'
  },
  
  // Strict mode for better performance
  reactStrictMode: true,
  
  // Performance optimizations for Speed Insights
  compress: true,
  poweredByHeader: false,
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'recharts', '@vercel/speed-insights', '@vercel/analytics', 'chart.js', 'react-chartjs-2'],
  },
  
  // Turbopack configuration  
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  // Output optimization - commented out for Vercel deployment
  // output: 'standalone',
  
  // Headers for better caching and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      },
      {
        source: '/data/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=43200'
          }
        ]
      }
    ]
  },
}

export default nextConfig;
