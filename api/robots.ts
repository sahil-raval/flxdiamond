import type { VercelRequest, VercelResponse } from "@vercel/node";
import { setCors } from "./_lib.js";

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

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  const base = siteBase(req).replace(/\/$/, "");
  const body =
    "User-agent: *\n" +
    "Allow: /\n" +
    "Disallow: /studio\n" +
    "Disallow: /admin\n" +
    "Disallow: /login\n" +
    `Sitemap: ${base}/sitemap.xml\n`;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
  res.status(200).send(body);
}