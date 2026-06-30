import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sanityConfig, setCors } from "./_lib";

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  const { projectId, dataset } = sanityConfig();
  res.status(200).json({
    status: "ok",
    sanity_configured: Boolean(projectId),
    sanity_project: projectId || null,
    sanity_dataset: dataset,
    time: new Date().toISOString(),
  });
}
