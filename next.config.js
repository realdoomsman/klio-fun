/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static optimization
  output: 'standalone',
  
  // Optimize images
  images: {
    domains: ['klio.fun'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Enable compression
  compress: true,
  
  // Optimize bundle
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.mainnet-beta.solana.com https://api.devnet.solana.com;",
          },
        ],
      },
    ]
  },
  
  // Redirect configuration
  async redirects() {
    return [
      {
        source: '/fate',
        destination: '/',
        permanent: true,
      },
      {
        source: '/fate.fun',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig