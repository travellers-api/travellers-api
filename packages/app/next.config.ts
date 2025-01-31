import { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  redirects: async () => [
    {
      source: "/a/:path*",
      destination: "/u/:path*",
      permanent: true,
    },
  ],
};

export default config;
