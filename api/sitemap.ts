import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sanityConfig, setCors } from "./_lib";

const STATIC_ROUTES: Array<[string, number, string]> = [
  ["/", 1.0, "weekly"],
  ["/diamonds", 0.9, "daily"],
  ["/jewellery", 0.7, "weekly"],
  ["/services", 0.7, "monthly"],
  ["/investment", 0.7, "monthly"],
  ["/trade", 0.7, "monthly"],
  ["/about", 0.6, "monthly"],
  ["/journal", 0.7, "weekly"],
  ["/contact", 0.5, "monthly"],
  ["/faq", 0.5, "monthly"],
  ["/privacy", 0.2, "yearly"],
  ["/terms", 0.2, "yearly"],
];

function siteBase(req: VercelRequest): string {
  const fromEnv =
    process.env.SITE_URL || process.env.VITE_SITE_URL || process.env.VERCEL_URL;
  if (fromEnv) {
    return fromEnv.startsWith("http") ? fromEnv : `https://${fromEnv}`;
  }
  const host = req.headers.host || "localhost:3000";
  const proto = (req.headers["x-forwarded-proto"] as string) || "https";
  return `${proto}://${host}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();

  const base = siteBase(req).replace(/\/$/, "");
  const today = new Date().toISOString().split("T")[0];

  const entries: string[] = [];
  for (const [path, prio, freq] of STATIC_ROUTES) {
    entries.push(
      `  <url>\n    <loc>${base}${path}</loc>\n    <lastmod>${today}</lastmod>\n` +
        `    <changefreq>${freq}</changefreq>\n    <priority>${prio.toFixed(1)}</priority>\n  </url>`,
    );
  }

  // Pull journal article slugs from Sanity (best-effort)
  const { projectId, dataset, apiVersion } = sanityConfig();
  if (projectId) {
    try {
      const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`;
      const groq =
        '*[_type=="journalArticle" && defined(slug.current)]{ "slug": slug.current, publishedAt }';
      const r = await fetch(`${url}?query=${encodeURIComponent(groq)}`);
      if (r.ok) {
        const { result } = (await r.json()) as {
          result?: Array<{ slug?: string; publishedAt?: string }>;
        };
        for (const item of result ?? []) {
          if (!item?.slug) continue;
          const lastmod = (item.publishedAt || today).split("T")[0];
          entries.push(
            `  <url>\n    <loc>${base}/journal/${item.slug}</loc>\n` +
              `    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`,
          );
        }
      }
    } catch {
      // ignore — sitemap should never 500 on Sanity hiccups
    }
  }

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries.join("\n") +
    "\n</urlset>\n";

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");
  res.status(200).send(xml);
}