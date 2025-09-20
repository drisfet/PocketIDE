import type { NextConfig } from "next";
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  // Enable Turbopack for development
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  // Disable webpack in development when using Turbopack
  webpack: (config, { dev }) => {
    if (dev) {
      // Remove webpack-specific configurations when using Turbopack
      config.resolve.alias = {
        ...config.resolve.alias,
      };
    }
    return config;
  },
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})(nextConfig);
