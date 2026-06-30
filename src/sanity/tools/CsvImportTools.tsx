import { useClient } from "sanity";
import { useState, useRef } from "react";
import {
  Card,
  Box,
  Stack,
  Flex,
  Text,
  Heading,
  Button,
  Badge,
  Spinner,
  Code,
} from "@sanity/ui";
import {
  UploadIcon,
  DownloadIcon,
  CheckmarkCircleIcon,
  ErrorOutlineIcon,
  ResetIcon,
} from "@sanity/icons";

/* ── CSV column definitions ──────────────────────────────────── */
const COLUMNS = [
  { key: "stockId",          label: "stockId",          required: true,  type: "string"  },
  { key: "type",             label: "type",             required: true,  type: "string",  values: "natural|lab|loose"            },
  { key: "shape",            label: "shape",            required: true,  type: "string",  values: "Round|Oval|Princess|Cushion|Emerald|Pear|Marquise|Radiant|Asscher|Heart|Triangle" },
  { key: "carat",            label: "carat",            required: true,  type: "number"  },
  { key: "color",            label: "color",            required: true,  type: "string",  values: "D|E|F|G|H|I|J|K|L|M"         },
  { key: "clarity",          label: "clarity",          required: true,  type: "string",  values: "FL|IF|VVS1|VVS2|VS1|VS2|SI1|SI2|I1|I2|I3" },
  { key: "cut",              label: "cut",              required: false, type: "string",  values: "Ideal|Excellent|Very Good|Good|Fair" },
  { key: "polish",           label: "polish",           required: false, type: "string",  values: "Excellent|Very Good|Good|Fair" },
  { key: "symmetry",         label: "symmetry",         required: false, type: "string",  values: "Excellent|Very Good|Good|Fair" },
  { key: "fluorescence",     label: "fluorescence",     required: false, type: "string",  values: "None|Faint|Medium|Strong|Very Strong|BGM" },
  { key: "measurements",     label: "measurements",     required: false, type: "string"  },
  { key: "certification",    label: "certification",    required: false, type: "string",  values: "GIA|IGI|None"                 },
  { key: "certificateNumber",label: "certificateNumber",required: false, type: "string"  },
  { key: "tradePrice",       label: "tradePrice",       required: false, type: "number"  },
  { key: "notes",            label: "notes",            required: false, type: "string"  },
  { key: "available",        label: "available",        required: false, type: "boolean", values: "true|false"                  },
  { key: "featured",         label: "featured",         required: false, type: "boolean", values: "true|false"                  },
] as const;

type ColKey = typeof COLUMNS[number]["key"];

type ParsedRow = {
  _rowNum: number;
  _errors: string[];
  stockId: string;
  type: string;
  shape: string;
  carat: number;
  color: string;
  clarity: string;
  cut?: string;
  polish?: string;
  symmetry?: string;
  fluorescence?: string;
  measurements?: string;
  certification?: string;
  certificateNumber?: string;
  tradePrice?: number;
  notes?: string;
  available: boolean;
  featured: boolean;
};

type ImportResult = { stockId: string; status: "ok" | "error"; message?: string };

/* ── CSV parsing ─────────────────────────────────────────────── */
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let cur = "";
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuote && line[i + 1] === '"') { cur += '"'; i++; }
      else inQuote = !inQuote;
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

function parseCsv(text: string): ParsedRow[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase().trim());
  const rows: ParsedRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const vals = parseCsvLine(lines[i]);
    const raw: Record<string, string> = {};
    headers.forEach((h, idx) => { raw[h] = (vals[idx] ?? "").trim(); });

    const errors: string[] = [];
    const get = (k: string) => raw[k] ?? "";

    // Required
    if (!get("stockid") && !get("stockId")) errors.push("stockId is required");
    if (!get("type"))    errors.push("type is required");
    if (!get("shape"))   errors.push("shape is required");
    if (!get("carat"))   errors.push("carat is required");
    if (!get("color"))   errors.push("color is required");
    if (!get("clarity")) errors.push("clarity is required");

    const caratVal = parseFloat(get("carat"));
    if (!isNaN(caratVal) && caratVal <= 0) errors.push("carat must be > 0");
    const tradePriceVal = get("tradeprice") || get("tradePrice")
      ? parseFloat(get("tradeprice") || get("tradePrice"))
      : undefined;

    rows.push({
      _rowNum: i + 1,
      _errors: errors,
      stockId: get("stockid") || get("stockId"),
      type: get("type"),
      shape: get("shape"),
      carat: isNaN(caratVal) ? 0 : caratVal,
      color: get("color"),
      clarity: get("clarity"),
      cut: get("cut") || undefined,
      polish: get("polish") || undefined,
      symmetry: get("symmetry") || undefined,
      fluorescence: get("fluorescence") || undefined,
      measurements: get("measurements") || undefined,
      certification: get("certification") || undefined,
      certificateNumber: get("certificatenumber") || get("certificateNumber") || undefined,
      tradePrice: tradePriceVal && !isNaN(tradePriceVal) ? tradePriceVal : undefined,
      notes: get("notes") || undefined,
      available: get("available").toLowerCase() !== "false",
      featured: get("featured").toLowerCase() === "true",
    });
  }
  return rows;
}

/* ── Template CSV download ───────────────────────────────────── */
function downloadTemplate() {
  const header = COLUMNS.map((c) => c.key).join(",");
  const example = [
    "FLX-001", "natural", "Round", "1.52", "D", "FL",
    "Excellent", "Excellent", "Excellent", "None",
    "7.35x7.38x4.52 mm", "GIA", "2476853574",
    "28000", "", "true", "false",
  ].join(",");
  const csv = `${header}\n${example}\n`;
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "diamonds-template.csv"; a.click();
  URL.revokeObjectURL(url);
}

/* ── Main component ──────────────────────────────────────────── */
export function CsvImportTool() {
  const client = useClient({ apiVersion: "2024-01-01" });
  const fileRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ImportResult[]>([]);
  const [done, setDone] = useState(false);

  const validRows = rows.filter((r) => r._errors.length === 0);
  const errorRows = rows.filter((r) => r._errors.length > 0);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const parsed = parseCsv(text);
      setRows(parsed);
      setResults([]);
      setDone(false);
      setProgress(0);
    };
    reader.readAsText(file);
  }

  async function handleImport() {
    if (!validRows.length) return;
    setImporting(true);
    setResults([]);
    setProgress(0);

    const out: ImportResult[] = [];
    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i];
      const doc: Record<string, unknown> = {
        _id: `diamond-${row.stockId.replace(/[^a-zA-Z0-9-_]/g, "-")}`,
        _type: "diamond",
        stockId: row.stockId,
        type: row.type,
        shape: row.shape,
        carat: row.carat,
        color: row.color,
        clarity: row.clarity,
        available: row.available,
        featured: row.featured,
      };
      // Only include optional fields if they have values
      const optionals: ColKey[] = ["cut","polish","symmetry","fluorescence","measurements","certification","certificateNumber","tradePrice","notes"];
      for (const k of optionals) {
        if (row[k] !== undefined && row[k] !== "") doc[k] = row[k];
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await client.createOrReplace(doc as any);
        out.push({ stockId: row.stockId, status: "ok" });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        out.push({ stockId: row.stockId, status: "error", message: msg });
      }
      setProgress(i + 1);
      setResults([...out]);
    }
    setImporting(false);
    setDone(true);
  }

  function reset() {
    setRows([]);
    setResults([]);
    setDone(false);
    setProgress(0);
    if (fileRef.current) fileRef.current.value = "";
  }

  const successCount = results.filter((r) => r.status === "ok").length;
  const failCount    = results.filter((r) => r.status === "error").length;

  return (
    <Box padding={5} style={{ maxWidth: 900, margin: "0 auto" }}>
      <Stack space={5}>

        {/* Header */}
        <Flex align="flex-start" justify="space-between" gap={3}>
          <Stack space={3}>
            <Heading size={2}>Import Diamonds from CSV</Heading>
            <Text size={1} muted>
              Upload a CSV file to bulk-create or update diamond inventory.
              Existing diamonds with the same stockId are overwritten.
            </Text>
          </Stack>
          <Button
            icon={DownloadIcon}
            mode="ghost"
            tone="default"
            text="Download template"
            onClick={downloadTemplate}
            style={{ flexShrink: 0 }}
          />
        </Flex>

        {/* Column reference */}
        <Card padding={4} radius={2} tone="primary" border>
          <Stack space={3}>
            <Text size={1} weight="semibold">CSV column reference</Text>
            <Box style={{ overflowX: "auto" }}>
              <table style={{ borderCollapse: "collapse", fontSize: 12, width: "100%" }}>
                <thead>
                  <tr>
                    {["Column", "Required", "Accepted values"].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "4px 10px", borderBottom: "1px solid rgba(0,0,0,0.1)", whiteSpace: "nowrap" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COLUMNS.map((col) => (
                    <tr key={col.key} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                      <td style={{ padding: "3px 10px" }}><Code size={1}>{col.key}</Code></td>
                      <td style={{ padding: "3px 10px" }}>
                        <Badge tone={col.required ? "critical" : "default"} fontSize={0}>
                          {col.required ? "required" : "optional"}
                        </Badge>
                      </td>
                      <td style={{ padding: "3px 10px", color: "rgba(0,0,0,0.55)", fontFamily: "monospace" }}>
                        {"values" in col ? col.values : col.type}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Stack>
        </Card>

        {/* Upload area */}
        {!rows.length && (
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e: React.DragEvent<HTMLDivElement>) => e.preventDefault()}
            onDrop={(e: React.DragEvent<HTMLDivElement>) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (ev) => {
                const text = ev.target?.result as string;
                setRows(parseCsv(text));
                setResults([]); setDone(false); setProgress(0);
              };
              reader.readAsText(file);
            }}
            style={{
              border: "2px dashed rgba(0,0,0,0.15)",
              borderRadius: 4,
              padding: 48,
              textAlign: "center",
              cursor: "pointer",
              background: "rgba(0,0,0,0.02)",
              transition: "background 0.15s",
            }}
          >
            <Stack space={3} style={{ alignItems: "center" }}>
              <Text size={3} style={{ opacity: 0.35 }}>⬆</Text>
              <Text size={2} weight="semibold">Click to upload a CSV file</Text>
              <Text size={1} muted>or drag a .csv file here</Text>
            </Stack>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              style={{ display: "none" }}
              onChange={handleFile}
            />
          </div>
        )}

        {/* Parsed rows preview */}
        {rows.length > 0 && !done && (
          <Stack space={4}>
            <Flex align="center" gap={3} justify="space-between">
              <Flex gap={3} align="center">
                <Text size={1} weight="semibold">{rows.length} rows parsed</Text>
                {validRows.length > 0 && (
                  <Badge tone="positive">{validRows.length} valid</Badge>
                )}
                {errorRows.length > 0 && (
                  <Badge tone="critical">{errorRows.length} with errors</Badge>
                )}
              </Flex>
              <Button
                icon={ResetIcon}
                mode="ghost"
                tone="default"
                text="Clear"
                onClick={reset}
              />
            </Flex>

            {/* Error rows */}
            {errorRows.length > 0 && (
              <Card padding={3} tone="critical" radius={2} border>
                <Stack space={2}>
                  <Text size={1} weight="semibold">Rows with errors (will be skipped)</Text>
                  {errorRows.map((r) => (
                    <Text key={r._rowNum} size={1}>
                      Row {r._rowNum}: {r._errors.join(", ")}
                    </Text>
                  ))}
                </Stack>
              </Card>
            )}

            {/* Valid rows table */}
            {validRows.length > 0 && (
              <Card padding={0} radius={2} border style={{ overflow: "hidden" }}>
                <Box style={{ overflowX: "auto" }}>
                  <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 12 }}>
                    <thead style={{ background: "rgba(0,0,0,0.04)" }}>
                      <tr>
                        {["Stock ID", "Type", "Shape", "Carat", "Color", "Clarity", "Cut", "Cert", "Cert #", "Price (AUD)", "Available", "Featured"].map((h) => (
                          <th key={h} style={{ padding: "8px 12px", textAlign: "left", whiteSpace: "nowrap", fontWeight: 600, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {validRows.map((r) => (
                        <tr key={r._rowNum} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                          <td style={{ padding: "7px 12px" }}><Code size={0}>{r.stockId}</Code></td>
                          <td style={{ padding: "7px 12px" }}>{r.type}</td>
                          <td style={{ padding: "7px 12px" }}>{r.shape}</td>
                          <td style={{ padding: "7px 12px" }}>{r.carat}</td>
                          <td style={{ padding: "7px 12px" }}>{r.color}</td>
                          <td style={{ padding: "7px 12px" }}>{r.clarity}</td>
                          <td style={{ padding: "7px 12px" }}>{r.cut ?? "—"}</td>
                          <td style={{ padding: "7px 12px" }}>{r.certification ?? "—"}</td>
                          <td style={{ padding: "7px 12px" }}>{r.certificateNumber ?? "—"}</td>
                          <td style={{ padding: "7px 12px" }}>{r.tradePrice != null ? `$${r.tradePrice.toLocaleString()}` : "—"}</td>
                          <td style={{ padding: "7px 12px" }}>{r.available ? "✓" : "✗"}</td>
                          <td style={{ padding: "7px 12px" }}>{r.featured ? "✓" : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              </Card>
            )}

            {/* Import button */}
            {validRows.length > 0 && (
              <Flex gap={3} align="center">
                <Button
                  icon={importing ? undefined : UploadIcon}
                  tone="primary"
                  text={
                    importing
                      ? `Importing ${progress} / ${validRows.length}…`
                      : `Import ${validRows.length} diamond${validRows.length !== 1 ? "s" : ""}`
                  }
                  onClick={handleImport}
                  disabled={importing}
                  style={{ minWidth: 200 }}
                />
                {importing && <Spinner />}
              </Flex>
            )}
          </Stack>
        )}

        {/* Results */}
        {done && (
          <Stack space={4}>
            <Card
              padding={4}
              radius={2}
              tone={failCount === 0 ? "positive" : "caution"}
              border
            >
              <Flex gap={3} align="center">
                {failCount === 0
                  ? <CheckmarkCircleIcon style={{ color: "green", fontSize: 22 }} />
                  : <ErrorOutlineIcon style={{ color: "orange", fontSize: 22 }} />
                }
                <Stack space={1}>
                  <Text size={2} weight="semibold">
                    {failCount === 0
                      ? `✅ All ${successCount} diamonds imported successfully`
                      : `${successCount} imported, ${failCount} failed`
                    }
                  </Text>
                  <Text size={1} muted>
                    Diamonds are now available in the Diamonds section of the Studio.
                  </Text>
                </Stack>
              </Flex>
            </Card>

            {failCount > 0 && (
              <Card padding={3} tone="critical" radius={2} border>
                <Stack space={2}>
                  <Text size={1} weight="semibold">Failed rows</Text>
                  {results.filter((r) => r.status === "error").map((r) => (
                    <Text key={r.stockId} size={1}>
                      {r.stockId}: {r.message}
                    </Text>
                  ))}
                </Stack>
              </Card>
            )}

            <Flex gap={3}>
              <Button
                icon={ResetIcon}
                mode="ghost"
                text="Import another file"
                onClick={reset}
              />
            </Flex>
          </Stack>
        )}

      </Stack>
    </Box>
  );
}
