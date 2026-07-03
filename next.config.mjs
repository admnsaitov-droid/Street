import createNextIntlPlugin from 'next-intl/plugin';
import redirectsList from './src/redirects.mjs';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    // Enable server components optimizations
    serverComponentsExternalPackages: ['axios'],
  },
  compiler: {
    styledComponents: true,
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  // Enable static optimization
  output: 'standalone',
  // Optimize bundle
  swcMinify: true,

  async redirects() {
    return redirectsList;
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '1337',
        pathname: '/**', // Allow all paths
      },
      {
        protocol: 'http',
        hostname: '153.92.1.45',
        port: '1337',
        pathname: '/**', // Allow all paths
      },
      {
        protocol: 'https',
        hostname: '153.92.1.45',
        port: '1337',
        pathname: '/**', // Allow all paths
      },
      // Dynamic hostname from environment variable with error handling
      ...(process.env.NEXT_PUBLIC_IMAGE_URL ? [{
        protocol: new URL(process.env.NEXT_PUBLIC_IMAGE_URL).protocol.slice(0, -1),
        hostname: new URL(process.env.NEXT_PUBLIC_IMAGE_URL).hostname,
        port: new URL(process.env.NEXT_PUBLIC_IMAGE_URL).port || undefined,
        pathname: '/**', // Allow all paths
      }] : []),
      // Add explicit HTTPS support for production
      {
        protocol: 'https',
        hostname: '153.92.1.45',
        port: '1337',
        pathname: '/**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
