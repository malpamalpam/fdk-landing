import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getSiteByHost, SITES } from "@/config/sites";

const LANDINGS = [
  { path: "/kontrakt-b2b", priority: 1.0 },
  { path: "/faktura-bez-firmy", priority: 1.0 },
  { path: "/wspolpraca-b2b", priority: 1.0 },
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const siteId = getSiteByHost(host);

  // On new site domains, return single-page sitemap
  if (siteId) {
    const config = SITES[siteId];
    const baseUrl = `https://${config.domains[0]}`;
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 1.0,
      },
    ];
  }

  // Default FDK sitemap
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lp.firmadlakazdego.pl";

  return LANDINGS.map(({ path, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority,
  }));
}
