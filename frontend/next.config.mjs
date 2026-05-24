/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Required for @react-pdf/renderer
    config.resolve.alias.canvas = false;
    return config;
  }
};

export default nextConfig;
