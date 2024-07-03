/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        port: "4000",
        hostname: "localhost",
        pathname: "/**",
      },
      {
        hostname: 'via.placeholder.com',
        pathname: '/**'
      }
    ],
  },
};

export default nextConfig;
