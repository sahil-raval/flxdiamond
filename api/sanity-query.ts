import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sanityConfig, cdnUrl, setCors } from "./_lib";

/**
 * Public GROQ proxy. No auth token is forwarded — drafts stay hidden.
 * Body: { query: string, params?: Record<string, unknown> }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();

  const { projectId, dataset, apiVersion } = sanityConfig();

  // Safe health/diagnostic endpoint (no secrets) — open in a browser:
  //   https://<your-app>.vercel.app/api/sanity-query
  // Tells you whether env vars + runtime are correct on the deployment.
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      configured: Boolean(projectId),
      projectIdPresent: Boolean(projectId),
      dataset,
      apiVersion,
      node: process.version,
      hasFetch: typeof fetch === "function",
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!projectId) {
    return res.status(503).json({
      error:
        "Sanity not configured: set SANITY_PROJECT_ID (or VITE_SANITY_PROJECT_ID) in your Vercel project Environment Variables, then redeploy.",
    });
  }

  try {
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body || "{}")
        : req.body || {};
    const { query, params } = body as {
      query?: string;
      params?: Record<string, unknown>;
    };
    if (!query) return res.status(400).json({ error: "Missing query" });

    const r = await fetch(cdnUrl(projectId, apiVersion, dataset), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, params: params || {} }),
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json(data);
    return res.status(200).json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: message });
  }
}