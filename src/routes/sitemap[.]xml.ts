import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "";

interface SitemapEntry {
  path: string;
  changefreq?: "weekly" | "monthly" | "daily";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { products, categories } = await import("@/lib/catalog");
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/shop", changefreq: "daily", priority: "0.9" },
          { path: "/contact", changefreq: "monthly", priority: "0.5" },
          { path: "/warranty-policy", changefreq: "monthly", priority: "0.4" },
          ...categories.map((c) => ({ path: `/category/${c.slug}`, changefreq: "weekly" as const, priority: "0.7" })),
          ...products.map((p) => ({ path: `/product/${p.slug}`, changefreq: "weekly" as const, priority: "0.7" })),
        ];

        const urls = entries.map((e) => `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    ${e.changefreq ? `<changefreq>${e.changefreq}</changefreq>` : ""}\n    ${e.priority ? `<priority>${e.priority}</priority>` : ""}\n  </url>`);

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;

        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
