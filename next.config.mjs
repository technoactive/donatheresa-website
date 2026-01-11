/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    // Suppress specific webpack warnings
    config.infrastructureLogging = {
      level: 'error',
    }
    return config
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ]
  },
  async     redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/booking',
        destination: '/reserve',
        permanent: true,
      },
      {
        source: '/our-menus.html',
        destination: '/menu',
        permanent: true,
      },
      {
        source: '/our-menus',
        destination: '/menu',
        permanent: true,
      },
      {
        source: '/lunchtime-early-bird-menu',
        destination: '/menu/lunchtime-earlybird',
        permanent: true,
      },
      {
        source: '/a-la-carte-old',
        destination: '/menu/a-la-carte',
        permanent: true,
      },
      // Redirect old seasonal menus to main menu
      {
        source: '/menu/december-christmas-menu',
        destination: '/menu',
        permanent: true,
      },
      {
        source: '/menu/christmas-day',
        destination: '/menu',
        permanent: true,
      },
      {
        source: '/menu/new-year',
        destination: '/menu',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
