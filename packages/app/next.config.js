/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  redirects: () => [
    {
      source: "/a/:path*",
      destination: "/u/:path*",
      permanent: true,
    },
  ],
};

module.exports = nextConfig;
