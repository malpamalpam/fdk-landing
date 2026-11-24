import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getSiteByHost, SITES } from "@/config/sites";
import { getBlogPostsMeta } from "@/content/blog/index";

export const dynamic = "force-dynamic";

const LANDINGS = [
  { path: "/kontrakt-b2b", priority: 1.0 },
  { path: "/faktura-bez-firmy", priority: 1.0 },
  { path: "/wspolpraca-b2b", priority: 1.0 },
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const siteId = getSiteByHost(host);

  // On new site domains, return sitemap with blog posts
  if (siteId) {
    const config = SITES[siteId];
    const baseUrl = `https://${config.domains[0]}`;
    const blogPosts = getBlogPostsMeta(siteId);

    console.log(`[sitemap] host=${host} siteId=${siteId} blogPosts=${blogPosts.length}`);

    return [
      { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
      { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
      ...blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated ?? post.date),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
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
