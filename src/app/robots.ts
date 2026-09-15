import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lp.firmadlakazdego.pl";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/lp-dziekujemy",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
