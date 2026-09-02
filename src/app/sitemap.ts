import type { MetadataRoute } from "next";

const LOCALES = ["pl", "en", "uk", "ru"] as const;
const PATHS = ["/", "/dziekujemy"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://twoja-domena.pl";

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const path of PATHS) {
      entries.push({
        url: `${siteUrl}/${locale}${path === "/" ? "" : path}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: path === "/" ? 1.0 : 0.5,
      });
    }
  }

  return entries;
}
