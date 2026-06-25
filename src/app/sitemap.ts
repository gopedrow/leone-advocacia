import type { MetadataRoute } from "next";
import { site, navMain } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return navMain.map((item) => ({
    url: `${site.url}${item.href === "/" ? "" : item.href}`,
    lastModified: now,
    changeFrequency: item.href === "/" ? "weekly" : "monthly",
    priority: item.href === "/" ? 1 : 0.7,
  }));
}
