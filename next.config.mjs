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
  images: {
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
        protocol: 'http',
        hostname: new URL(process.env.NEXT_PUBLIC_IMAGE_URL).hostname,
        pathname: '/**', // Allow all paths
      },
    ],
  },
};

export default withNextIntl(nextConfig);
