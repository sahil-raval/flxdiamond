import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sanityConfig, apiUrl, setCors, requireAdmin } from "../_lib";

/**
 * CSV bulk import for diamonds.
 *
 * Send the CSV body as plain text:
 *   POST /api/admin/import-diamonds-csv
 *   Content-Type: text/csv
 *   X-Admin-Secret: <secret>
 *
 * Existing diamonds with the same stockId are upserted.
 */
const COL_KEYS: Record<string, string> = {
  stockid: "stockId",
  stockId: "stockId",
  type: "type",
  shape: "shape",
  carat: "carat",
  color: "color",
  colour: "color",
  clarity: "clarity",
  cut: "cut",
  polish: "polish",
  symmetry: "symmetry",
  fluorescence: "fluorescence",
  measurements: "measurements",
  certification: "certification",
  certificatenumber: "certificateNumber",
  certificateNumber: "certificateNumber",
  tradeprice: "tradePrice",
  tradePrice: "tradePrice",
  notes: "notes",
  available: "available",
  featured: "featured",
};

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let cur = "";
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuote && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else inQuote = !inQuote;
    } else if (ch === "," && !inQuote) {
      result.push(cur.trim());
      cur = "";
    } else {
      cur += ch;
    }
  }
  result.push(cur.trim());
  return result;
}

function parseBool(v: string, def: boolean): boolean {
  const s = (v || "").trim().toLowerCase();
  if (["true", "1", "yes", "y"].includes(s)) return true;
  if (["false", "0", "no", "n"].includes(s)) return false;
  return def;
}

function slugId(stockId: string): string {
  return "diamond-" + stockId.replace(/[^a-zA-Z0-9-_]/g, "-");
}

export const config = {
  api: {
    bodyParser: { sizeLimit: "4mb" },
  },
};

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

  const raw =
    typeof req.body === "string"
      ? req.body
      : Buffer.isBuffer(req.body)
        ? req.body.toString("utf-8")
        : String(req.body ?? "");
  const text = raw.replace(/^\uFEFF/, ""); // strip BOM

  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) {
    return res
      .status(400)
      .json({ error: "CSV needs a header + at least one data row" });
  }

  const headers = parseCsvLine(lines[0]);
  const mutations: Array<Record<string, unknown>> = [];
  const errors: Array<{ row: number; missing?: string[]; error?: string }> = [];

  for (let i = 1; i < lines.length; i++) {
    const vals = parseCsvLine(lines[i]);
    const norm: Record<string, string> = {};
    headers.forEach((h, idx) => {
      const k = COL_KEYS[h.trim()] || COL_KEYS[h.trim().toLowerCase()];
      if (k) norm[k] = (vals[idx] ?? "").trim();
    });

    const missing = [
      "stockId",
      "type",
      "shape",
      "carat",
      "color",
      "clarity",
    ].filter((f) => !norm[f]);
    if (missing.length) {
      errors.push({ row: i + 1, missing });
      continue;
    }
    const caratNum = parseFloat(norm.carat);
    if (Number.isNaN(caratNum) || caratNum <= 0) {
      errors.push({ row: i + 1, error: "invalid carat" });
      continue;
    }

    const doc: Record<string, unknown> = {
      _id: slugId(norm.stockId),
      _type: "diamond",
      stockId: norm.stockId,
      type: norm.type,
      shape: norm.shape,
      carat: caratNum,
      color: norm.color,
      clarity: norm.clarity,
      available: parseBool(norm.available || "", true),
      featured: parseBool(norm.featured || "", false),
    };
    for (const k of [
      "cut",
      "polish",
      "symmetry",
      "fluorescence",
      "measurements",
      "certification",
      "certificateNumber",
      "notes",
    ]) {
      if (norm[k]) doc[k] = norm[k];
    }
    if (norm.tradePrice) {
      const p = parseFloat(norm.tradePrice);
      if (!Number.isNaN(p)) doc.tradePrice = p;
    }
    mutations.push({ createOrReplace: doc });
  }

  if (!mutations.length) {
    return res
      .status(200)
      .json({ imported: 0, rows: lines.length - 1, errors });
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
    return res.status(200).json({
      imported: mutations.length,
      rows: lines.length - 1,
      errors,
      sanity: data,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: message });
  }
}
