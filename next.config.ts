import type { NextConfig } from "next";

const SITE_HOSTS: Record<string, string> = {
  "inkubatory.com.pl": "general",
  "businessincubator.pl": "tutors",
  "biznesinkubator.pl": "creative",
};

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  async rewrites() {
    const beforeFiles = Object.entries(SITE_HOSTS).flatMap(([host, site]) => {
      const variants = [host, `www.${host}`];
      return variants.flatMap((h) => [
        {
          source: "/",
          has: [{ type: "host" as const, value: h }],
          destination: `/site/${site}`,
        },
        {
          source: "/dziekujemy",
          has: [{ type: "host" as const, value: h }],
          destination: `/site/${site}/dziekujemy`,
        },
      ]);
    });

    return { beforeFiles };
  },

  async redirects() {
    // All three new hosts (and www. variants) that must NOT get the / → /kontrakt-b2b redirect
    const newHosts = Object.keys(SITE_HOSTS).flatMap((h) => [h, `www.${h}`]);

    return [
      // "/" → "/kontrakt-b2b" only on the FDK domain (not on new sites)
      {
        source: "/",
        destination: "/kontrakt-b2b",
        permanent: false,
        missing: newHosts.map((h) => ({ type: "host" as const, value: h })),
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
