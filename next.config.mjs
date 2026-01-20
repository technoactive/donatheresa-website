import { withSentryConfig } from "@sentry/nextjs";

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
  async redirects() {
    return [
      // === WWW to non-WWW redirect ===
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.donatheresa.com' }],
        destination: 'https://donatheresa.com/:path*',
        permanent: true,
      },
      
      // === Homepage variations ===
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index.php',
        destination: '/',
        permanent: true,
      },
      {
        source: '/default.html',
        destination: '/',
        permanent: true,
      },
      
      // === Booking/Reserve variations ===
      {
        source: '/booking',
        destination: '/reserve',
        permanent: true,
      },
      {
        source: '/book',
        destination: '/reserve',
        permanent: true,
      },
      {
        source: '/book-a-table',
        destination: '/reserve',
        permanent: true,
      },
      {
        source: '/book-table',
        destination: '/reserve',
        permanent: true,
      },
      {
        source: '/reservations',
        destination: '/reserve',
        permanent: true,
      },
      {
        source: '/reservation',
        destination: '/reserve',
        permanent: true,
      },
      {
        source: '/table-booking',
        destination: '/reserve',
        permanent: true,
      },
      
      // === Menu variations ===
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
        source: '/menus',
        destination: '/menu',
        permanent: true,
      },
      {
        source: '/food-menu',
        destination: '/menu',
        permanent: true,
      },
      {
        source: '/our-menu',
        destination: '/menu',
        permanent: true,
      },
      {
        source: '/menu.html',
        destination: '/menu',
        permanent: true,
      },
      {
        source: '/lunchtime-early-bird-menu',
        destination: '/menu/lunchtime-earlybird',
        permanent: true,
      },
      {
        source: '/lunch-menu',
        destination: '/menu/lunchtime-earlybird',
        permanent: true,
      },
      {
        source: '/early-bird',
        destination: '/menu/lunchtime-earlybird',
        permanent: true,
      },
      {
        source: '/earlybird',
        destination: '/menu/lunchtime-earlybird',
        permanent: true,
      },
      {
        source: '/a-la-carte-old',
        destination: '/menu/a-la-carte',
        permanent: true,
      },
      {
        source: '/a-la-carte',
        destination: '/menu/a-la-carte',
        permanent: true,
      },
      {
        source: '/alacarte',
        destination: '/menu/a-la-carte',
        permanent: true,
      },
      
      // === Old seasonal menus to main menu ===
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
      {
        source: '/christmas-menu',
        destination: '/menu',
        permanent: true,
      },
      {
        source: '/christmas',
        destination: '/menu',
        permanent: true,
      },
      {
        source: '/new-years-eve',
        destination: '/menu',
        permanent: true,
      },
      {
        source: '/new-year-menu',
        destination: '/menu',
        permanent: true,
      },
      
      // === Contact variations ===
      {
        source: '/contact-us',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/get-in-touch',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/contact.html',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/enquiry',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/enquiries',
        destination: '/contact',
        permanent: true,
      },
      
      // === About variations ===
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/about.html',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/our-story',
        destination: '/about',
        permanent: true,
      },
      
      // === Location pages variations ===
      {
        source: '/hatch-end',
        destination: '/restaurants-hatch-end',
        permanent: true,
      },
      {
        source: '/pinner',
        destination: '/restaurants-pinner',
        permanent: true,
      },
      {
        source: '/harrow',
        destination: '/restaurants-harrow',
        permanent: true,
      },
      {
        source: '/northwood',
        destination: '/restaurants-northwood',
        permanent: true,
      },
      {
        source: '/watford',
        destination: '/restaurants-watford',
        permanent: true,
      },
      {
        source: '/ruislip',
        destination: '/restaurants-ruislip',
        permanent: true,
      },
      
      // === Gallery/Images redirects ===
      {
        source: '/gallery',
        destination: '/#gallery',
        permanent: true,
      },
      {
        source: '/photos',
        destination: '/#gallery',
        permanent: true,
      },
      {
        source: '/images',
        destination: '/#gallery',
        permanent: true,
      },
      
      // === Common typos and variations ===
      {
        source: '/dona-theresa',
        destination: '/',
        permanent: true,
      },
      {
        source: '/donatheresa',
        destination: '/',
        permanent: true,
      },
      {
        source: '/italian-restaurant',
        destination: '/best-italian-restaurant-near-me',
        permanent: true,
      },
      
      // === Privacy/Legal pages ===
      {
        source: '/privacy',
        destination: '/cookie-policy',
        permanent: true,
      },
      {
        source: '/privacy-policy',
        destination: '/cookie-policy',
        permanent: true,
      },
      {
        source: '/cookies',
        destination: '/cookie-policy',
        permanent: true,
      },
      {
        source: '/terms',
        destination: '/cookie-policy',
        permanent: true,
      },
    ]
  },
}

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: "dtr-pinner-limited",
  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Webpack-specific options (new format)
  webpack: {
    // Automatically annotate React components to show their full name in breadcrumbs and session replay
    reactComponentAnnotation: {
      enabled: true,
    },
    // Automatically tree-shake Sentry logger statements to reduce bundle size
    treeshake: {
      removeDebugLogging: true,
    },
    // Enables automatic instrumentation of Vercel Cron Monitors
    automaticVercelMonitors: true,
  },
})
