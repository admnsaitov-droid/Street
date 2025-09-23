import createNextIntlPlugin from 'next-intl/plugin';

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
  },
  compiler: {
    styledComponents: true,
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Headers for better caching
  async headers() {
    return [
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/models/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/textures/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/cesium/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*)\\.(js|css|woff|woff2|ttf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*)\\.(png|jpg|jpeg|gif|svg|ico|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
    ];
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
