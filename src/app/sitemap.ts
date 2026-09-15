import type { MetadataRoute } from "next";

const LANDINGS = [
  { path: "/kontrakt-b2b", priority: 1.0 },
  { path: "/faktura-bez-firmy", priority: 1.0 },
  { path: "/wspolpraca-b2b", priority: 1.0 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lp.firmadlakazdego.pl";

  return LANDINGS.map(({ path, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority,
  }));
}
