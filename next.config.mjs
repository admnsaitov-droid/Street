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
    // NOTE: axios must NOT be listed here. Externalising it makes it an ESM
    // external, which turns every module importing it into a webpack async
    // module. Client components in that graph (Header, Footer, Menu, the mega
    // menus) then become async client references, which Next 14.2's SSR flight
    // client cannot resolve — every page 500s with "Element type is invalid
    // ... got: undefined". See ADR-0106.
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
    // WebP only. AVIF was first in this list, so every modern browser got
    // AVIF — and sharp encodes AVIF 5–10x slower than WebP on this server
    // (measured on production: a 2752px reference photo took 10–22s cold as
    // AVIF vs ~0.9s as WebP, and the AVIF was not even smaller). Hostinger's
    // CDN does not cache /_next/image (x-hcdn-cache-status: DYNAMIC) and each
    // deploy starts with an empty optimiser cache, so that encode cost was
    // paid by real visitors. See ADR-0120.
    formats: ['image/webp'],
    // Strapi serves /uploads with `Cache-Control: max-age=300`, and Next
    // derives its optimised-image cache TTL from the upstream header. Without
    // this the optimiser re-fetched and re-encoded the originals every five
    // minutes — and the originals are large (the home hero poster alone is an
    // 8.1MB PNG), so every sixth minute of traffic paid full price again.
    // One day, not more: Strapi's "Replace media" keeps the same URL, and this
    // value is also the browser max-age of /_next/image, so a replaced image
    // stays stale for up to this long (ADR-0118). It was 30 days.
    minimumCacheTTL: 60 * 60 * 24,
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
      // Production Strapi host, explicitly — so images still load if
      // NEXT_PUBLIC_IMAGE_URL is missing at build time. No `port`: Next
      // compares it to `url.port`, which is '' for a default-port https URL,
      // so `port: '443'` made this pattern never match.
      {
        protocol: 'https',
        hostname: 'admin.streetbarbell.com',
        pathname: '/**',
      },
    ],
  },
}

export default withNextIntl(nextConfig)
