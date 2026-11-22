import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/kontrakt-b2b",
        permanent: true,
        // Only redirect on FDK domains, not on new site domains
        has: [
          {
            type: "host",
            value: "(?!inkubatory\\.com\\.pl|businessincubator\\.pl|biznesinkubator\\.pl).*",
          },
        ],
      },
      {
        source: "/lp/landing1",
        destination: "/kontrakt-b2b",
        permanent: true,
      },
      {
        source: "/lp/landing2",
        destination: "/faktura-bez-firmy",
        permanent: true,
      },
      {
        source: "/lp/landing3",
        destination: "/wspolpraca-b2b",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
