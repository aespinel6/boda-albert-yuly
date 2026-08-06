import type { MetadataRoute } from "next";
import { wedding } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/i/", "/album/"] }],
    sitemap: `${wedding.site.url}/sitemap.xml`,
  };
}
