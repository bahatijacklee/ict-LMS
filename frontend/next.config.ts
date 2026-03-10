import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Pexels - High-quality stock photos
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      // Picsum - Placeholder images
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      // Unsplash - Free stock photos
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      // Pravatar - Avatar generation service
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      // PlaceIMG - Placeholder images
      {
        protocol: 'https',
        hostname: 'placeimg.com',
      },
    ],
  },
};

export default nextConfig;
