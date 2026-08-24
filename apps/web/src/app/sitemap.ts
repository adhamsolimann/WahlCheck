import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/site-config";

export const dynamic = "force-static";

const PAGES = [
  { path: "", priority: 1.0, changeFrequency: "daily" as const },
  { path: "quiz", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "koalition", priority: 0.8, changeFrequency: "daily" as const },
  { path: "news", priority: 0.7, changeFrequency: "daily" as const },
  { path: "methodik", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "statut", priority: 0.4, changeFrequency: "yearly" as const },
  { path: "spenden", priority: 0.4, changeFrequency: "monthly" as const },
  { path: "datenschutz", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "impressum", priority: 0.2, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_CONFIG.siteUrl}/${path}${path ? "/" : ""}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
