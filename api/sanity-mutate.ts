import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sanityConfig, apiUrl, setCors, requireAdmin } from "./_lib";

/**
 * Admin-protected Sanity mutation proxy.
 * Header: X-Admin-Secret
 * Body:   { mutations: Mutation[] }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!requireAdmin(req, res)) return;

  const { projectId, dataset, apiVersion, token } = sanityConfig();
  if (!projectId || !token) {
    return res.status(503).json({ error: "Sanity write token not configured" });
  }

  const body =
    typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
  const { mutations } = body as { mutations?: unknown[] };
  if (!Array.isArray(mutations)) {
    return res.status(400).json({ error: "Missing mutations array" });
  }

  try {
    const r = await fetch(apiUrl(projectId, apiVersion, dataset), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mutations }),
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json(data);
    return res.status(200).json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: message });
  }
}
