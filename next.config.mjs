/** @type {import('next').NextConfig} */
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

const nextConfig = {
  images: {
    qualities: [70, 75],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'api.aqualab.ma',
        pathname: '/uploads/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/media/:path*',
        destination: `${apiUrl}/uploads/:path*`,
      },
    ]
  },
  allowedDevOrigins: ['192.168.255.1'],
};

export default nextConfig;
