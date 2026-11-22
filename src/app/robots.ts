import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getSiteByHost } from "@/config/sites";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const siteId = getSiteByHost(host);

  // On new site domains, only allow root and disallow /site/ paths
  if (siteId) {
    return {
      rules: [
        {
          userAgent: "*",
          allow: "/",
          disallow: ["/site/", "/dziekujemy"],
        },
      ],
      sitemap: `https://${host}/sitemap.xml`,
    };
  }

  // Default FDK robots
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lp.firmadlakazdego.pl";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/lp-dziekujemy", "/site/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
