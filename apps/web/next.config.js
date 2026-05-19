/** @type {import('next').NextConfig} */
const path = require('path');

/** Direct EC2/backend URL — server-side only, never exposed to browser */
const BACKEND_URL = (
  process.env.BACKEND_URL ||
  process.env.API_BACKEND_URL ||
  'http://localhost:4000'
).replace(/\/$/, '');

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@shirkat-gah/shared'],
  poweredByHeader: false,
  // Required for monorepo: trace dependencies from workspace root on Vercel
  outputFileTracingRoot: path.join(__dirname, '../../'),
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: '**.cloudfront.net' },
      { protocol: 'https', hostname: '**.vercel.app' },
      { protocol: 'http', hostname: 'localhost' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', '@radix-ui/react-icons'],
  },
  /**
   * Proxy browser API calls through Vercel (HTTPS) → EC2 backend (HTTP).
   * Browser uses NEXT_PUBLIC_API_URL=/api/backend (same-origin, no mixed content).
   * Example: /api/backend/api/v1/auth/login → http://EC2:4000/api/v1/auth/login
   */
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/backend/:path*',
          destination: `${BACKEND_URL}/:path*`,
        },
      ],
    };
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [{ key: 'X-DNS-Prefetch-Control', value: 'on' }],
      },
    ];
  },
};

module.exports = nextConfig;
