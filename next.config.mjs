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
    ],
  },
};

export default nextConfig;
