import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Resolve Sanity config from env vars. Vercel deployments use
 * server-only `SANITY_*` vars; Vite-built clients use `VITE_SANITY_*`.
 */
export function sanityConfig() {
  const projectId =
    process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID;
  const dataset =
    process.env.SANITY_DATASET || process.env.VITE_SANITY_DATASET || "production";
  const apiVersion =
    process.env.SANITY_API_VERSION ||
    process.env.VITE_SANITY_API_VERSION ||
    "2024-01-01";
  const token = process.env.SANITY_API_TOKEN || process.env.SANITY_WRITE_TOKEN;
  return { projectId, dataset, apiVersion, token };
}

export function cdnUrl(projectId: string, apiVersion: string, dataset: string) {
  // Use the live API (not apicdn) so freshly published content is returned
  // immediately instead of stale CDN-cached responses.
  return `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`;
}

export function apiUrl(projectId: string, apiVersion: string, dataset: string) {
  return `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`;
}

export function setCors(res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  // Never cache the proxy response (edge/CDN/browser) so freshly published
  // Sanity content is always returned on the deployed (Vercel) site.
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.setHeader("CDN-Cache-Control", "no-store");
  res.setHeader("Vercel-CDN-Cache-Control", "no-store");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, X-Admin-Secret, Authorization",
  );
}

export function adminSecret() {
  return (
    process.env.ADMIN_SECRET ||
    process.env.SANITY_API_TOKEN ||
    process.env.SANITY_WRITE_TOKEN
  );
}

export function requireAdmin(req: VercelRequest, res: VercelResponse): boolean {
  const expected = adminSecret();
  if (!expected) {
    res.status(503).json({ error: "Admin secret not configured" });
    return false;
  }
  const provided = req.headers["x-admin-secret"] as string | undefined;
  if (provided !== expected) {
    res.status(401).json({ error: "Invalid or missing X-Admin-Secret header" });
    return false;
  }
  return true;
}