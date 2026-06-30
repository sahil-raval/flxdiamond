import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { EASE } from "@/lib/motion";
const BATCH_SIZE    = 200;   // Sanity's safe limit per transaction
const PREVIEW_MAX   = 100;   // Max rows shown in preview table
const COLUMNS = [
  { key: "stockId",           label: "Stock ID",           required: true  },
  { key: "type",              label: "Type",               required: true,  note: "natural | lab | loose" },
  { key: "shape",             label: "Shape",              required: true,  note: "Round | Oval | Princess | Cushion | Emerald | Pear | Marquise | Radiant | Asscher | Heart | Triangle" },
  { key: "carat",             label: "Carat",              required: true,  note: "number e.g. 1.52" },
  { key: "color",             label: "Color",              required: true,  note: "D | E | F | G | H | I | J | K | L | M" },
  { key: "clarity",           label: "Clarity",            required: true,  note: "FL | IF | VVS1 | VVS2 | VS1 | VS2 | SI1 | SI2 | I1 | I2 | I3" },
  { key: "cut",               label: "Cut",                required: false, note: "Ideal | Excellent | Very Good | Good | Fair" },
  { key: "polish",            label: "Polish",             required: false, note: "Excellent | Very Good | Good | Fair" },
  { key: "symmetry",          label: "Symmetry",           required: false, note: "Excellent | Very Good | Good | Fair" },
  { key: "fluorescence",      label: "Fluorescence",       required: false, note: "None | Faint | Medium | Strong | Very Strong | BGM" },
  { key: "measurements",      label: "Measurements",       required: false, note: "e.g. 7.35×7.38×4.52 mm" },
  { key: "certification",     label: "Certification",      required: false, note: "GIA | IGI | None" },
  { key: "certificateNumber", label: "Certificate Number", required: false },
  { key: "tradePrice",        label: "Trade Price (AUD)",  required: false, note: "number, internal only" },
  { key: "notes",             label: "Notes",              required: false, note: "internal notes" },
  { key: "available",         label: "Available",          required: false, note: "true | false (default true)" },
  { key: "featured",          label: "Featured",           required: false, note: "true | false (default false)" },
] as const;

/* ── CSV parsing ─────────────────────────────────────────────── */
function parseLine(line: string): string[] {
  const res: string[] = [];
  let cur = "", q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (q && line[i + 1] === '"') { cur += '"'; i++; } else q = !q;
    } else if (c === ',' && !q) {
      res.push(cur.trim()); cur = "";
    } else {
      cur += c;
    }
  }
  res.push(cur.trim());
  return res;
}

type ParsedRow = {
  _row: number; _errors: string[];
  stockId: string; type: string; shape: string;
  carat: number; color: string; clarity: string;
  cut?: string; polish?: string; symmetry?: string;
  fluorescence?: string; measurements?: string;
  certification?: string; certificateNumber?: string;
  tradePrice?: number; notes?: string;
  available: boolean; featured: boolean;
};

function parseCsv(text: string): ParsedRow[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = parseLine(lines[0]).map(h => h.toLowerCase().replace(/[^a-z]/g, ""));

  return lines.slice(1).map((line, idx) => {
    const vals = parseLine(line);
    const raw = (k: string) => (vals[headers.indexOf(k)] ?? "").trim();
    const errors: string[] = [];
    if (!raw("stockid")) errors.push("stockId required");
    if (!raw("type"))    errors.push("type required");
    if (!raw("shape"))   errors.push("shape required");
    if (!raw("carat"))   errors.push("carat required");
    if (!raw("color"))   errors.push("color required");
    if (!raw("clarity")) errors.push("clarity required");

    const carat      = parseFloat(raw("carat") || "0");
    const tradePrice = raw("tradeprice") ? parseFloat(raw("tradeprice")) : undefined;

    return {
      _row: idx + 2, _errors: errors,
      stockId: raw("stockid"), type: raw("type"), shape: raw("shape"),
      carat, color: raw("color"), clarity: raw("clarity"),
      cut: raw("cut") || undefined, polish: raw("polish") || undefined,
      symmetry: raw("symmetry") || undefined, fluorescence: raw("fluorescence") || undefined,
      measurements: raw("measurements") || undefined, certification: raw("certification") || undefined,
      certificateNumber: raw("certificatenumber") || undefined,
      tradePrice: tradePrice && !isNaN(tradePrice) ? tradePrice : undefined,
      notes: raw("notes") || undefined,
      available: raw("available").toLowerCase() !== "false",
      featured: raw("featured").toLowerCase() === "true",
    };
  });
}

function rowToMutation(row: ParsedRow) {
  const doc: Record<string, unknown> = {
    _id:      `diamond-${row.stockId.replace(/[^a-zA-Z0-9\-_]/g, "-")}`,
    _type:    "diamond",
    stockId:  row.stockId, type: row.type, shape: row.shape,
    carat:    row.carat,   color: row.color, clarity: row.clarity,
    available: row.available, featured: row.featured,
  };
  const opts: (keyof ParsedRow)[] = ["cut","polish","symmetry","fluorescence","measurements","certification","certificateNumber","tradePrice","notes"];
  for (const k of opts) {
    const v = row[k];
    if (v !== undefined && v !== null && v !== "") doc[k as string] = v;
  }
  return { createOrReplace: doc };
}

function downloadTemplate() {
  const header  = COLUMNS.map(c => c.key).join(",");
  const example = ["FLX-001","natural","Round","1.52","D","FL","Excellent","Excellent","Excellent","None","7.35×7.38×4.52 mm","GIA","2476853574","28000","","true","false"].join(",");
  const blob = new Blob([`${header}\n${example}\n`], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  Object.assign(document.createElement("a"), { href: url, download: "diamonds-template.csv" }).click();
  URL.revokeObjectURL(url);
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/* ── Types ───────────────────────────────────────────────────── */
type ImportResult = { stockId: string; status: "ok" | "error"; message?: string };
type TokenStatus  = "unknown" | "checking" | "ok" | "missing";

const C = {
  bg: "#02274A", text: "#fff", muted: "rgba(255,255,255,0.42)",
  accent: "#1CA9C9", border: "rgba(28,169,201,0.15)",
};

/* ── Component ───────────────────────────────────────────────── */
export default function AdminImport() {
  const fileRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<{ cancelled: boolean }>({ cancelled: false });

  /* state */
  const [tokenStatus,  setTokenStatus]  = useState<TokenStatus>("unknown");
  const [rows,         setRows]         = useState<ParsedRow[]>([]);
  const [importing,    setImporting]    = useState(false);
  const [doneCount,    setDoneCount]    = useState(0);   // rows completed
  const [batchNum,     setBatchNum]     = useState(0);   // current batch index
  const [totalBatches, setTotalBatches] = useState(0);
  const [results,      setResults]      = useState<ImportResult[]>([]);
  const [done,         setDone]         = useState(false);
  const [showColumns,  setShowColumns]  = useState(false);

  const validRows    = rows.filter(r => r._errors.length === 0);
  const errorRows    = rows.filter(r => r._errors.length > 0);
  const successCount = results.filter(r => r.status === "ok").length;
  const failCount    = results.filter(r => r.status === "error").length;
  const batches      = chunk(validRows, BATCH_SIZE);
  const pct          = totalBatches > 0 ? Math.round((doneCount / validRows.length) * 100) : 0;

  /* ── Check token on mount ─────────────────────────────────── */
  const checkToken = useCallback(async () => {
    setTokenStatus("checking");
    try {
      const res = await fetch("/api/sanity-mutate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mutations: [] }),
      });
      setTokenStatus(res.status === 403 ? "missing" : "ok");
    } catch {
      setTokenStatus("missing");
    }
  }, []);

  useEffect(() => { checkToken(); }, [checkToken]);

  /* ── File handlers ────────────────────────────────────────── */
  function loadText(text: string) {
    setRows(parseCsv(text));
    setResults([]); setDone(false); setDoneCount(0); setBatchNum(0); setTotalBatches(0);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => loadText(ev.target?.result as string);
    reader.readAsText(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => loadText(ev.target?.result as string);
    reader.readAsText(file);
  }

  /* ── Batched import ───────────────────────────────────────── */
  async function handleImport() {
    if (!validRows.length || tokenStatus !== "ok") return;

    setImporting(true);
    setResults([]);
    setDoneCount(0);
    setBatchNum(0);
    setDone(false);
    abortRef.current.cancelled = false;

    const all  = chunk(validRows, BATCH_SIZE);
    setTotalBatches(all.length);
    const out: ImportResult[] = [];

    for (let i = 0; i < all.length; i++) {
      if (abortRef.current.cancelled) break;

      setBatchNum(i + 1);
      const batchRows = all[i];
      const mutations = batchRows.map(rowToMutation);

      let success = false;
      let lastErr = "";

      // Try up to 2 times per batch
      for (let attempt = 0; attempt < 2 && !success; attempt++) {
        try {
          const res = await fetch("/api/sanity-mutate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mutations }),
          });

          if (res.status === 403) {
            // Token revoked mid-import — stop everything
            setTokenStatus("missing");
            setImporting(false);
            setDone(true);
            return;
          }

          if (res.ok) {
            success = true;
            batchRows.forEach(r => out.push({ stockId: r.stockId, status: "ok" }));
          } else {
            lastErr = await res.text().catch(() => `HTTP ${res.status}`);
          }
        } catch (err) {
          lastErr = err instanceof Error ? err.message : String(err);
        }

        if (!success && attempt === 0) {
          // brief back-off before retry
          await new Promise(r => setTimeout(r, 800));
        }
      }

      if (!success) {
        batchRows.forEach(r => out.push({ stockId: r.stockId, status: "error", message: lastErr }));
      }

      setDoneCount(prev => prev + batchRows.length);
      setResults([...out]);
    }

    setImporting(false);
    setDone(true);
  }

  function cancelImport() { abortRef.current.cancelled = true; }

  function reset() {
    setRows([]); setResults([]); setDone(false);
    setDoneCount(0); setBatchNum(0); setTotalBatches(0);
    if (fileRef.current) fileRef.current.value = "";
  }

  /* ── Render helpers ───────────────────────────────────────── */
  const previewRows = validRows.slice(0, PREVIEW_MAX);
  const hiddenCount = validRows.length - previewRows.length;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Inter', sans-serif", color: C.text }}>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: "28px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 10, letterSpacing: "0.45em", textTransform: "uppercase", color: C.accent, marginBottom: 6 }}>
            Admin · Diamond Inventory
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, margin: 0 }}>
            Import from CSV
          </h1>
        </div>
        <Link href="/diamonds">
          <span style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: C.muted, cursor: "pointer", borderBottom: `1px solid ${C.border}`, paddingBottom: 2 }}>
            ← Back to Inventory
          </span>
        </Link>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 40px 80px" }}>

        {/* ── Token status banner ─────────────────────────────── */}
        <AnimatePresence>
          {tokenStatus === "missing" && (
            <motion.div
              key="token-missing"
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ border: "1px solid rgba(239,68,68,0.45)", background: "rgba(239,68,68,0.07)", padding: "18px 22px", marginBottom: 28, display: "flex", gap: 20, alignItems: "flex-start" }}
            >
              <span style={{ fontSize: 22, lineHeight: 1 }}>⚠</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "#ef4444", marginBottom: 8 }}>
                  SANITY_API_TOKEN not configured — imports will fail
                </p>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 12 }}>
                  You need a Sanity <strong style={{ color: C.text }}>Editor</strong> token so the server can write diamonds to your CMS.
                </p>
                <ol style={{ fontSize: 12, color: C.muted, lineHeight: 2, paddingLeft: 18, marginBottom: 12 }}>
                  <li>Open <a href="https://www.sanity.io/manage/personal/project/dp1evbtf/api" target="_blank" rel="noopener noreferrer" style={{ color: C.accent }}>sanity.io/manage → project dp1evbtf → API → Tokens</a></li>
                  <li>Click <strong style={{ color: C.text }}>Add API token</strong>, choose <strong style={{ color: C.text }}>Editor</strong> permission, give it a name</li>
                  <li>Copy the token, then open <strong style={{ color: C.text }}>Replit → Secrets</strong> and add it as <code style={{ fontFamily: "monospace", color: C.accent }}>SANITY_API_TOKEN</code></li>
                  <li>The API server will restart automatically and imports will work</li>
                </ol>
                <button onClick={checkToken} style={{ background: "transparent", border: "1px solid rgba(239,68,68,0.4)", color: "#ef4444", padding: "7px 16px", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", cursor: "pointer" }}>
                  Re-check token →
                </button>
              </div>
            </motion.div>
          )}
          {tokenStatus === "checking" && (
            <motion.div key="token-checking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ padding: "12px 0", marginBottom: 16, fontSize: 12, color: C.muted }}>
              Checking Sanity token…
            </motion.div>
          )}

          {tokenStatus === "ok" && rows.length === 0 && (
            <motion.div key="token-ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, fontSize: 12, color: "#22c55e" }}>
              <span>✓</span> Sanity token configured — ready to import
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Toolbar buttons ─────────────────────────────────── */}
        <div style={{ marginBottom: 32, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => setShowColumns(v => !v)}
            style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.accent, padding: "8px 16px", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", cursor: "pointer" }}>
            {showColumns ? "Hide" : "Show"} column reference
          </button>
          <button onClick={downloadTemplate}
            style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.muted, padding: "8px 16px", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", cursor: "pointer" }}>
            ↓ Download template
          </button>
        </div>

        {/* ── Column reference ────────────────────────────────── */}
        <AnimatePresence>
          {showColumns && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1, transition: { duration: 0.3, ease: EASE } }}
              exit={{ height: 0, opacity: 0, transition: { duration: 0.2 } }}
              style={{ overflow: "hidden", marginBottom: 32 }}
            >
              <div style={{ border: `1px solid ${C.border}`, padding: "20px 24px", background: "rgba(28,169,201,0.04)" }}>
                <p style={{ fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: C.accent, marginBottom: 16 }}>Column Reference</p>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr>
                      {["Column", "Required", "Accepted values / notes"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "4px 12px", color: C.muted, fontWeight: 500, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COLUMNS.map(col => (
                      <tr key={col.key} style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                        <td style={{ padding: "5px 12px", fontFamily: "monospace", color: C.accent }}>{col.key}</td>
                        <td style={{ padding: "5px 12px" }}>
                          <span style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: col.required ? "#ef4444" : C.muted }}>
                            {col.required ? "required" : "optional"}
                          </span>
                        </td>
                        <td style={{ padding: "5px 12px", color: C.muted }}>{"note" in col ? col.note : "string"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Drop zone ───────────────────────────────────────── */}
        {!rows.length && (
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            style={{ border: `2px dashed ${C.border}`, padding: "64px 40px", textAlign: "center", cursor: "pointer", transition: "border-color 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = C.accent; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = C.border; }}
          >
            <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.22 }}>⬆</div>
            <p style={{ fontSize: 16, fontFamily: "'Playfair Display', serif", fontWeight: 400, marginBottom: 8 }}>
              Click to upload a CSV file
            </p>
            <p style={{ fontSize: 12, color: C.muted }}>or drag and drop — any size, including 50,000+ rows</p>
            <input ref={fileRef} type="file" accept=".csv,text/csv" style={{ display: "none" }} onChange={handleFile} />
          </div>
        )}

        {/* ── Preview & import ────────────────────────────────── */}
        {rows.length > 0 && !done && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } }}>

            {/* Summary bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: 13 }}>{rows.length.toLocaleString()} rows parsed</span>
                {validRows.length > 0 && (
                  <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#22c55e" }}>
                    ✓ {validRows.length.toLocaleString()} valid
                  </span>
                )}
                {errorRows.length > 0 && (
                  <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444" }}>
                    ✗ {errorRows.length.toLocaleString()} with errors (skipped)
                  </span>
                )}
                {batches.length > 1 && (
                  <span style={{ fontSize: 11, color: C.muted }}>
                    → {batches.length} batches of {BATCH_SIZE}
                  </span>
                )}
              </div>
              <button onClick={reset} disabled={importing}
                style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.muted, padding: "6px 14px", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", cursor: "pointer", opacity: importing ? 0.4 : 1 }}>
                Clear
              </button>
            </div>

            {/* CSV parse errors */}
            {errorRows.length > 0 && (
              <div style={{ border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.06)", padding: "14px 18px", marginBottom: 20, maxHeight: 160, overflowY: "auto" }}>
                <p style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "#ef4444", marginBottom: 10 }}>
                  Rows with errors — skipped on import
                </p>
                {errorRows.slice(0, 20).map(r => (
                  <p key={r._row} style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 3 }}>
                    Row {r._row}: {r._errors.join(", ")}
                  </p>
                ))}
                {errorRows.length > 20 && (
                  <p style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
                    …and {errorRows.length - 20} more error rows
                  </p>
                )}
              </div>
            )}

            {/* Preview table */}
            {validRows.length > 0 && (
              <div style={{ border: `1px solid ${C.border}`, overflow: "auto", marginBottom: 24 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 820 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${C.border}`, background: "rgba(28,169,201,0.05)" }}>
                      {["Stock ID","Type","Shape","Carat","Color","Clarity","Cut","Cert","Price","Avail","★"].map(h => (
                        <th key={h} style={{ padding: "9px 13px", textAlign: "left", color: C.muted, fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase", whiteSpace: "nowrap", fontWeight: 500 }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((r, i) => (
                      <tr key={r._row} style={{ borderBottom: `1px solid rgba(255,255,255,0.04)`, background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)" }}>
                        <td style={{ padding: "8px 13px", fontFamily: "monospace", color: C.accent }}>{r.stockId}</td>
                        <td style={{ padding: "8px 13px", color: C.muted }}>{r.type}</td>
                        <td style={{ padding: "8px 13px", color: C.muted }}>{r.shape}</td>
                        <td style={{ padding: "8px 13px" }}>{r.carat}</td>
                        <td style={{ padding: "8px 13px" }}>{r.color}</td>
                        <td style={{ padding: "8px 13px" }}>{r.clarity}</td>
                        <td style={{ padding: "8px 13px", color: C.muted }}>{r.cut ?? "—"}</td>
                        <td style={{ padding: "8px 13px", color: C.muted }}>{r.certification ?? "—"}</td>
                        <td style={{ padding: "8px 13px", color: C.muted }}>{r.tradePrice != null ? `$${r.tradePrice.toLocaleString()}` : "—"}</td>
                        <td style={{ padding: "8px 13px", color: r.available ? "#22c55e" : "#ef4444" }}>{r.available ? "✓" : "✗"}</td>
                        <td style={{ padding: "8px 13px", color: r.featured ? C.accent : C.muted }}>{r.featured ? "✓" : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {hiddenCount > 0 && (
                  <div style={{ padding: "10px 16px", background: "rgba(28,169,201,0.04)", borderTop: `1px solid ${C.border}`, fontSize: 12, color: C.muted, textAlign: "center" }}>
                    Showing first {PREVIEW_MAX} of {validRows.length.toLocaleString()} rows — all {validRows.length.toLocaleString()} will be imported
                  </div>
                )}
              </div>
            )}

            {/* Import button + live progress */}
            {validRows.length > 0 && (
              <div>
                {/* Progress area — visible while importing */}
                <AnimatePresence>
                  {importing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      style={{ marginBottom: 20, overflow: "hidden" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: 13 }}>
                          Batch {batchNum} of {totalBatches} — {doneCount.toLocaleString()} / {validRows.length.toLocaleString()} diamonds
                        </span>
                        <span style={{ fontSize: 13, color: C.accent }}>{pct}%</span>
                      </div>
                      {/* Main progress bar */}
                      <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden", marginBottom: 6 }}>
                        <motion.div
                          style={{ height: "100%", background: C.accent, borderRadius: 2 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                      {/* Live import results mini-stream */}
                      {results.length > 0 && (
                        <p style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>
                          ✓ {results.filter(r => r.status === "ok").length.toLocaleString()} imported
                          {results.filter(r => r.status === "error").length > 0 && (
                            <span style={{ color: "#ef4444", marginLeft: 12 }}>
                              ✗ {results.filter(r => r.status === "error").length} errors
                            </span>
                          )}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  {!importing ? (
                    <button
                      onClick={handleImport}
                      disabled={tokenStatus !== "ok"}
                      style={{
                        background: tokenStatus !== "ok" ? "rgba(28,169,201,0.25)" : C.accent,
                        border: "none", color: "#fff", padding: "14px 32px",
                        fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase",
                        cursor: tokenStatus !== "ok" ? "not-allowed" : "pointer",
                        transition: "background 0.2s",
                      }}
                    >
                      Import {validRows.length.toLocaleString()} diamond{validRows.length !== 1 ? "s" : ""}
                      {batches.length > 1 ? ` in ${batches.length} batches` : ""}
                    </button>
                  ) : (
                    <button
                      onClick={cancelImport}
                      style={{ background: "transparent", border: "1px solid rgba(239,68,68,0.4)", color: "#ef4444", padding: "13px 28px", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", cursor: "pointer" }}
                    >
                      Cancel
                    </button>
                  )}

                  {tokenStatus === "missing" && (
                    <span style={{ fontSize: 12, color: "#ef4444" }}>
                      Set SANITY_API_TOKEN first ↑
                    </span>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ── Results summary ──────────────────────────────────── */}
        {done && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } }}>
            <div style={{
              border: `1px solid ${failCount === 0 ? "rgba(34,197,94,0.4)" : "rgba(245,158,11,0.4)"}`,
              background: failCount === 0 ? "rgba(34,197,94,0.06)" : "rgba(245,158,11,0.06)",
              padding: "24px 28px", marginBottom: 24,
            }}>
              <p style={{ fontSize: 18, fontFamily: "'Playfair Display', serif", fontWeight: 400, color: failCount === 0 ? "#22c55e" : "#f59e0b", marginBottom: 8 }}>
                {abortRef.current.cancelled
                  ? `Import cancelled — ${successCount.toLocaleString()} diamonds saved before cancel`
                  : failCount === 0
                    ? `✓ ${successCount.toLocaleString()} diamond${successCount !== 1 ? "s" : ""} imported successfully`
                    : `${successCount.toLocaleString()} imported · ${failCount.toLocaleString()} failed`
                }
              </p>
              <p style={{ fontSize: 13, color: C.muted }}>
                {failCount === 0 && !abortRef.current.cancelled
                  ? "All stones are now live in Sanity and will appear in the inventory."
                  : failCount > 0
                    ? "Failed batches have been noted below — re-export just those rows and re-import."
                    : ""
                }
              </p>
            </div>

            {failCount > 0 && (
              <div style={{ border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.06)", padding: "14px 18px", marginBottom: 24, maxHeight: 200, overflowY: "auto" }}>
                <p style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "#ef4444", marginBottom: 10 }}>Failed rows</p>
                {results.filter(r => r.status === "error").slice(0, 30).map(r => (
                  <p key={r.stockId} style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 3 }}>
                    {r.stockId}: {r.message}
                  </p>
                ))}
                {failCount > 30 && <p style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>…and {failCount - 30} more</p>}
              </div>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={reset}
                style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.muted, padding: "10px 24px", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", cursor: "pointer" }}>
                Import another file
              </button>
              <Link href="/diamonds">
                <button style={{ background: C.accent, border: "none", color: "#fff", padding: "10px 24px", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", cursor: "pointer" }}>
                  View Inventory
                </button>
              </Link>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
