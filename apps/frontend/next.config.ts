import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'laf-info.netlify.app',
        pathname: '/images/avatars/default.png',
      },
    ],
  },
};

export default nextConfig;
