import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { EASE } from "@/lib/motion";

const COLORS = {
  bg: "#02274A", text: "#fff", muted: "rgba(255,255,255,0.42)",
  accent: "#1CA9C9", border: "rgba(28,169,201,0.15)",
  danger: "#ef4444", success: "#22c55e", warn: "#f59e0b",
};

type ApiKey = {
  id: string; name: string; keyPrefix: string;
  active: boolean; createdAt: string; lastUsedAt: string | null;
};

type NewKey = {
  id: string; name: string; key: string; keyPrefix: string;
  createdAt: string; warning: string;
};

function adminHeaders(secret: string) {
  return { "Content-Type": "application/json", "X-Admin-Secret": secret };
}

function relativeTime(iso: string | null) {
  if (!iso) return "never";
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60000)  return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

const BASE =
  typeof import.meta !== "undefined" && (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL
    ? (import.meta as { env: { BASE_URL: string } }).env.BASE_URL.replace(/\/$/, "")
    : "";
const API_ORIGIN = window.location.origin;
const PUBLIC_BASE = `${API_ORIGIN}${BASE}/api/v1/diamonds`;

const CODE_FETCH = (key: string) =>
`// Fetch diamonds — Node.js / browser fetch
const response = await fetch(
  "${PUBLIC_BASE}?page=1&pageSize=100",
  { headers: { "X-Api-Key": "${key}" } }
);
const { data, pagination } = await response.json();
console.log(\`Showing \${data.length} of \${pagination.total} diamonds\`);`;

const CODE_FILTER = (key: string) =>
`// Filter examples
const params = new URLSearchParams({
  type:      "natural",     // natural | lab | loose
  shape:     "Round",       // Round | Oval | Pear | ...
  color:     "D",           // D–M
  clarity:   "VS1",         // FL IF VVS1 VVS2 VS1 VS2 SI1 SI2
  caratMin:  "1",
  caratMax:  "3",
  available: "true",
  sort:      "carat_desc",  // carat_asc | carat_desc | color_asc | ...
  pageSize:  "100",         // max 500
  page:      "1",
});

const res = await fetch(\`${PUBLIC_BASE}?\${params}\`, {
  headers: { "X-Api-Key": "${key}" }
});`;

const CODE_STATS = (key: string) =>
`// Inventory stats (totals, shapes, colors)
const stats = await fetch("${PUBLIC_BASE}/stats", {
  headers: { "X-Api-Key": "${key}" }
}).then(r => r.json());`;

const CODE_SINGLE = (key: string) =>
`// Single diamond by Stock ID
const diamond = await fetch("${PUBLIC_BASE}/FLX-001", {
  headers: { "X-Api-Key": "${key}" }
}).then(r => r.json());`;

export default function AdminApiKeys() {
  const [adminSecret, setAdminSecret] = useState(
    () => sessionStorage.getItem("flx_admin_secret") ?? ""
  );
  const [secretInput, setSecretInput] = useState("");
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(false);
  const [authError, setAuthError] = useState("");

  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState<NewKey | null>(null);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [activeTab, setActiveTab] = useState<"keys" | "docs">("keys");
  const [docsKey, setDocsKey] = useState("");
  const [codeTab, setCodeTab] = useState<"list" | "filter" | "stats" | "single">("list");

  async function checkSecret(secret: string) {
    setChecking(true); setAuthError("");
    try {
      const res = await fetch("/api/admin/api-keys", {
        headers: adminHeaders(secret),
      });
      if (res.ok) {
        sessionStorage.setItem("flx_admin_secret", secret);
        setAdminSecret(secret);
        setAuthed(true);
        const j = await res.json() as { data: ApiKey[] };
        setKeys(j.data);
      } else {
        setAuthError("Invalid admin secret.");
      }
    } catch {
      setAuthError("Could not reach API server.");
    }
    setChecking(false);
  }

  useEffect(() => {
    if (adminSecret) checkSecret(adminSecret);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadKeys() {
    setLoading(true);
    const res = await fetch("/api/admin/api-keys", { headers: adminHeaders(adminSecret) });
    const j = await res.json() as { data: ApiKey[] };
    setKeys(j.data);
    setLoading(false);
  }

  async function createKey() {
    if (!newName.trim()) return;
    setCreating(true);
    const res = await fetch("/api/admin/api-keys", {
      method: "POST",
      headers: adminHeaders(adminSecret),
      body: JSON.stringify({ name: newName.trim() }),
    });
    const j = await res.json() as NewKey;
    setNewKey(j);
    setDocsKey(j.key);
    setNewName("");
    await loadKeys();
    setCreating(false);
  }

  async function revokeKey(id: string) {
    setRevoking(id);
    await fetch(`/api/admin/api-keys/${id}`, {
      method: "DELETE",
      headers: adminHeaders(adminSecret),
    });
    await loadKeys();
    setRevoking(null);
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  }

  const cell: React.CSSProperties = {
    padding: "12px 16px", borderBottom: `1px solid rgba(255,255,255,0.05)`,
    fontSize: 13, verticalAlign: "middle",
  };

  // ── Login gate ──────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 380, padding: "40px", border: `1px solid ${COLORS.border}` }}>
          <p style={{ fontSize: 10, letterSpacing: "0.45em", textTransform: "uppercase", color: COLORS.accent, marginBottom: 12 }}>
            Admin · API Keys
          </p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 400, marginBottom: 28 }}>
            Enter admin secret
          </h2>
          <p style={{ fontSize: 12, color: COLORS.muted, marginBottom: 20, lineHeight: 1.6 }}>
            Set the <code style={{ fontFamily: "monospace", color: COLORS.accent }}>ADMIN_SECRET</code> environment variable in Replit Secrets, then enter it here.
          </p>
          <input
            type="password"
            value={secretInput}
            onChange={e => setSecretInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && checkSecret(secretInput)}
            placeholder="admin secret…"
            style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: `1px solid ${COLORS.border}`, color: COLORS.text, padding: "10px 14px", fontSize: 13, outline: "none", marginBottom: 12, boxSizing: "border-box" }}
          />
          {authError && <p style={{ fontSize: 12, color: COLORS.danger, marginBottom: 12 }}>{authError}</p>}
          <button
            onClick={() => checkSecret(secretInput)}
            disabled={checking || !secretInput}
            style={{ width: "100%", background: COLORS.accent, border: "none", color: "#fff", padding: "12px", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", cursor: checking ? "wait" : "pointer" }}
          >
            {checking ? "Checking…" : "Continue"}
          </button>
        </div>
      </div>
    );
  }

  const codeMap = {
    list:   CODE_FETCH(docsKey || "YOUR_API_KEY"),
    filter: CODE_FILTER(docsKey || "YOUR_API_KEY"),
    stats:  CODE_STATS(docsKey || "YOUR_API_KEY"),
    single: CODE_SINGLE(docsKey || "YOUR_API_KEY"),
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'Inter', sans-serif", color: COLORS.text }}>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${COLORS.border}`, padding: "28px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 10, letterSpacing: "0.45em", textTransform: "uppercase", color: COLORS.accent, marginBottom: 6 }}>
            Admin · Diamond API
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, margin: 0 }}>
            API Key Management
          </h1>
        </div>
        <Link href="/diamonds">
          <span style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: COLORS.muted, cursor: "pointer", borderBottom: `1px solid ${COLORS.border}`, paddingBottom: 2 }}>
            ← Back to Inventory
          </span>
        </Link>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 40px 80px" }}>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 36, borderBottom: `1px solid ${COLORS.border}` }}>
          {(["keys", "docs"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ background: "transparent", border: "none", borderBottom: activeTab === tab ? `2px solid ${COLORS.accent}` : "2px solid transparent", color: activeTab === tab ? COLORS.text : COLORS.muted, padding: "10px 24px", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", cursor: "pointer", marginBottom: -1 }}>
              {tab === "keys" ? "API Keys" : "Integration Docs"}
            </button>
          ))}
        </div>

        {/* ── Keys tab ──────────────────────────────────────────────────────── */}
        {activeTab === "keys" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            {/* New key revealed */}
            <AnimatePresence>
              {newKey && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ border: `1px solid rgba(34,197,94,0.4)`, background: "rgba(34,197,94,0.06)", padding: "20px 24px", marginBottom: 28 }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <p style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: COLORS.success }}>
                      ✓ Key created — copy it now
                    </p>
                    <button onClick={() => setNewKey(null)} style={{ background: "transparent", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 16 }}>×</button>
                  </div>
                  <p style={{ fontSize: 12, color: COLORS.muted, marginBottom: 14, lineHeight: 1.6 }}>
                    {newKey.warning}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <code style={{ flex: 1, background: "rgba(0,0,0,0.3)", padding: "10px 14px", fontSize: 12, fontFamily: "monospace", color: COLORS.success, wordBreak: "break-all" }}>
                      {newKey.key}
                    </code>
                    <button
                      onClick={() => copyText(newKey.key)}
                      style={{ background: copiedKey ? COLORS.success : COLORS.accent, border: "none", color: "#fff", padding: "10px 20px", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}
                    >
                      {copiedKey ? "Copied!" : "Copy key"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Create form */}
            <div style={{ display: "flex", gap: 12, marginBottom: 36 }}>
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && createKey()}
                placeholder="Key name  (e.g. Partner Website, ERP System)"
                style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: `1px solid ${COLORS.border}`, color: COLORS.text, padding: "12px 16px", fontSize: 13, outline: "none" }}
              />
              <button
                onClick={createKey}
                disabled={creating || !newName.trim()}
                style={{ background: COLORS.accent, border: "none", color: "#fff", padding: "12px 28px", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", cursor: creating ? "wait" : "pointer", opacity: !newName.trim() ? 0.5 : 1 }}
              >
                {creating ? "Creating…" : "+ Create Key"}
              </button>
            </div>

            {/* Keys table */}
            {loading ? (
              <p style={{ color: COLORS.muted, fontSize: 13 }}>Loading…</p>
            ) : keys.length === 0 ? (
              <div style={{ border: `1px solid ${COLORS.border}`, padding: "48px", textAlign: "center" }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 8 }}>No API keys yet</p>
                <p style={{ fontSize: 13, color: COLORS.muted }}>Create a key above to start sharing your diamond inventory.</p>
              </div>
            ) : (
              <div style={{ border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${COLORS.border}`, background: "rgba(28,169,201,0.04)" }}>
                      {["Name", "Key prefix", "Status", "Created", "Last used", ""].map(h => (
                        <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", color: COLORS.muted, fontWeight: 500, whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {keys.map(k => (
                      <tr key={k.id} style={{ opacity: k.active ? 1 : 0.4 }}>
                        <td style={{ ...cell, fontWeight: 500 }}>{k.name}</td>
                        <td style={{ ...cell, fontFamily: "monospace", fontSize: 12, color: COLORS.accent }}>{k.keyPrefix}…</td>
                        <td style={cell}>
                          <span style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: k.active ? COLORS.success : COLORS.danger }}>
                            {k.active ? "active" : "revoked"}
                          </span>
                        </td>
                        <td style={{ ...cell, color: COLORS.muted, fontSize: 12 }}>{relativeTime(k.createdAt)}</td>
                        <td style={{ ...cell, color: COLORS.muted, fontSize: 12 }}>{relativeTime(k.lastUsedAt)}</td>
                        <td style={{ ...cell, textAlign: "right" }}>
                          {k.active && (
                            <button
                              onClick={() => revokeKey(k.id)}
                              disabled={revoking === k.id}
                              style={{ background: "transparent", border: `1px solid rgba(239,68,68,0.3)`, color: COLORS.danger, padding: "5px 14px", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", cursor: "pointer" }}
                            >
                              {revoking === k.id ? "Revoking…" : "Revoke"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Endpoint info */}
            <div style={{ marginTop: 40, border: `1px solid ${COLORS.border}`, padding: "24px 28px" }}>
              <p style={{ fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: COLORS.accent, marginBottom: 16 }}>
                Public API Endpoint
              </p>
              <code style={{ display: "block", background: "rgba(0,0,0,0.3)", padding: "12px 16px", fontFamily: "monospace", fontSize: 13, color: COLORS.text, marginBottom: 8, wordBreak: "break-all" }}>
                {PUBLIC_BASE}
              </code>
              <p style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.7 }}>
                Pass your API key in the <code style={{ fontFamily: "monospace", color: COLORS.accent }}>X-Api-Key</code> header (or as <code style={{ fontFamily: "monospace", color: COLORS.accent }}>?api_key=</code> query param).
                The endpoint supports up to 500 results per page, full filtering, sorting, and returns all public diamond fields.
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Docs tab ──────────────────────────────────────────────────────── */}
        {activeTab === "docs" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            {/* Key selector */}
            <div style={{ marginBottom: 28, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 11, color: COLORS.muted, letterSpacing: "0.2em", textTransform: "uppercase" }}>Preview with key:</span>
              <select
                value={docsKey}
                onChange={e => setDocsKey(e.target.value)}
                style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${COLORS.border}`, color: COLORS.text, padding: "8px 12px", fontSize: 12, outline: "none" }}
              >
                <option value="">YOUR_API_KEY</option>
                {keys.filter(k => k.active).map(k => (
                  <option key={k.id} value="">{k.name} ({k.keyPrefix}…)</option>
                ))}
              </select>
              {docsKey && (
                <button onClick={() => { copyText(docsKey); }} style={{ background: "transparent", border: `1px solid ${COLORS.border}`, color: COLORS.muted, padding: "7px 14px", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", cursor: "pointer" }}>
                  Copy key
                </button>
              )}
            </div>

            {/* Endpoints reference */}
            <div style={{ marginBottom: 36 }}>
              <p style={{ fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: COLORS.accent, marginBottom: 16 }}>Endpoints</p>
              {[
                { method: "GET", path: "/api/v1/diamonds",         desc: "List diamonds (paginated, filterable)" },
                { method: "GET", path: "/api/v1/diamonds/stats",   desc: "Inventory summary (totals, shapes, colors, carat range)" },
                { method: "GET", path: "/api/v1/diamonds/:stockId",desc: "Single diamond by stock ID" },
              ].map(ep => (
                <div key={ep.path} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
                  <span style={{ fontSize: 10, letterSpacing: "0.2em", color: COLORS.accent, background: "rgba(28,169,201,0.12)", padding: "3px 8px", minWidth: 40, textAlign: "center" }}>{ep.method}</span>
                  <code style={{ fontFamily: "monospace", fontSize: 13, flex: 1 }}>{ep.path}</code>
                  <span style={{ fontSize: 12, color: COLORS.muted }}>{ep.desc}</span>
                </div>
              ))}
            </div>

            {/* Query params */}
            <div style={{ marginBottom: 36 }}>
              <p style={{ fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: COLORS.accent, marginBottom: 16 }}>Query Parameters — GET /api/v1/diamonds</p>
              <div style={{ border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "rgba(28,169,201,0.04)" }}>
                      {["Parameter", "Type", "Default", "Description"].map(h => (
                        <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase", color: COLORS.muted, fontWeight: 500 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["page",          "integer","1",     "Page number (1-based)"],
                      ["pageSize",      "integer","100",   "Results per page (max 500)"],
                      ["sort",          "string", "carat_asc", "carat_asc | carat_desc | color_asc | color_desc | clarity_asc | clarity_desc | stockId_asc | stockId_desc"],
                      ["type",          "string", "—",     "natural | lab | loose"],
                      ["shape",         "string", "—",     "Round | Oval | Pear | Cushion | Emerald | Princess | Marquise | Radiant | Asscher | Heart | Triangle"],
                      ["color",         "string", "—",     "D | E | F | G | H | I | J | K | L | M"],
                      ["clarity",       "string", "—",     "FL | IF | VVS1 | VVS2 | VS1 | VS2 | SI1 | SI2 | I1 | I2 | I3"],
                      ["cut",           "string", "—",     "Ideal | Excellent | Very Good | Good | Fair"],
                      ["certification", "string", "—",     "GIA | IGI | None"],
                      ["caratMin",      "number", "—",     "Minimum carat weight"],
                      ["caratMax",      "number", "—",     "Maximum carat weight"],
                      ["available",     "boolean","—",     "true | false"],
                      ["featured",      "boolean","—",     "true | false"],
                    ].map(([p, t, d, desc], i) => (
                      <tr key={p} style={{ borderBottom: `1px solid rgba(255,255,255,0.04)`, background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)" }}>
                        <td style={{ padding: "8px 14px", fontFamily: "monospace", color: COLORS.accent }}>{p}</td>
                        <td style={{ padding: "8px 14px", color: COLORS.muted }}>{t}</td>
                        <td style={{ padding: "8px 14px", fontFamily: "monospace", fontSize: 11 }}>{d}</td>
                        <td style={{ padding: "8px 14px", color: COLORS.muted, lineHeight: 1.5 }}>{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Code examples */}
            <div>
              <p style={{ fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: COLORS.accent, marginBottom: 16 }}>Code Examples</p>
              <div style={{ display: "flex", gap: 0, marginBottom: 0, borderBottom: `1px solid ${COLORS.border}` }}>
                {(["list","filter","stats","single"] as const).map(tab => (
                  <button key={tab} onClick={() => setCodeTab(tab)}
                    style={{ background: "transparent", border: "none", borderBottom: codeTab === tab ? `2px solid ${COLORS.accent}` : "2px solid transparent", color: codeTab === tab ? COLORS.text : COLORS.muted, padding: "8px 18px", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", cursor: "pointer", marginBottom: -1 }}>
                    {tab === "list" ? "List" : tab === "filter" ? "Filter" : tab === "stats" ? "Stats" : "Single"}
                  </button>
                ))}
              </div>
              <div style={{ position: "relative" }}>
                <pre style={{ background: "rgba(0,0,0,0.4)", border: `1px solid ${COLORS.border}`, borderTop: "none", padding: "20px 24px", fontSize: 12, fontFamily: "monospace", color: "rgba(255,255,255,0.85)", lineHeight: 1.7, margin: 0, overflowX: "auto", whiteSpace: "pre" }}>
                  {codeMap[codeTab]}
                </pre>
                <button
                  onClick={() => copyText(codeMap[codeTab])}
                  style={{ position: "absolute", top: 12, right: 12, background: "rgba(28,169,201,0.15)", border: `1px solid ${COLORS.border}`, color: COLORS.muted, padding: "5px 12px", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", cursor: "pointer" }}
                >
                  Copy
                </button>
              </div>

              {/* Response shape */}
              <div style={{ marginTop: 28 }}>
                <p style={{ fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: COLORS.accent, marginBottom: 12 }}>Response Shape</p>
                <pre style={{ background: "rgba(0,0,0,0.4)", border: `1px solid ${COLORS.border}`, padding: "18px 22px", fontSize: 12, fontFamily: "monospace", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: 0, overflowX: "auto" }}>{`{
  "data": [
    {
      "_id":               "diamond-FLX-001",
      "stockId":           "FLX-001",
      "type":              "natural",
      "shape":             "Round",
      "carat":             1.52,
      "color":             "D",
      "clarity":           "FL",
      "cut":               "Excellent",
      "polish":            "Excellent",
      "symmetry":          "Excellent",
      "fluorescence":      "None",
      "measurements":      "7.35×7.38×4.52 mm",
      "certification":     "GIA",
      "certificateNumber": "2476853574",
      "available":         true,
      "featured":          false
    }
  ],
  "pagination": {
    "page":       1,
    "pageSize":   100,
    "total":      45320,
    "totalPages": 454,
    "hasNext":    true,
    "hasPrev":    false
  }
}`}</pre>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
