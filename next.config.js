/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com', // ✅ Perbaikan dari .co ke .com
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.themoviedb.org',
        pathname: '/**',
      }
    ],
  },
}

module.exports = nextConfig