import { NextConfig } from "next";

const config: NextConfig = {
  redirects: async () => [
    {
      source: "/a/:path*",
      destination: "/u/:path*",
      permanent: true,
    },
  ],
};

export default config;
