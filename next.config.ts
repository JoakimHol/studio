
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone', // Add this line for optimized Docker builds
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
       // Ensure picsum.photos is allowed if not already covered by wildcard
       {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
     domains: ['picsum.photos'], // Added for broader compatibility if needed
  },
};

export default nextConfig;
