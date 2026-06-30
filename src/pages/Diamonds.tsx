import { useState, useMemo, useRef } from "react";
  import { motion, AnimatePresence } from "framer-motion";
  import emailjs from "@emailjs/browser";
  import { useSanityQuery } from "@/lib/useSanityData";
  import { isSanityConfigured } from "@/lib/sanity";
  import { DIAMONDS_QUERY } from "@/lib/sanity-queries";
  import { Link, useLocation } from "wouter";
  import { Button } from "@/components/ui/button";
  import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
  import { useShortlist } from "@/contexts/ShortlistContext";
  import { useAuth } from "@/contexts/AuthContext";
  import type { Diamond } from "@/lib/diamond_types";

  /* ── EmailJS config ─────────────────────────────────────── */
  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
  const EMAILJS_OWNER_TMPL = import.meta.env.VITE_EMAILJS_OWNER_TMPL || "";
  const EMAILJS_BUYER_TMPL = import.meta.env.VITE_EMAILJS_BUYER_TMPL || "";
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || "";
  const emailjsConfigured  = !!(EMAILJS_SERVICE_ID && EMAILJS_OWNER_TMPL && EMAILJS_BUYER_TMPL && EMAILJS_PUBLIC_KEY);

  function formatStonesList(stones: Diamond[]): string {
    return stones.map((d, i) =>
      `${i + 1}. ${d.stockId} — ${d.carat.toFixed(2)}ct ${d.shape} | ${d.color}/${d.clarity}/${d.cut} | ${d.certification}`
    ).join("\n");
  }

  type Category = "natural" | "lab" | "loose" | "custom";
  type Certification = "GIA" | "IGI" | "None";
  
  const DIAMONDS: Diamond[] = [
    { id:  1, stockId:"FLX-N-001", type:"natural", shape:"Round",    carat:1.52, color:"D", clarity:"FL",   cut:"Ideal",     polish:"Excellent", symmetry:"Excellent", fluorescence:"None",   measurements:"7.35×7.38×4.52 mm",  image:"/diamond-1.png", certification:"GIA" },
    { id:  2, stockId:"FLX-N-002", type:"natural", shape:"Oval",     carat:2.01, color:"E", clarity:"IF",   cut:"Excellent", polish:"Excellent", symmetry:"Excellent", fluorescence:"None",   measurements:"10.35×7.42×4.49 mm", image:"/diamond-2.png", certification:"GIA" },
    { id:  3, stockId:"FLX-N-003", type:"natural", shape:"Emerald",  carat:3.15, color:"F", clarity:"VVS1", cut:"Excellent", polish:"Excellent", symmetry:"Excellent", fluorescence:"None",   measurements:"10.52×7.68×4.82 mm", image:"/diamond-3.png", certification:"GIA" },
    { id:  4, stockId:"FLX-N-004", type:"natural", shape:"Pear",     carat:1.80, color:"G", clarity:"VVS2", cut:"Excellent", polish:"Excellent", symmetry:"Very Good", fluorescence:"Faint",  measurements:"10.22×6.51×3.98 mm", image:"/diamond-4.png", certification:"GIA" },
    { id:  5, stockId:"FLX-N-005", type:"natural", shape:"Princess", carat:1.22, color:"D", clarity:"IF",   cut:"Ideal",     polish:"Excellent", symmetry:"Excellent", fluorescence:"None",   measurements:"5.51×5.48×3.72 mm",  image:"/diamond-5.png", certification:"GIA" },
    { id:  6, stockId:"FLX-N-006", type:"natural", shape:"Cushion",  carat:2.42, color:"E", clarity:"VVS1", cut:"Excellent", polish:"Excellent", symmetry:"Excellent", fluorescence:"None",   measurements:"8.52×7.94×5.08 mm",  image:"/diamond-6.png", certification:"GIA" },
    { id:  7, stockId:"FLX-N-007", type:"natural", shape:"Marquise", carat:1.65, color:"F", clarity:"VS1",  cut:"Excellent", polish:"Excellent", symmetry:"Excellent", fluorescence:"None",   measurements:"13.12×6.85×4.05 mm", image:"/diamond-1.png", certification:"GIA" },
    { id:  8, stockId:"FLX-N-008", type:"natural", shape:"Radiant",  carat:3.02, color:"D", clarity:"FL",   cut:"Ideal",     polish:"Excellent", symmetry:"Excellent", fluorescence:"None",   measurements:"9.52×8.88×5.72 mm",  image:"/diamond-2.png", certification:"GIA" },
    { id:  9, stockId:"FLX-N-009", type:"natural", shape:"Asscher",  carat:2.15, color:"E", clarity:"VVS2", cut:"Excellent", polish:"Excellent", symmetry:"Excellent", fluorescence:"None",   measurements:"7.42×7.38×4.84 mm",  image:"/diamond-3.png", certification:"IGI" },
    { id: 10, stockId:"FLX-N-010", type:"natural", shape:"Heart",    carat:1.45, color:"G", clarity:"VS1",  cut:"Very Good", polish:"Very Good",  symmetry:"Very Good",  fluorescence:"Faint",  measurements:"7.88×8.12×4.82 mm",  image:"/diamond-4.png", certification:"IGI" },
    { id: 11, stockId:"FLX-N-011", type:"natural", shape:"Round",    carat:3.05, color:"D", clarity:"IF",   cut:"Ideal",     polish:"Excellent", symmetry:"Excellent", fluorescence:"None",   measurements:"9.18×9.22×5.58 mm",  image:"/diamond-5.png", certification:"GIA" },
    { id: 12, stockId:"FLX-N-012", type:"natural", shape:"Oval",     carat:1.48, color:"E", clarity:"VVS1", cut:"Excellent", polish:"Excellent", symmetry:"Excellent", fluorescence:"None",   measurements:"9.82×6.85×4.12 mm",  image:"/diamond-6.png", certification:"GIA" },
    { id: 13, stockId:"FLX-N-013", type:"natural", shape:"Triangle", carat:0.85, color:"F", clarity:"VS2",  cut:"Very Good", polish:"Very Good",  symmetry:"Very Good",  fluorescence:"None",   measurements:"6.22×6.18×3.28 mm",  image:"/diamond-1.png", certification:"IGI" },
    { id: 14, stockId:"FLX-N-014", type:"natural", shape:"Cushion",  carat:1.92, color:"D", clarity:"IF",   cut:"Excellent", polish:"Excellent", symmetry:"Excellent", fluorescence:"None",   measurements:"7.78×7.62×4.92 mm",  image:"/diamond-2.png", certification:"GIA" },
    { id: 15, stockId:"FLX-N-015", type:"natural", shape:"Pear",     carat:2.88, color:"E", clarity:"FL",   cut:"Ideal",     polish:"Excellent", symmetry:"Excellent", fluorescence:"None",   measurements:"12.42×8.15×4.98 mm", image:"/diamond-3.png", certification:"GIA" },
    { id: 16, stockId:"FLX-N-016", type:"natural", shape:"Radiant",  carat:1.78, color:"F", clarity:"VVS2", cut:"Excellent", polish:"Excellent", symmetry:"Excellent", fluorescence:"Faint",  measurements:"7.42×6.88×4.72 mm",  image:"/diamond-4.png", certification:"IGI" },
    { id: 17, stockId:"FLX-L-001", type:"lab",     shape:"Round",    carat:2.50, color:"D", clarity:"FL",   cut:"Ideal",     polish:"Excellent", symmetry:"Excellent", fluorescence:"None",   measurements:"8.72×8.75×5.28 mm",  image:"/diamond-5.png", certification:"IGI" },
    { id: 18, stockId:"FLX-L-002", type:"lab",     shape:"Cushion",  carat:4.00, color:"E", clarity:"IF",   cut:"Excellent", polish:"Excellent", symmetry:"Excellent", fluorescence:"None",   measurements:"9.42×8.52×6.12 mm",  image:"/diamond-6.png", certification:"IGI" },
    { id: 19, stockId:"FLX-L-003", type:"lab",     shape:"Round",    carat:1.05, color:"F", clarity:"VVS1", cut:"Excellent", polish:"Excellent", symmetry:"Excellent", fluorescence:"None",   measurements:"6.48×6.52×3.92 mm",  image:"/diamond-1.png", certification:"IGI" },
    { id: 20, stockId:"FLX-L-004", type:"lab",     shape:"Oval",     carat:1.75, color:"D", clarity:"VS1",  cut:"Very Good", polish:"Very Good",  symmetry:"Very Good",  fluorescence:"Faint",  measurements:"10.08×7.12×4.32 mm", image:"/diamond-2.png", certification:"IGI" },
    { id: 21, stockId:"FLX-L-005", type:"lab",     shape:"Radiant",  carat:2.85, color:"D", clarity:"FL",   cut:"Ideal",     polish:"Excellent", symmetry:"Excellent", fluorescence:"None",   measurements:"9.22×8.52×5.68 mm",  image:"/diamond-3.png", certification:"IGI" },
    { id: 22, stockId:"FLX-L-006", type:"lab",     shape:"Princess", carat:1.58, color:"E", clarity:"VVS2", cut:"Excellent", polish:"Excellent", symmetry:"Excellent", fluorescence:"None",   measurements:"6.12×6.08×4.18 mm",  image:"/diamond-4.png", certification:"IGI" },
    { id: 23, stockId:"FLX-L-007", type:"lab",     shape:"Emerald",  carat:3.42, color:"F", clarity:"VVS1", cut:"Excellent", polish:"Excellent", symmetry:"Excellent", fluorescence:"None",   measurements:"11.02×7.85×4.98 mm", image:"/diamond-5.png", certification:"IGI" },
    { id: 24, stockId:"FLX-L-008", type:"lab",     shape:"Pear",     carat:2.18, color:"D", clarity:"IF",   cut:"Excellent", polish:"Excellent", symmetry:"Excellent", fluorescence:"None",   measurements:"11.52×7.12×4.38 mm", image:"/diamond-6.png", certification:"IGI" },
    /* ── Loose diamonds (no certification) ── */
    { id: 25, stockId:"FLX-S-001", type:"loose",   shape:"Round",    carat:0.75, color:"G", clarity:"VS2",  cut:"Very Good", polish:"Very Good",  symmetry:"Very Good",  fluorescence:"Medium", measurements:"5.88×5.92×3.58 mm",  image:"/diamond-1.png", certification:"None" },
    { id: 26, stockId:"FLX-S-002", type:"loose",   shape:"Round",    carat:5.10, color:"H", clarity:"SI1",  cut:"Good",      polish:"Good",        symmetry:"Good",       fluorescence:"Strong", measurements:"11.12×11.18×6.72 mm",image:"/diamond-2.png", certification:"None" },
    { id: 27, stockId:"FLX-S-003", type:"loose",   shape:"Oval",     carat:3.62, color:"I", clarity:"SI2",  cut:"Very Good", polish:"Very Good",  symmetry:"Very Good",  fluorescence:"BGM",    measurements:"12.28×8.82×5.32 mm", image:"/diamond-3.png", certification:"None" },
    { id: 28, stockId:"FLX-S-004", type:"loose",   shape:"Princess", carat:8.50, color:"J", clarity:"I1",   cut:"Good",      polish:"Good",        symmetry:"Good",       fluorescence:"BGM",    measurements:"12.48×12.38×8.22 mm",image:"/diamond-4.png", certification:"None" },
    { id: 29, stockId:"FLX-S-005", type:"loose",   shape:"Cushion",  carat:12.25,color:"F", clarity:"VS1",  cut:"Excellent", polish:"Excellent", symmetry:"Excellent", fluorescence:"None",   measurements:"15.52×14.88×9.42 mm",image:"/diamond-5.png", certification:"None" },
    { id: 30, stockId:"FLX-S-006", type:"loose",   shape:"Radiant",  carat:18.80,color:"D", clarity:"VVS1", cut:"Ideal",     polish:"Excellent", symmetry:"Excellent", fluorescence:"None",   measurements:"19.82×17.92×11.48 mm",image:"/diamond-6.png", certification:"None" },
    { id: 31, stockId:"FLX-S-007", type:"loose",   shape:"Emerald",  carat:6.45, color:"E", clarity:"VVS2", cut:"Excellent", polish:"Excellent", symmetry:"Excellent", fluorescence:"Faint",  measurements:"13.82×10.22×6.48 mm",image:"/diamond-1.png", certification:"None" },
    { id: 32, stockId:"FLX-S-008", type:"loose",   shape:"Pear",     carat:9.30, color:"G", clarity:"VS2",  cut:"Very Good", polish:"Very Good",  symmetry:"Very Good",  fluorescence:"Medium", measurements:"18.42×11.82×7.12 mm",image:"/diamond-2.png", certification:"None" },
  ];
  
  /* ── Shape data with SVG paths ──────────────────────────── */
  const SHAPE_DATA = [
    { id: "All",      label: "All",      element: null },
    { id: "Round",    label: "Round",    element: <circle cx="50" cy="50" r="44" /> },
    { id: "Oval",     label: "Oval",     element: <ellipse cx="50" cy="50" rx="30" ry="44" /> },
    { id: "Princess", label: "Princess", element: <rect x="8" y="8" width="84" height="84" /> },
    { id: "Cushion",  label: "Cushion",  element: <rect x="8" y="8" width="84" height="84" rx="14" /> },
    { id: "Emerald",  label: "Emerald",  element: <polygon points="26,8 74,8 92,26 92,74 74,92 26,92 8,74 8,26" /> },
    { id: "Pear",     label: "Pear",     element: <path d="M50,90 Q22,74 10,50 Q10,16 50,8 Q90,16 90,50 Q78,74 50,90Z" /> },
    { id: "Marquise", label: "Marquise", element: <path d="M50,4 Q92,28 92,50 Q92,72 50,96 Q8,72 8,50 Q8,28 50,4Z" /> },
    { id: "Radiant",  label: "Radiant",  element: <polygon points="22,8 78,8 92,22 92,78 78,92 22,92 8,78 8,22" /> },
    { id: "Asscher",  label: "Asscher",  element: <polygon points="28,8 72,8 92,28 92,72 72,92 28,92 8,72 8,28" /> },
    { id: "Heart",    label: "Heart",    element: <path d="M50,84 Q16,62 8,38 Q8,14 24,8 Q40,4 50,24 Q60,4 76,8 Q92,14 92,38 Q84,62 50,84Z" /> },
    { id: "Triangle", label: "Triangle", element: <polygon points="50,6 93,90 7,90" /> },
  ];
  
  /* ── Filter constants ────────────────────────────────────── */
  const COLOR_GRADES   = ["D","E","F","G","H","I","J","K","L","M"];
  const CLARITIES      = ["All","FL","IF","VVS1","VVS2","VS1","VS2","SI1","SI2","I1","I2","I3"];
  const CUTS           = ["All","Ideal","Excellent","Very Good","Good","Fair"];
  const FLUORESCENCE_OPTIONS = ["All", "None", "Faint", "Medium", "Strong", "Very Strong", "BGM"];
  /* ── Certification options ── */
  const CERTIFICATION_OPTIONS: Array<{ value: Certification | "All"; label: string }> = [
    { value: "All",  label: "All" },
    { value: "GIA",  label: "GIA" },
    { value: "IGI",  label: "IGI" },
    { value: "None", label: "No Certificate" },
  ];
  
  const COLOR_TINT: Record<string, string> = {
    D:"#ECF7FF", E:"#F4F4FF", F:"#F8FFF5", G:"#FFFEF0",
    H:"#FFF9E0", I:"#FFF5CC", J:"#FFEFB5", K:"#FFE89E",
    L:"#FFE080", M:"#FFDA6A",
  };
  const COLOR_NAME: Record<string, string> = {
    D:"Colorless", E:"Colorless", F:"Colorless",
    G:"Near Colorless", H:"Near Colorless", I:"Near Colorless",
    J:"Near Colorless", K:"Faint", L:"Faint", M:"Faint",
  };
  
  /* ── GIA Clarity — FL/IF are FLX specialty ────────────────── */
  const FLX_GRADES = new Set(["FL","IF"]);
  
  /* ── Filter matchers ────────────────────────────────────── */
  function matchesColor(d: Diamond, filter: string) {
    if (filter === "All") return true;
    return d.color === filter;
  }
  function matchesClarity(d: Diamond, filter: string) {
    if (filter === "All") return true;
    return d.clarity === filter;
  }
  function matchesCut(d: Diamond, filter: string) {
    if (filter === "All") return true;
    return d.cut === filter;
  }
  function matchesCarat(d: Diamond, min: number, max: number) {
    return d.carat >= min && d.carat <= max;
  }
  /* ── NEW matchers ── */
  function matchesFluorescence(d: Diamond, filter: string) {
    if (filter === "All") return true;
    return d.fluorescence === filter;
  }
  function matchesCertification(d: Diamond, filter: string) {
    if (filter === "All") return true;
    return d.certification === filter;
  }
  
  /* ── Shape Icon button ────────────────────────────────────── */
  function ShapeBtn({ id, label, element, active, onClick }: {
    id: string; label: string; element: React.ReactNode | null;
    active: boolean; onClick: () => void;
  }) {
    return (
      <button
        onClick={onClick}
        className="flex flex-col items-center gap-1.5 transition-all group"
        title={label}
      >
        <div
          className="w-12 h-12 flex items-center justify-center transition-all"
          style={{
            border: `1px solid ${active ? "#1CA9C9" : "rgba(255,255,255,0.12)"}`,
            background: active ? "rgba(28,169,201,0.12)" : "rgba(255,255,255,0.03)",
          }}
        >
          {element ? (
            <svg
              viewBox="0 0 100 100"
              width="28" height="28"
              fill={active ? "rgba(28,169,201,0.3)" : "rgba(255,255,255,0.12)"}
              stroke={active ? "#1CA9C9" : "rgba(255,255,255,0.45)"}
              strokeWidth="3"
            >
              {element}
            </svg>
          ) : (
            <span style={{ fontSize: "10px", fontWeight: 600, color: active ? "#1CA9C9" : "rgba(255,255,255,0.45)", letterSpacing: "0.1em" }}>ALL</span>
          )}
        </div>
        <span
          className="text-[8px] uppercase tracking-[0.25em] font-medium"
          style={{ color: active ? "#1CA9C9" : "rgba(255,255,255,0.35)" }}
        >
          {label}
        </span>
      </button>
    );
  }
  
  /* ── Color swatch button D–K ──────────────────────────────── */
  function ColorBtn({ grade, active, onClick }: { grade: string; active: boolean; onClick: () => void }) {
    const tint = COLOR_TINT[grade] ?? "#FAFAFA";
    return (
      <button
        onClick={onClick}
        title={`${grade} — ${COLOR_NAME[grade]}`}
        className="flex flex-col items-center gap-1 transition-all"
      >
        <div
          className="w-10 h-10 flex items-center justify-center transition-all"
          style={{
            background: active ? tint : "rgba(255,255,255,0.05)",
            border: `1px solid ${active ? "#1CA9C9" : "rgba(255,255,255,0.12)"}`,
          }}
        >
          <svg viewBox="0 0 100 120" width="18" height="22">
            <polygon
              points="50,4 88,30 88,70 50,96 12,70 12,30"
              fill={active ? tint : "rgba(255,255,255,0.15)"}
              stroke={active ? "#1CA9C9" : "rgba(255,255,255,0.35)"}
              strokeWidth="3"
            />
            <polygon points="50,4 88,30 50,54 12,30" fill={active ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.08)"} strokeWidth="0" />
          </svg>
        </div>
        <span
          className="text-[8px] font-semibold"
          style={{ color: active ? "#1CA9C9" : "rgba(255,255,255,0.4)", letterSpacing: "0.12em" }}
        >
          {grade}
        </span>
      </button>
    );
  }
  
  /* ── Diamond SVG for cards ───────────────────────────────── */
  function DiamondSVG({ shape, color }: { shape: string; color: string }) {
    const fill = `${COLOR_TINT[color] ?? "#E8F4FF"}`;
    const stroke = "rgba(184,214,240,0.7)";
    const bright = "rgba(255,255,255,0.55)";
    const facet = "rgba(184,214,240,0.3)";
  
    const shapes: Record<string, React.ReactNode> = {
      Round: (
        <>
          <circle cx="100" cy="100" r="88" fill={fill} fillOpacity="0.12" stroke={stroke} strokeWidth="1.2" />
          <polygon points="100,38 120,46 128,66 120,86 100,94 80,86 72,66 80,46"
            fill={bright} fillOpacity="0.22" stroke={bright} strokeWidth="1" />
          <line x1="100" y1="38" x2="100" y2="12" stroke={facet} strokeWidth="0.8" />
          <line x1="120" y1="46" x2="144" y2="28" stroke={facet} strokeWidth="0.8" />
          <line x1="128" y1="66" x2="188" y2="66" stroke={facet} strokeWidth="0.8" />
          <line x1="120" y1="86" x2="144" y2="110" stroke={facet} strokeWidth="0.8" />
          <line x1="100" y1="94" x2="100" y2="188" stroke={facet} strokeWidth="0.8" />
          <line x1="80" y1="86" x2="56" y2="110" stroke={facet} strokeWidth="0.8" />
          <line x1="72" y1="66" x2="12" y2="66" stroke={facet} strokeWidth="0.8" />
          <line x1="80" y1="46" x2="56" y2="28" stroke={facet} strokeWidth="0.8" />
          <line x1="100" y1="12" x2="144" y2="28" stroke={facet} strokeWidth="0.5" />
          <line x1="144" y1="28" x2="188" y2="66" stroke={facet} strokeWidth="0.5" />
          <line x1="188" y1="66" x2="144" y2="110" stroke={facet} strokeWidth="0.5" />
          <line x1="144" y1="110" x2="100" y2="188" stroke={facet} strokeWidth="0.5" />
          <line x1="100" y1="188" x2="56" y2="110" stroke={facet} strokeWidth="0.5" />
          <line x1="56" y1="110" x2="12" y2="66" stroke={facet} strokeWidth="0.5" />
          <line x1="12" y1="66" x2="56" y2="28" stroke={facet} strokeWidth="0.5" />
          <line x1="56" y1="28" x2="100" y2="12" stroke={facet} strokeWidth="0.5" />
          <ellipse cx="88" cy="56" rx="8" ry="5" fill="rgba(255,255,255,0.4)" transform="rotate(-30,88,56)" />
        </>
      ),
      Oval: (
        <>
          <ellipse cx="100" cy="100" rx="60" ry="88" fill={fill} fillOpacity="0.12" stroke={stroke} strokeWidth="1.2" />
          <polygon points="100,38 116,52 120,70 116,88 100,102 84,88 80,70 84,52"
            fill={bright} fillOpacity="0.22" stroke={bright} strokeWidth="1" />
          <line x1="100" y1="12" x2="100" y2="38" stroke={facet} strokeWidth="0.8" />
          <line x1="100" y1="102" x2="100" y2="188" stroke={facet} strokeWidth="0.8" />
          <line x1="160" y1="70" x2="120" y2="70" stroke={facet} strokeWidth="0.8" />
          <line x1="40" y1="70" x2="80" y2="70" stroke={facet} strokeWidth="0.8" />
          <ellipse cx="90" cy="54" rx="7" ry="4" fill="rgba(255,255,255,0.45)" transform="rotate(-25,90,54)" />
        </>
      ),
      Emerald: (
        <>
          <polygon points="30,12 170,12 188,30 188,170 170,188 30,188 12,170 12,30"
            fill={fill} fillOpacity="0.12" stroke={stroke} strokeWidth="1.2" />
          <rect x="48" y="44" width="104" height="112" fill={bright} fillOpacity="0.18" stroke={bright} strokeWidth="1" />
          <line x1="30" y1="12" x2="48" y2="44" stroke={facet} strokeWidth="0.8" />
          <line x1="170" y1="12" x2="152" y2="44" stroke={facet} strokeWidth="0.8" />
          <line x1="188" y1="30" x2="152" y2="44" stroke={facet} strokeWidth="0.8" />
          <line x1="188" y1="170" x2="152" y2="156" stroke={facet} strokeWidth="0.8" />
          <line x1="170" y1="188" x2="152" y2="156" stroke={facet} strokeWidth="0.8" />
          <line x1="30" y1="188" x2="48" y2="156" stroke={facet} strokeWidth="0.8" />
          <line x1="12" y1="170" x2="48" y2="156" stroke={facet} strokeWidth="0.8" />
          <line x1="12" y1="30" x2="48" y2="44" stroke={facet} strokeWidth="0.8" />
          <rect x="72" y="64" width="56" height="72" fill="rgba(255,255,255,0.08)" stroke={facet} strokeWidth="0.5" />
          <ellipse cx="86" cy="60" rx="8" ry="4" fill="rgba(255,255,255,0.45)" transform="rotate(-20,86,60)" />
        </>
      ),
      Princess: (
        <>
          <rect x="12" y="12" width="176" height="176" fill={fill} fillOpacity="0.12" stroke={stroke} strokeWidth="1.2" />
          <rect x="44" y="44" width="112" height="112" fill={bright} fillOpacity="0.18" stroke={bright} strokeWidth="1" />
          <line x1="12" y1="12" x2="44" y2="44" stroke={facet} strokeWidth="0.8" />
          <line x1="188" y1="12" x2="156" y2="44" stroke={facet} strokeWidth="0.8" />
          <line x1="188" y1="188" x2="156" y2="156" stroke={facet} strokeWidth="0.8" />
          <line x1="12" y1="188" x2="44" y2="156" stroke={facet} strokeWidth="0.8" />
          <ellipse cx="86" cy="58" rx="8" ry="4" fill="rgba(255,255,255,0.45)" transform="rotate(-25,86,58)" />
        </>
      ),
      Cushion: (
        <>
          <rect x="12" y="12" width="176" height="176" rx="28" fill={fill} fillOpacity="0.12" stroke={stroke} strokeWidth="1.2" />
          <polygon points="100,44 132,56 144,88 132,120 100,132 68,120 56,88 68,56"
            fill={bright} fillOpacity="0.18" stroke={bright} strokeWidth="1" />
          <line x1="68" y1="56" x2="28" y2="28" stroke={facet} strokeWidth="0.8" />
          <line x1="132" y1="56" x2="172" y2="28" stroke={facet} strokeWidth="0.8" />
          <line x1="144" y1="88" x2="186" y2="88" stroke={facet} strokeWidth="0.8" />
          <line x1="132" y1="120" x2="172" y2="172" stroke={facet} strokeWidth="0.8" />
          <line x1="100" y1="132" x2="100" y2="186" stroke={facet} strokeWidth="0.8" />
          <line x1="68" y1="120" x2="28" y2="172" stroke={facet} strokeWidth="0.8" />
          <line x1="56" y1="88" x2="14" y2="88" stroke={facet} strokeWidth="0.8" />
          <line x1="68" y1="56" x2="28" y2="28" stroke={facet} strokeWidth="0.8" />
          <ellipse cx="85" cy="60" rx="8" ry="5" fill="rgba(255,255,255,0.45)" transform="rotate(-30,85,60)" />
        </>
      ),
    };
  
    const defaultSvg = shapes[shape] ?? shapes["Round"];
  
    return (
      <svg viewBox="0 0 200 200" width="100%" height="100%">
        <defs>
          <radialGradient id={`dg-${shape}`} cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="white" stopOpacity="0.25" />
            <stop offset="100%" stopColor={fill} stopOpacity="0.05" />
          </radialGradient>
        </defs>
        {defaultSvg}
      </svg>
    );
  }
  
  /* ── Pill button (clarity/cut/fluorescence/cert) ─────────── */
  function Pill({ label, active, onClick, flx }: { label: string; active: boolean; onClick: () => void; flx?: boolean }) {
    const isFlx = flx && !active;
    return (
      <button
        onClick={onClick}
        className="shrink-0 text-[9px] uppercase tracking-[0.18em] px-4 py-1.5 transition-all font-medium"
        style={{
          borderRadius: "9999px",
          background: active ? "#1CA9C9" : isFlx ? "rgba(28,169,201,0.08)" : "rgba(255,255,255,0.05)",
          color: active ? "white" : isFlx ? "#1CA9C9" : "rgba(255,255,255,0.5)",
          border: `1px solid ${active ? "#1CA9C9" : isFlx ? "rgba(28,169,201,0.35)" : "rgba(255,255,255,0.12)"}`,
        }}
      >
        {label}
      </button>
    );
  }

  /* ── BGM warning pill ─────────────────────────────────────── */
  function BgmPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    const isBgm = label === "BGM";
    return (
      <button
        onClick={onClick}
        className="shrink-0 text-[9px] uppercase tracking-[0.18em] px-4 py-1.5 transition-all font-medium"
        style={{
          borderRadius: "9999px",
          background: active ? (isBgm ? "#4A5568" : "#1CA9C9") : isBgm ? "rgba(74,85,104,0.12)" : "rgba(255,255,255,0.05)",
          color: active ? "white" : isBgm ? "rgba(180,190,210,0.75)" : "rgba(255,255,255,0.5)",
          border: `1px solid ${active ? (isBgm ? "#4A5568" : "#1CA9C9") : isBgm ? "rgba(74,85,104,0.45)" : "rgba(255,255,255,0.12)"}`,
        }}
      >
        {label}{isBgm && !active ? " ◈" : ""}
      </button>
    );
  }

  /* ── Certification pill ───────────────────────────────────── */
  function CertPill({ value, label, active, onClick }: { value: string; label: string; active: boolean; onClick: () => void }) {
    const isNone = value === "None";
    return (
      <button
        onClick={onClick}
        className="shrink-0 text-[9px] uppercase tracking-[0.18em] px-4 py-1.5 transition-all font-medium"
        style={{
          borderRadius: "9999px",
          background: active ? "#1CA9C9" : isNone ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.05)",
          color: active ? "white" : isNone ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.5)",
          border: `1px solid ${active ? "#1CA9C9" : isNone ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.12)"}`,
          fontStyle: isNone && !active ? "italic" : "normal",
        }}
      >
        {label}
      </button>
    );
  }
  
  /* ── Premium Stone Card ───────────────────────────────────── */
  function StoneCard({ diamond, isShortlisted, onToggleShortlist, onQuickView }: {
  diamond: Diamond;
  isShortlisted: boolean;
  onToggleShortlist: () => void;
  onQuickView: () => void;
}) {
    const isFLX  = FLX_GRADES.has(diamond.clarity);
    const isBGM  = diamond.fluorescence === "BGM";
    const cardRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
  
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width  - 0.5;
      const ny = (e.clientY - rect.top)  / rect.height - 0.5;
      setTilt({ x: ny * -6, y: nx * 6 });
    };
  
    const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

    /* cert badge colors */
    const certColor = diamond.certification === "GIA" ? "#1CA9C9" : diamond.certification === "IGI" ? "#8B5CF6" : "rgba(255,255,255,0.25)";
    const certBg    = diamond.certification === "GIA" ? "rgba(28,169,201,0.12)" : diamond.certification === "IGI" ? "rgba(139,92,246,0.12)" : "rgba(255,255,255,0.04)";
    const certBorder= diamond.certification === "GIA" ? "rgba(28,169,201,0.4)"  : diamond.certification === "IGI" ? "rgba(139,92,246,0.4)"  : "rgba(255,255,255,0.1)";
  
    return (
      <motion.div
        ref={cardRef}
        className="flx-stone-card group flex flex-col"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        style={{
          background: "#021C38",
          border: "1px solid rgba(28,169,201,0.12)",
          transformStyle: "preserve-3d",
          perspective: 600,
          willChange: "transform",
        }}
      >
        {/* Top bar: stock ID + certification badge */}
        <div
          className="flex items-center justify-between px-4 py-2.5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span className="font-mono text-[9px] tracking-widest" style={{ color: "rgba(28,169,201,0.7)" }}>
            {diamond.stockId}
          </span>
          <div className="flex items-center gap-1.5">
            {diamond.certification !== "None" ? (
              <>
                {diamond.certification === "GIA" && (
                  <img src="/gia-logo.png" alt="GIA" style={{ width: "16px", height: "16px", objectFit: "contain", opacity: 0.9, mixBlendMode: "screen" }} />
                )}
                <span
                  className="text-[8px] font-semibold uppercase tracking-[0.3em] px-2 py-0.5"
                  style={{ background: certBg, border: `1px solid ${certBorder}`, color: certColor, borderRadius: "4px" }}
                >
                  {diamond.certification} Certified
                </span>
              </>
            ) : (
              <span
                className="text-[8px] font-medium uppercase tracking-[0.22em] px-2 py-0.5"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)", borderRadius: "4px", fontStyle: "italic" }}
              >
                No Certificate
              </span>
            )}
          </div>
        </div>
  
        {/* Diamond image area */}
        <div
          className="relative flex items-center justify-center"
          style={{ aspectRatio: "1", background: "radial-gradient(circle at 40% 35%, rgba(28,169,201,0.06) 0%, #011F3A 70%)", overflow: "hidden" }}
        >
          {/* Sparkle corners — shown only when no photo */}
          {!diamond.imageUrl && (
            <>
              <div className="absolute top-3 right-3 w-0.5 h-0.5 rounded-full" style={{ background: "#1CA9C9", boxShadow: "0 0 6px #1CA9C9", opacity: 0.6 }} />
              <div className="absolute bottom-5 left-4 w-0.5 h-0.5 rounded-full" style={{ background: "white", boxShadow: "0 0 4px white", opacity: 0.4 }} />
              <div className="absolute top-8 left-6 w-px h-px rounded-full" style={{ background: "#1CA9C9", boxShadow: "0 0 8px #1CA9C9", opacity: 0.5 }} />
            </>
          )}

          {/* Actual photo from Sanity — shown when available */}
          {diamond.imageUrl ? (
            <img
              src={diamond.imageUrl}
              alt={`${diamond.carat.toFixed(2)}ct ${diamond.shape} diamond`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              style={{ padding: 0 }}
            />
          ) : (
            /* Fallback: animated SVG graphic */
            <div className="flx-diamond-viewer w-full h-full flex items-center justify-center" style={{ padding: "10%" }}>
              <DiamondSVG shape={diamond.shape} color={diamond.color} />
            </div>
          )}
  
          {/* FLX conversion badge for FL/IF */}
          {isFLX && (
            <div
              className="absolute bottom-3 right-3 px-2 py-0.5"
              style={{ background: "rgba(28,169,201,0.15)", border: "1px solid rgba(28,169,201,0.35)" }}
            >
              <span className="text-[7px] uppercase tracking-[0.35em] font-semibold" style={{ color: "#1CA9C9" }}>
                IF→FL ✦
              </span>
            </div>
          )}

          {/* BGM warning badge */}
          {isBGM && (
            <div
              className="absolute bottom-3 left-3 px-2 py-0.5"
              style={{ background: "rgba(74,85,104,0.25)", border: "1px solid rgba(74,85,104,0.55)" }}
            >
              <span className="text-[7px] uppercase tracking-[0.3em] font-semibold" style={{ color: "rgba(180,190,210,0.85)" }}>
                BGM ◈
              </span>
            </div>
          )}
        </div>
  
        {/* Content */}
        <div className="flex flex-col flex-1 px-5 pb-5 pt-4 gap-4">
  
          {/* Shape heading + carat — most visible elements */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-serif text-white text-lg leading-tight">{diamond.shape}</h3>
              <p className="text-xs font-semibold tracking-widest mt-0.5" style={{ color: "#1CA9C9" }}>
                {diamond.carat.toFixed(2)} CT
              </p>
            </div>
            {/* Clarity badge — prominent for FL/IF */}
            <div className="flex flex-col items-end gap-1">
              <div
                className="px-2.5 py-1 text-[10px] font-bold tracking-widest"
                style={{
                  background: isFLX ? "rgba(28,169,201,0.15)" : "rgba(255,255,255,0.06)",
                  border: `1px solid ${isFLX ? "rgba(28,169,201,0.5)" : "rgba(255,255,255,0.1)"}`,
                  color: isFLX ? "#1CA9C9" : "rgba(255,255,255,0.55)",
                }}
              >
                {diamond.clarity}
              </div>
              <div
                className="px-2 py-0.5 text-[9px] font-semibold tracking-widest"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                {diamond.color}
              </div>
            </div>
          </div>
  
          {/* 4 C's grid — readable sizes */}
          <div
            className="grid grid-cols-4 gap-0 text-center"
            style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
          >
            {[
              { label: "Cut",     value: diamond.cut === "Very Good" ? "VG" : diamond.cut === "Excellent" ? "EX" : diamond.cut },
              { label: "Color",   value: diamond.color },
              { label: "Clarity", value: diamond.clarity },
              { label: "Carat",   value: diamond.carat.toFixed(2) },
            ].map((c, i) => (
              <div
                key={c.label}
                className="flex flex-col items-center py-3"
                style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none" }}
              >
                <span className="text-[8px] uppercase tracking-[0.2em] mb-1.5" style={{ color: "rgba(255,255,255,0.32)" }}>
                  {c.label}
                </span>
                <span
                  className="text-[13px] font-semibold"
                  style={{ color: (c.label === "Clarity" && isFLX) ? "#1CA9C9" : (c.label === "Color") ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.8)" }}
                >
                  {c.value}
                </span>
              </div>
            ))}
          </div>
  
          {/* Measurements + details */}
          <div className="space-y-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }}>
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase tracking-[0.25em]" style={{ color: "rgba(255,255,255,0.28)" }}>Measurements</span>
              <span className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.58)" }}>{diamond.measurements}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase tracking-[0.25em]" style={{ color: "rgba(255,255,255,0.28)" }}>Polish / Sym.</span>
              <span className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.58)" }}>
                {diamond.polish.replace("Excellent","EX").replace("Very Good","VG")} ·{" "}
                {diamond.symmetry.replace("Excellent","EX").replace("Very Good","VG")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase tracking-[0.25em]" style={{ color: "rgba(255,255,255,0.28)" }}>Fluorescence</span>
              <span
                className="font-mono text-[10px]"
                style={{ color: isBGM ? "rgba(180,190,210,0.75)" : "rgba(255,255,255,0.58)" }}
              >
                {diamond.fluorescence}{isBGM ? " ◈" : ""}
              </span>
            </div>
          </div>
  
          {/* CTA */}
          <div className="mt-auto flex flex-col gap-2">
            <button
              onClick={onQuickView}
              className="w-full py-2.5 text-[9px] uppercase tracking-[0.35em] font-medium transition-all"
              style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(28,169,201,0.3)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(28,169,201,0.7)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.4)"; }}
            >
              Quick View
            </button>
            <button
              onClick={onToggleShortlist}
              className="w-full py-3.5 text-[10px] uppercase tracking-[0.4em] font-semibold transition-all"
              style={isShortlisted ? {
                background: "rgba(28,169,201,0.18)",
                border: "1px solid rgba(28,169,201,0.6)",
                color: "#1CA9C9",
              } : {
                background: "rgba(28,169,201,0.08)",
                border: "1px solid rgba(28,169,201,0.3)",
                color: "#1CA9C9",
              }}
              onMouseEnter={e => {
                if (isShortlisted) {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,80,80,0.1)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,80,80,0.4)";
                  (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,140,140,0.8)";
                } else {
                  (e.currentTarget as HTMLButtonElement).style.background = "#1CA9C9";
                  (e.currentTarget as HTMLButtonElement).style.color = "white";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#1CA9C9";
                }
              }}
              onMouseLeave={e => {
                if (isShortlisted) {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(28,169,201,0.18)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(28,169,201,0.6)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#1CA9C9";
                } else {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(28,169,201,0.08)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#1CA9C9";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(28,169,201,0.3)";
                }
              }}
              data-testid="btn-shortlist"
            >
              {isShortlisted ? "✓ Shortlisted" : "Add to Shortlist"}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }
  
  /* ── Diamond table helpers ────────────────────────────────── */
  const fmt    = (v: number | undefined, dec = 2) => v != null ? v.toFixed(dec) : "—";
  const fmtInt = (v: number | undefined) => v != null ? v.toLocaleString() : "—";
  const fmtStr = (v: string | undefined | null) => v || "—";
  const discColor = (v: number | undefined) => {
    if (v == null) return "rgba(255,255,255,0.45)";
    if (v <= -10) return "#4ade80";
    if (v <= -5)  return "#86efac";
    if (v >= 0)   return "#f87171";
    return "rgba(255,255,255,0.65)";
  };

  interface ColDef {
    key: string;
    label: string;
    width: string;
    render: (d: Diamond) => React.ReactNode;
  }

  const COLS: ColDef[] = [
    { key:"stockId",  label:"Stock ID",     width:"100px", render: d => <span style={{fontFamily:"monospace",fontSize:"9px",letterSpacing:"0.18em",color:"rgba(28,169,201,0.75)"}}>{d.stockId}</span> },
    { key:"shape",    label:"Shape",        width:"88px",  render: d => <span className="font-serif" style={{fontSize:"12px",color:"white"}}>{d.shape}</span> },
    { key:"carat",    label:"Carat",        width:"56px",  render: d => <span style={{fontSize:"11px",fontWeight:700,color:"#1CA9C9",fontVariantNumeric:"tabular-nums"}}>{d.carat.toFixed(2)}</span> },
    { key:"color",    label:"Color",        width:"44px",  render: d => <span style={{fontSize:"11px",color:"rgba(255,255,255,0.75)",fontVariantNumeric:"tabular-nums"}}>{d.color}</span> },
    { key:"clarity",  label:"Clarity",      width:"52px",  render: d => <span style={{fontSize:"11px",fontWeight:700,color: FLX_GRADES.has(d.clarity) ? "#1CA9C9" : "rgba(255,255,255,0.7)",fontVariantNumeric:"tabular-nums"}}>{d.clarity}</span> },
    { key:"cut",      label:"Cut",          width:"48px",  render: d => <span style={{fontSize:"9px",textTransform:"uppercase",letterSpacing:"0.08em",color:"rgba(255,255,255,0.55)"}}>{d.cut === "Very Good" ? "VG" : d.cut === "Excellent" ? "EX" : d.cut}</span> },
    { key:"polish",   label:"Pol.",         width:"40px",  render: d => <span style={{fontSize:"9px",color:"rgba(255,255,255,0.45)"}}>{d.polish.replace("Excellent","EX").replace("Very Good","VG").replace("Good","G")}</span> },
    { key:"sym",      label:"Sym.",         width:"40px",  render: d => <span style={{fontSize:"9px",color:"rgba(255,255,255,0.45)"}}>{d.symmetry.replace("Excellent","EX").replace("Very Good","VG").replace("Good","G")}</span> },
    { key:"fluor",    label:"Fluor.",       width:"52px",  render: d => <span style={{fontSize:"9px",color: d.fluorescence === "BGM" ? "rgba(180,190,210,0.8)" : "rgba(255,255,255,0.45)"}}>{d.fluorescence === "BGM" ? "BGM ◈" : d.fluorescence}</span> },
    { key:"cert",     label:"Lab",          width:"48px",  render: d => d.certification !== "None" ? <span style={{fontSize:"8px",textTransform:"uppercase",letterSpacing:"0.2em",padding:"1px 5px",background: d.certification === "GIA" ? "rgba(28,169,201,0.1)" : "rgba(139,92,246,0.1)",border:`1px solid ${d.certification === "GIA" ? "rgba(28,169,201,0.3)" : "rgba(139,92,246,0.3)"}`,color: d.certification === "GIA" ? "#1CA9C9" : "#8B5CF6"}}>{d.certification}</span> : <span style={{color:"rgba(255,255,255,0.2)",fontSize:"9px"}}>—</span> },
    { key:"certNo",   label:"Cert #",       width:"90px",  render: d => <span style={{fontSize:"8px",fontFamily:"monospace",color:"rgba(255,255,255,0.3)"}}>{fmtStr(d.certNo ?? d.certificateNumber)}</span> },
    { key:"rap",      label:"Rap $/ct",     width:"72px",  render: d => <span style={{fontSize:"9px",color:"rgba(255,255,255,0.35)",fontVariantNumeric:"tabular-nums"}}>{fmtInt(d.rap)}</span> },
    { key:"disc",     label:"Disc %",       width:"60px",  render: d => <span style={{fontSize:"9px",fontWeight:600,fontVariantNumeric:"tabular-nums",color:discColor(d.listedDisc)}}>{d.listedDisc != null ? `${d.listedDisc > 0 ? "+" : ""}${d.listedDisc.toFixed(2)}%` : "—"}</span> },
    { key:"prCt",     label:"$/ct",         width:"72px",  render: d => <span style={{fontSize:"9px",color:"rgba(255,255,255,0.55)",fontVariantNumeric:"tabular-nums"}}>{d.listedPrCt != null ? `A$${fmtInt(Math.round(d.listedPrCt))}` : "—"}</span> },
    { key:"amount",   label:"Amount",       width:"84px",  render: d => d.listedAmt != null ? <span style={{fontSize:"10px",fontWeight:600,color:"#a3e6a0",fontVariantNumeric:"tabular-nums"}}>A${d.listedAmt.toLocaleString()}</span> : <span style={{fontSize:"9px",letterSpacing:"0.12em",color:"rgba(255,255,255,0.2)"}}>POA</span> },
    { key:"meas",     label:"Measurements", width:"144px", render: d => <span style={{fontSize:"8px",fontFamily:"monospace",color:"rgba(255,255,255,0.35)"}}>{d.measurements}</span> },
    { key:"tableP",   label:"Table%",       width:"52px",  render: d => <span style={{fontSize:"9px",color:"rgba(255,255,255,0.45)",fontVariantNumeric:"tabular-nums"}}>{fmt(d.tableP, 1)}</span> },
    { key:"depth",    label:"Depth%",       width:"52px",  render: d => <span style={{fontSize:"9px",color:"rgba(255,255,255,0.45)",fontVariantNumeric:"tabular-nums"}}>{fmt(d.depth, 1)}</span> },
    { key:"ca",       label:"CA°",          width:"44px",  render: d => <span style={{fontSize:"9px",color:"rgba(255,255,255,0.4)",fontVariantNumeric:"tabular-nums"}}>{fmt(d.ca, 1)}</span> },
    { key:"pa",       label:"PA°",          width:"44px",  render: d => <span style={{fontSize:"9px",color:"rgba(255,255,255,0.4)",fontVariantNumeric:"tabular-nums"}}>{fmt(d.pa, 1)}</span> },
    { key:"ratio",    label:"Ratio",        width:"48px",  render: d => <span style={{fontSize:"9px",color:"rgba(255,255,255,0.4)",fontVariantNumeric:"tabular-nums"}}>{fmt(d.ratio, 2)}</span> },
    { key:"origin",   label:"Origin",       width:"64px",  render: d => <span style={{fontSize:"8px",letterSpacing:"0.08em",color:"rgba(255,255,255,0.4)"}}>{fmtStr(d.origin)}</span> },
    { key:"ha",       label:"H&A",          width:"36px",  render: d => <span style={{fontSize:"9px",color: d.ha === "Y" ? "#1CA9C9" : "rgba(255,255,255,0.3)"}}>{d.ha === "Y" ? "Yes" : d.ha === "N" ? "No" : "—"}</span> },
    { key:"shade",    label:"Shade",        width:"52px",  render: d => <span style={{fontSize:"8px",color:"rgba(255,255,255,0.35)"}}>{fmtStr(d.shade)}</span> },
    { key:"loc",      label:"Loc.",         width:"44px",  render: d => <span style={{fontSize:"8px",color:"rgba(255,255,255,0.3)"}}>{fmtStr(d.loc)}</span> },
  ];

  /* ── Bloomberg-terminal DiamondTable ────────────────────── */
  function DiamondTable({ diamonds, isShortlisted, onToggleShortlist, onQuickView }: {
    diamonds: Diamond[];
    isShortlisted: (stockId: string) => boolean;
    onToggleShortlist: (d: Diamond) => void;
    onQuickView: (d: Diamond) => void;
  }) {
    return (
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <div style={{ minWidth: "1260px" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", background: "rgba(28,169,201,0.04)", borderBottom: "1px solid rgba(28,169,201,0.15)", position: "sticky", top: 0, zIndex: 10 }}>
            <div style={{ width: "36px", flexShrink: 0 }} />
            {COLS.map(c => (
              <div key={c.key} style={{ width: c.width, flexShrink: 0, padding: "8px 8px 8px 4px" }}>
                <span style={{ fontSize: "6.5px", textTransform: "uppercase", letterSpacing: "0.45em", color: "rgba(255,255,255,0.28)", fontWeight: 600, whiteSpace: "nowrap" }}>
                  {c.label}
                </span>
              </div>
            ))}
            <div style={{ width: "64px", flexShrink: 0 }} />
          </div>
          {/* Rows */}
          {diamonds.map((d, i) => {
            const sl = isShortlisted(d.stockId);
            return (
              <div
                key={d.id}
                style={{
                  display: "flex", alignItems: "center",
                  background: i % 2 === 0 ? "rgba(255,255,255,0.012)" : "transparent",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(28,169,201,0.045)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = i % 2 === 0 ? "rgba(255,255,255,0.012)" : "transparent"; }}
              >
                {/* Shortlist toggle */}
                <div style={{ width: "36px", flexShrink: 0, display: "flex", justifyContent: "center" }}>
                  <button
                    onClick={() => onToggleShortlist(d)}
                    title={sl ? "Remove from shortlist" : "Add to shortlist"}
                    style={{
                      width: "20px", height: "20px",
                      border: `1px solid ${sl ? "rgba(28,169,201,0.6)" : "rgba(255,255,255,0.18)"}`,
                      background: sl ? "rgba(28,169,201,0.18)" : "transparent",
                      color: sl ? "#1CA9C9" : "rgba(255,255,255,0.3)",
                      fontSize: "9px", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.15s", flexShrink: 0,
                    }}
                  >
                    {sl ? "✓" : "+"}
                  </button>
                </div>
                {/* Data cells */}
                {COLS.map(c => (
                  <div key={c.key} style={{ width: c.width, flexShrink: 0, padding: "9px 8px 9px 4px", overflow: "hidden" }}>
                    {c.render(d)}
                  </div>
                ))}
                {/* Quick view */}
                <div style={{ width: "64px", flexShrink: 0, padding: "0 8px 0 4px" }}>
                  <button
                    onClick={() => onQuickView(d)}
                    style={{
                      fontSize: "7.5px", textTransform: "uppercase", letterSpacing: "0.22em",
                      padding: "4px 8px", border: "1px solid rgba(255,255,255,0.12)",
                      color: "rgba(255,255,255,0.4)", background: "transparent", cursor: "pointer",
                      whiteSpace: "nowrap", transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(28,169,201,0.4)"; (e.currentTarget as HTMLButtonElement).style.color = "#1CA9C9"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.4)"; }}
                  >
                    View
                  </button>
                </div>
              </div>
            );
          })}
          {/* Footer bar */}
          <div style={{ display: "flex", alignItems: "center", padding: "10px 12px", background: "rgba(28,169,201,0.03)", borderTop: "1px solid rgba(28,169,201,0.1)" }}>
            <span style={{ fontSize: "8px", textTransform: "uppercase", letterSpacing: "0.35em", color: "rgba(255,255,255,0.3)" }}>
              {diamonds.length} {diamonds.length === 1 ? "stone" : "stones"}
              {" · "}
              <span style={{ color: "rgba(28,169,201,0.7)" }}>{diamonds.filter(d => isShortlisted(d.stockId)).length} shortlisted</span>
            </span>
            <span style={{ marginLeft: "auto", fontSize: "7.5px", letterSpacing: "0.22em", color: "rgba(255,255,255,0.18)", textTransform: "uppercase" }}>
              Prices in AUD · Exclusive of duties
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* ── Stone Quick View dialog ─────────────────────────────── */
  function StoneQuickView({ diamond, isShortlisted, onToggleShortlist, onClose }: {
    diamond: Diamond | null;
    isShortlisted: boolean;
    onToggleShortlist: () => void;
    onClose: () => void;
  }) {
    const [, navQV] = useLocation();
    if (!diamond) return null;
    const d = diamond;
    const specs: [string, string][] = [
      ["Cut",          d.cut],
      ["Polish",       d.polish],
      ["Symmetry",     d.symmetry],
      ["Fluorescence", d.fluorescence],
      ["Measurements", d.measurements],
      ["Carat",        `${d.carat.toFixed(2)} ct`],
      ["Table",        d.tableP != null ? `${d.tableP}%` : "—"],
      ["Depth",        d.depth != null ? `${d.depth}%` : "—"],
      ["Crown Angle",  d.ca != null ? `${d.ca}°` : "—"],
      ["Pav. Angle",   d.pa != null ? `${d.pa}°` : "—"],
      ["Origin",       d.origin ?? "—"],
      ["H&A",          d.ha === "Y" ? "Yes" : d.ha === "N" ? "No" : "—"],
    ];
    return (
      <Dialog open={!!diamond} onOpenChange={open => { if (!open) onClose(); }}>
        <DialogContent style={{ background: "#011A35", border: "1px solid rgba(28,169,201,0.2)", color: "white", maxWidth: "640px", padding: 0, overflow: "hidden", borderRadius: 0 }}>
          <DialogHeader style={{ padding: "26px 28px 18px", borderBottom: "1px solid rgba(28,169,201,0.12)" }}>
            <DialogTitle className="font-serif" style={{ fontSize: "1.5rem", color: "white", lineHeight: 1.2 }}>
              {d.carat.toFixed(2)}ct {d.color}/{d.clarity} {d.shape}
            </DialogTitle>
            <DialogDescription style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", letterSpacing: "0.12em", marginTop: "4px" }}>
              {d.stockId} · {d.certification !== "None" ? `${d.certification} Certified` : "Uncertified"}
              {(d.certNo || d.certificateNumber) ? ` · Cert #${d.certNo ?? d.certificateNumber}` : ""}
            </DialogDescription>
          </DialogHeader>
          <div style={{ padding: "22px 28px 28px" }}>
            {/* Media — 360° video or image gallery */}
            {(d.videoUrl || d.imageUrl || (d.images && d.images.length > 0)) && (
              <div style={{ marginBottom: "18px" }}>
                {d.videoUrl ? (
                  <video
                    src={d.videoUrl}
                    autoPlay loop muted playsInline controls
                    data-testid="quickview-video"
                    style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", background: "#02132a", border: "1px solid rgba(255,255,255,0.06)" }}
                  />
                ) : d.imageUrl ? (
                  <img
                    src={d.imageUrl}
                    alt={`${d.shape} ${d.carat}ct`}
                    data-testid="quickview-image"
                    style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", background: "#02132a", border: "1px solid rgba(255,255,255,0.06)" }}
                  />
                ) : null}
                {d.images && d.images.length > 0 && (
                  <div style={{ display: "flex", gap: "6px", marginTop: "6px", flexWrap: "wrap" }}>
                    {d.images.slice(0, 6).map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`${d.shape} angle ${i + 1}`}
                        data-testid={`quickview-thumb-${i}`}
                        style={{ width: "56px", height: "56px", objectFit: "cover", border: "1px solid rgba(255,255,255,0.08)" }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
            {/* Spec grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "18px" }}>
              {specs.map(([label, value]) => (
                <div key={label} style={{ padding: "9px 12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p style={{ fontSize: "7px", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: "3px" }}>{label}</p>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.82)" }}>{value}</p>
                </div>
              ))}
            </div>
            {/* Price (if available) */}
            {d.listedAmt != null && (
              <div style={{ padding: "11px 16px", background: "rgba(163,230,160,0.05)", border: "1px solid rgba(163,230,160,0.15)", marginBottom: "16px" }}>
                <p style={{ fontSize: "7px", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "4px" }}>Listed Price</p>
                <p style={{ fontSize: "18px", fontWeight: 700, color: "#a3e6a0", fontVariantNumeric: "tabular-nums" }}>A${d.listedAmt.toLocaleString()}</p>
              </div>
            )}
            {/* Actions */}
            <div style={{ display: "flex", gap: "10px" }}>
              {(d.giaReportUrl || d.giaReportPdfUrl) && (
                <a
                  href={d.giaReportPdfUrl || d.giaReportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="quickview-gia-report"
                  style={{
                    flex: 1, height: "44px", display: "flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.8)", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase",
                    textDecoration: "none",
                  }}
                >
                  View GIA Report →
                </a>
              )}
              <button
                onClick={onToggleShortlist}
                style={{
                  flex: 1, height: "44px",
                  background: isShortlisted ? "rgba(28,169,201,0.18)" : "rgba(28,169,201,0.08)",
                  border: `1px solid ${isShortlisted ? "rgba(28,169,201,0.6)" : "rgba(28,169,201,0.3)"}`,
                  color: "#1CA9C9", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {isShortlisted ? "✓ Shortlisted" : "Add to Shortlist"}
              </button>
              {isShortlisted && (
                <button
                  onClick={() => { onClose(); navQV("/shortlist"); }}
                  style={{
                    flex: 1, height: "44px",
                    background: "#1CA9C9", border: "none",
                    color: "white", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", cursor: "pointer",
                  }}
                >
                  View Shortlist →
                </button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  /* ── Enquiry Modal (inline on diamonds page) ─────────────── */
  function EnquiryModal({ onClose }: { onClose: () => void }) {
    const { shortlist, clearShortlist, count } = useShortlist();
    const { user, isAuthenticated, login } = useAuth();

    const [loginForm, setLoginForm] = useState({ name: "", email: "", company: "", phone: "" });
    const [loginError, setLoginError] = useState("");

    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (!loginForm.name.trim() || !loginForm.email.trim() || !loginForm.company.trim()) {
        setLoginError("Please provide your name, email, and company.");
        return;
      }
      setLoginError("");
      login(loginForm);
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) return;
      setSubmitting(true);
      setErrorMsg("");

      const stonesList = formatStonesList(shortlist);
      const now = new Date().toLocaleString("en-AU", {
        timeZone: "Australia/Melbourne",
        dateStyle: "full",
        timeStyle: "short",
      });

      const ownerParams = {
        buyer_name:    user.name,
        buyer_email:   user.email,
        buyer_company: user.company,
        buyer_phone:   user.phone || "—",
        stones_list:   stonesList,
        total_stones:  String(count),
        message:       message.trim() || "No additional notes.",
        submitted_at:  now,
      };

      const buyerParams = {
        buyer_name:   user.name,
        buyer_email:  user.email,
        stones_list:  stonesList,
        total_stones: String(count),
        submitted_at: now,
      };

      try {
        if (emailjsConfigured) {
          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_OWNER_TMPL, ownerParams, EMAILJS_PUBLIC_KEY);
          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_BUYER_TMPL, { ...buyerParams, to_email: user.email }, EMAILJS_PUBLIC_KEY);
        } else {
          await new Promise(r => setTimeout(r, 1100));
          console.info("[FLX] EmailJS not configured — enquiry data:", ownerParams);
        }
        clearShortlist();
        setStatus("success");
      } catch (err) {
        console.error(err);
        setErrorMsg("There was a problem sending your enquiry. Please try again or contact us directly.");
        setStatus("error");
      } finally {
        setSubmitting(false);
      }
    };

    const inputStyle: React.CSSProperties = {
      width: "100%", height: "40px",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.12)",
      color: "white", fontSize: "12px", padding: "0 12px", outline: "none",
      transition: "border-color 0.2s",
    };

    return (
      <Dialog open onOpenChange={open => { if (!open) onClose(); }}>
        <DialogContent style={{ background: "#011A35", border: "1px solid rgba(28,169,201,0.2)", color: "white", maxWidth: "680px", padding: 0, overflow: "hidden", borderRadius: 0 }}>

          {/* Header */}
          <DialogHeader style={{ padding: "24px 30px 18px", borderBottom: "1px solid rgba(28,169,201,0.12)" }}>
            <DialogTitle className="font-serif" style={{ fontSize: "1.45rem", color: "white", lineHeight: 1.2 }}>
              {status === "success" ? "Enquiry Received"
                : isAuthenticated ? "Submit Trade Enquiry"
                : "Register Your Trade Details"}
            </DialogTitle>
            <DialogDescription style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", marginTop: "3px" }}>
              {status === "success"
                ? `Thank you, ${user?.name.split(" ")[0]}. We'll respond within one business day.`
                : isAuthenticated
                  ? `${count} ${count === 1 ? "stone" : "stones"} selected · Enquiry sent to our trade desk`
                  : "One-time setup — stored locally on your device only"}
            </DialogDescription>
          </DialogHeader>

          {/* ── Success state ── */}
          {status === "success" ? (
            <div style={{ padding: "32px 30px" }} className="flex flex-col items-center gap-5 text-center">
              <div className="w-14 h-14 flex items-center justify-center"
                style={{ border: "1px solid rgba(28,169,201,0.35)", background: "rgba(28,169,201,0.08)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12L10 17L19 7" stroke="#1CA9C9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="font-serif text-xl text-white mb-2">We've received your selection.</p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                  A confirmation has been sent to{" "}
                  <strong style={{ color: "rgba(255,255,255,0.7)" }}>{user?.email}</strong>.
                  Our team will review your stones and respond with an itemised trade quote.
                </p>
              </div>
              {!emailjsConfigured && (
                <div style={{ width: "100%", padding: "10px 16px", background: "rgba(255,180,0,0.06)", border: "1px solid rgba(255,180,0,0.2)" }}>
                  <p style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.28em", color: "rgba(255,180,100,0.8)" }}>
                    Dev mode — EmailJS not configured. Enquiry logged to console.
                  </p>
                </div>
              )}
              <button
                onClick={onClose}
                style={{ height: "44px", padding: "0 36px", background: "#1CA9C9", border: "none", color: "white", fontSize: "9px", letterSpacing: "0.32em", textTransform: "uppercase", cursor: "pointer" }}
              >
                Continue Browsing
              </button>
            </div>

          /* ── Login / register step ── */
          ) : !isAuthenticated ? (
            <form onSubmit={handleLogin} style={{ padding: "24px 30px 28px" }}>
              <p style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.35em", color: "rgba(255,255,255,0.28)", marginBottom: "18px" }}>
                Your details · Stored locally · Never shared
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }}>
                {[
                  { key: "name",    label: "Full Name *",          placeholder: "Jane Smith",                type: "text" },
                  { key: "email",   label: "Email Address *",       placeholder: "jane@yourfirm.com.au",      type: "email" },
                  { key: "company", label: "Company / Trade Name *", placeholder: "Smith Jewellers Pty Ltd",  type: "text" },
                  { key: "phone",   label: "Phone (optional)",       placeholder: "+61 4xx xxx xxx",           type: "tel" },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: "7px", textTransform: "uppercase", letterSpacing: "0.4em", color: "rgba(255,255,255,0.3)", display: "block", marginBottom: "6px" }}>
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      value={loginForm[f.key as keyof typeof loginForm]}
                      onChange={e => setLoginForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      style={inputStyle}
                      onFocus={e => { e.currentTarget.style.borderColor = "rgba(28,169,201,0.5)"; }}
                      onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
                    />
                  </div>
                ))}
              </div>
              {loginError && (
                <p style={{ fontSize: "11px", color: "rgba(255,140,140,0.85)", marginBottom: "12px" }}>{loginError}</p>
              )}
              <button
                type="submit"
                style={{ width: "100%", height: "46px", background: "#1CA9C9", border: "none", color: "white", fontSize: "9px", letterSpacing: "0.35em", textTransform: "uppercase", cursor: "pointer" }}
              >
                Continue to Enquiry →
              </button>
            </form>

          /* ── Enquiry step ── */
          ) : (
            <form onSubmit={handleSubmit} style={{ padding: "22px 30px 26px" }}>
              {/* Shortlisted stones */}
              <div style={{ marginBottom: "18px", border: "1px solid rgba(28,169,201,0.1)", background: "#02193A" }}>
                <div style={{ padding: "9px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.35em", color: "rgba(255,255,255,0.4)" }}>
                    {count} {count === 1 ? "Stone" : "Stones"} Shortlisted
                  </span>
                  <span style={{ fontSize: "9px", letterSpacing: "0.18em", color: "rgba(28,169,201,0.6)" }}>
                    {user!.name} · {user!.company}
                  </span>
                </div>
                <div style={{ maxHeight: "190px", overflowY: "auto" }}>
                  {shortlist.map((d, i) => (
                    <div
                      key={d.stockId}
                      style={{
                        padding: "9px 14px",
                        borderBottom: i < shortlist.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                        <span className="font-serif" style={{ fontSize: "13px", color: "white" }}>{d.shape}</span>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "#1CA9C9" }}>{d.carat.toFixed(2)} ct</span>
                        <span style={{ fontSize: "8px", fontFamily: "monospace", color: "rgba(255,255,255,0.3)" }}>{d.stockId}</span>
                      </div>
                      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>
                        {d.color}/{d.clarity} · {d.certification !== "None" ? d.certification : "Uncert."}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "7px", textTransform: "uppercase", letterSpacing: "0.4em", color: "rgba(255,255,255,0.3)", display: "block", marginBottom: "8px" }}>
                  Additional Notes (optional)
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Any specific requirements, timing, or questions about these stones..."
                  style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: "12px", padding: "10px 12px", resize: "none", outline: "none", fontFamily: "inherit", transition: "border-color 0.2s" }}
                  onFocus={e => { e.currentTarget.style.borderColor = "rgba(28,169,201,0.4)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                />
              </div>

              {/* Confidentiality note */}
              <div style={{ padding: "9px 14px", background: "rgba(28,169,201,0.04)", border: "1px solid rgba(28,169,201,0.1)", marginBottom: "14px" }}>
                <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.38)", lineHeight: 1.6 }}>
                  All enquiries are strictly confidential. Handled personally by our trade desk — never automated or shared.
                </p>
              </div>

              {status === "error" && (
                <p style={{ fontSize: "11px", color: "rgba(255,140,140,0.85)", marginBottom: "12px" }}>{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: "100%", height: "46px",
                  background: submitting ? "rgba(28,169,201,0.55)" : "#1CA9C9",
                  border: "none", color: "white",
                  fontSize: "9px", letterSpacing: "0.35em", textTransform: "uppercase",
                  cursor: submitting ? "wait" : "pointer",
                  transition: "background 0.2s",
                }}
              >
                {submitting ? "Sending Enquiry…" : "Submit Enquiry"}
              </button>

              {!emailjsConfigured && (
                <p style={{ fontSize: "9px", textAlign: "center", color: "rgba(255,255,255,0.2)", marginTop: "10px" }}>
                  EmailJS not configured — enquiry will log to console in dev mode.
                </p>
              )}
            </form>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  /* ── Sort options ────────────────────────────────────────── */
  type SortKey = "default" | "carat-asc" | "carat-desc" | "clarity" | "color";
  
  const CLARITY_ORDER = ["FL","IF","VVS1","VVS2","VS1","VS2","SI1","SI2","I1","I2","I3"];
  const COLOR_ORDER   = ["D","E","F","G","H","I","J","K","L","M"];
  
  function sortDiamonds(arr: Diamond[], key: SortKey): Diamond[] {
    const out = [...arr];
    if (key === "carat-asc")  return out.sort((a, b) => a.carat - b.carat);
    if (key === "carat-desc") return out.sort((a, b) => b.carat - a.carat);
    if (key === "clarity")    return out.sort((a, b) => CLARITY_ORDER.indexOf(a.clarity) - CLARITY_ORDER.indexOf(b.clarity));
    if (key === "color")      return out.sort((a, b) => COLOR_ORDER.indexOf(a.color) - COLOR_ORDER.indexOf(b.color));
    return out;
  }
  
  interface SanityDiamond {
    _id: string;
    stockId: string;
    type: "natural" | "lab" | "loose";
    shape: string;
    carat: number;
    color: string;
    clarity: string;
    cut: string;
    polish: string;
    symmetry: string;
    fluorescence: string;
    measurements: string;
    certification: "GIA" | "IGI" | "None";
    certificateNumber?: string;
    imageUrl?: string;
    images?: string[];
    videoUrl?: string;
    giaReportUrl?: string;
    giaReportPdfUrl?: string;
  }

  /* ── Main Page ──────────────────────────────────────────── */
  export default function Diamonds() {
    const { data: sanityDiamonds } = useSanityQuery<SanityDiamond[]>(["diamonds"], DIAMONDS_QUERY);

    const activeDiamonds: Diamond[] = isSanityConfigured && sanityDiamonds && sanityDiamonds.length > 0
      ? sanityDiamonds.map((d, i) => ({
          id: i + 1,
          stockId: d.stockId,
          type: d.type,
          shape: d.shape,
          carat: d.carat,
          color: d.color,
          clarity: d.clarity,
          cut: d.cut || "Excellent",
          polish: d.polish || "Excellent",
          symmetry: d.symmetry || "Excellent",
          fluorescence: d.fluorescence || "None",
          measurements: d.measurements || "",
          image: "",
          imageUrl: d.imageUrl || undefined,
          images: Array.isArray(d.images) ? d.images.filter(Boolean) : undefined,
          videoUrl: d.videoUrl || undefined,
          giaReportUrl: d.giaReportUrl || undefined,
          giaReportPdfUrl: d.giaReportPdfUrl || undefined,
          certification: d.certification || "GIA",
          certificateNumber: d.certificateNumber || undefined,
        }))
      : DIAMONDS;

    const [category,    setCategory]    = useState<Category>("natural");
    const [shape,       setShape]       = useState("All");
    const [colorFilter, setColorFilter] = useState("All");
    const [clarity,     setClarity]     = useState("All");
    const [cut,         setCut]         = useState("All");
    const [caratMin,    setCaratMin]    = useState(0);
    const [caratMax,    setCaratMax]    = useState(999);
    const [sortKey,     setSortKey]     = useState<SortKey>("default");
    const [gridCols, setGridCols] = useState<2 | 3>(3);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [quickViewDiamond, setQuickViewDiamond] = useState<Diamond | null>(null);
    const [showEnquiryModal, setShowEnquiryModal] = useState(false);
    const { isInShortlist, addToShortlist, removeFromShortlist, count: shortlistCount } = useShortlist();
    const [, navigate] = useLocation();
    const [fluorFilter, setFluorFilter] = useState("All");
    const [certFilter,  setCertFilter]  = useState("All");

    /* Data-driven carat range for the current category */
    const caratBounds = useMemo(() => {
      const inCat = activeDiamonds.filter(d => d.type === (category === "custom" ? "natural" : category));
      if (inCat.length === 0) return { min: 0, max: category === "loose" ? 20 : 10 };
      const carats = inCat.map(d => d.carat);
      return {
        min: 0,
        max: Math.ceil(Math.max(...carats) * 2) / 2,
      };
    }, [activeDiamonds, category]);

    const caratRangeMax = caratBounds.max;

    const filtered = useMemo(() => {
      if (category === "custom") return [];
      const base = activeDiamonds.filter(d => {
        if (d.type !== category) return false;
        if (shape !== "All" && d.shape !== shape) return false;
        if (!matchesColor(d, colorFilter)) return false;
        if (!matchesClarity(d, clarity)) return false;
        if (!matchesCut(d, cut)) return false;
        if (!matchesCarat(d, caratMin, caratMax)) return false;
        if (!matchesFluorescence(d, fluorFilter)) return false;
        if (!matchesCertification(d, certFilter)) return false;
        return true;
      });
      return sortDiamonds(base, sortKey);
    }, [category, shape, colorFilter, clarity, cut, caratMin, caratMax, sortKey, fluorFilter, certFilter]);
  
    const hasFilters = shape !== "All" || colorFilter !== "All" || clarity !== "All" || cut !== "All" || fluorFilter !== "All" || certFilter !== "All";
  
    const resetFilters = () => {
      setShape("All"); setColorFilter("All"); setClarity("All"); setCut("All");
      setCaratMin(0); setCaratMax(999);
      setFluorFilter("All"); setCertFilter("All");
    };
  
    const gridClass = gridCols === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  
    return (
      <div style={{ background: "#02274A", minHeight: "100vh" }}>
  
        {/* ── Hero ── */}
        <div className="pt-28 md:pt-40 pb-10 px-8 md:px-14 lg:px-20" style={{ background: "#02274A" }}>
          <div className="max-w-7xl mx-auto">
            <p className="text-[10px] uppercase tracking-[0.45em] mb-4 font-medium" style={{ color: "#1CA9C9" }}>
              GIA-Certified Trade Inventory
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-white mb-3 leading-tight">
              Diamond Collection
            </h1>
            <div className="w-10 h-px my-4" style={{ background: "#1CA9C9" }} />
            <p className="text-white/45 text-sm max-w-xl leading-relaxed font-light">
              Natural and lab-grown diamonds at verified trade pricing. Every stone GIA-certified.
              IF→FL conversion assessments available at no cost.
            </p>
          </div>
        </div>
  
        {/* ── Category tabs ── */}
        <div style={{ background: "#02274A", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="max-w-7xl mx-auto px-8 md:px-14 lg:px-20 flex overflow-x-auto">
            {(["natural","lab","loose","custom"] as Category[]).map(cat => {
              const labels = { natural:"Natural Diamonds", lab:"Lab-Grown Diamonds", loose:"Loose Diamonds", custom:"Customised" };
              const active = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat); resetFilters(); }}
                  className="shrink-0 px-6 py-4 text-[11px] uppercase tracking-[0.35em] font-medium transition-all relative"
                  style={{ color: active ? "white" : "rgba(255,255,255,0.35)" }}
                  data-testid={`tab-${cat}`}
                >
                  {labels[cat]}
                  {active && (
                    <motion.div layoutId="tab-u" className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background:"#1CA9C9" }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
  
        {/* ── Filter panel ── */}
        {category !== "custom" && (
          <div style={{ background: "#021C38", borderBottom: "1px solid rgba(28,169,201,0.08)" }}>
            <div className="max-w-7xl mx-auto px-8 md:px-14 lg:px-20 py-8">
  
              {/* ─ Two-column grid ─ */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 mb-8">
  
                {/* LEFT: Shape + Cut */}
                <div className="flex flex-col gap-7">
                  {/* Shape */}
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.45em] mb-4 font-semibold" style={{ color: "rgba(255,255,255,0.28)" }}>Shapes</p>
                    <div className="flex flex-wrap gap-3">
                      {SHAPE_DATA.map(s => (
                        <ShapeBtn key={s.id} id={s.id} label={s.label} element={s.element} active={shape === s.id} onClick={() => setShape(s.id)} />
                      ))}
                    </div>
                  </div>
  
                  {/* Cut */}
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.45em] mb-4 font-semibold" style={{ color: "rgba(255,255,255,0.28)" }}>Cuts</p>
                    <div className="flex flex-wrap gap-2">
                      {CUTS.map(c => <Pill key={c} label={c} active={cut === c} onClick={() => setCut(c)} />)}
                    </div>
                  </div>

                  {/* ── NEW: Fluorescence / BGM ── */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <p className="text-[8px] uppercase tracking-[0.45em] font-semibold" style={{ color: "rgba(255,255,255,0.28)" }}>Fluorescence</p>
                      <span className="text-[7px] px-2 py-0.5 font-medium" style={{ background:"rgba(74,85,104,0.12)", color:"rgba(180,190,210,0.7)", border:"1px solid rgba(74,85,104,0.3)", borderRadius:"9999px" }}>
                        BGM = Brown · Grey · Milky
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {FLUORESCENCE_OPTIONS.map(f => (
                        <BgmPill key={f} label={f} active={fluorFilter === f} onClick={() => setFluorFilter(f)} />
                      ))}
                    </div>
                  </div>
                </div>
  
                {/* RIGHT: Clarity + Color + Certification */}
                <div className="flex flex-col gap-7">
                  {/* Clarity */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <p className="text-[8px] uppercase tracking-[0.45em] font-semibold" style={{ color: "rgba(255,255,255,0.28)" }}>Clarity</p>
                      <span className="text-[7px] px-2 py-0.5 font-medium" style={{ background:"rgba(28,169,201,0.1)", color:"#1CA9C9", border:"1px solid rgba(28,169,201,0.22)", borderRadius:"9999px" }}>
                        FL · IF = FLX Specialty
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {CLARITIES.map(c => (
                        <Pill key={c} label={c} active={clarity === c} onClick={() => setClarity(c)} flx={FLX_GRADES.has(c)} />
                      ))}
                    </div>
                  </div>
  
                  {/* Color */}
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.45em] mb-4 font-semibold" style={{ color: "rgba(255,255,255,0.28)" }}>Colors</p>
                    <div className="flex flex-wrap items-start gap-2">
                      <button onClick={() => setColorFilter("All")} className="flex flex-col items-center gap-1 transition-all">
                        <div
                          className="w-10 h-10 flex items-center justify-center text-[8px] font-bold tracking-widest rounded-sm"
                          style={{
                            border: `1px solid ${colorFilter === "All" ? "#1CA9C9" : "rgba(255,255,255,0.1)"}`,
                            background: colorFilter === "All" ? "rgba(28,169,201,0.12)" : "rgba(255,255,255,0.03)",
                            color: colorFilter === "All" ? "#1CA9C9" : "rgba(255,255,255,0.3)",
                          }}
                        >ALL</div>
                        <span className="text-[8px] uppercase tracking-[0.1em]" style={{ color: colorFilter === "All" ? "#1CA9C9" : "rgba(255,255,255,0.25)" }}>All</span>
                      </button>
                      {COLOR_GRADES.map(g => <ColorBtn key={g} grade={g} active={colorFilter === g} onClick={() => setColorFilter(g)} />)}
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex-1 h-px" style={{
                        background: "linear-gradient(90deg, #ECF7FF 0%, #F4F4FF 14%, #F8FFF5 28%, #FFFEF0 42%, #FFF9E0 56%, #FFF5CC 70%, #FFEFB5 84%, #FFE89E 100%)"
                      }} />
                      <span className="text-[8px]" style={{ color:"rgba(255,255,255,0.18)" }}>D ← colorless → K faint</span>
                    </div>
                  </div>

                  {/* ── NEW: Certification ── */}
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.45em] mb-4 font-semibold" style={{ color: "rgba(255,255,255,0.28)" }}>Certification</p>
                    <div className="flex flex-wrap gap-2">
                      {CERTIFICATION_OPTIONS.map(opt => (
                        <CertPill
                          key={opt.value}
                          value={opt.value}
                          label={opt.label}
                          active={certFilter === opt.value}
                          onClick={() => setCertFilter(opt.value)}
                        />
                      ))}
                    </div>
                    <p className="text-[8px] mt-2.5 leading-relaxed" style={{ color: "rgba(255,255,255,0.22)" }}>
                      Loose diamonds are sold without grading reports. Trade buyers may arrange independent grading at their discretion.
                    </p>
                  </div>
                </div>
              </div>
  
              {/* ─ Full-width: Carat Weight ─ */}
              <div className="pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-3 mb-5">
                  <p className="text-[8px] uppercase tracking-[0.45em] font-semibold" style={{ color: "rgba(255,255,255,0.28)" }}>Carat Weight</p>
                  <span className="text-[7px] px-2 py-0.5 font-medium" style={{ background:"rgba(28,169,201,0.06)", color:"rgba(28,169,201,0.6)", border:"1px solid rgba(28,169,201,0.15)", borderRadius:"9999px" }}>
                    Up to {caratRangeMax.toFixed(1)} ct
                  </span>
                </div>
                {(() => {
                  const dispMin = caratMin;
                  const dispMax = Math.min(caratMax, caratRangeMax);
                  const trackLeft  = caratRangeMax > 0 ? (dispMin / caratRangeMax) * 100 : 0;
                  const trackRight = caratRangeMax > 0 ? 100 - (dispMax / caratRangeMax) * 100 : 0;
                  /* Tick marks: evenly spaced across actual data range */
                  const tickCount = 6;
                  const ticks = Array.from({ length: tickCount }, (_, i) =>
                    parseFloat((caratRangeMax * (i / (tickCount - 1))).toFixed(1))
                  );
                  return (
                    <div className="flex items-center gap-5">
                      <div className="text-sm font-semibold font-sans px-4 py-2 min-w-[60px] text-center"
                        style={{ background:"rgba(28,169,201,0.06)", border:"1px solid rgba(28,169,201,0.18)", color:"#1CA9C9", borderRadius:"6px" }}>
                        {dispMin.toFixed(1)}
                      </div>
                      <div className="flex-1 flex flex-col gap-1.5">
                        <div className="relative h-1.5 rounded-full" style={{ background:"rgba(255,255,255,0.08)" }}>
                          <div
                            className="absolute h-1.5 rounded-full"
                            style={{
                              left: `${trackLeft}%`,
                              right: `${Math.max(0, trackRight)}%`,
                              background: "linear-gradient(90deg, #1CA9C9, #5DD6F0)",
                            }}
                          />
                        </div>
                        <div className="relative" style={{ height: "16px" }}>
                          <input type="range" min="0" max={caratRangeMax} step="0.1" value={dispMin}
                            onChange={e => setCaratMin(Math.min(Number(e.target.value), dispMax - 0.1))}
                            className="absolute inset-0 w-full opacity-0 h-4 cursor-pointer" style={{ zIndex:2 }} />
                          <input type="range" min="0" max={caratRangeMax} step="0.1" value={dispMax}
                            onChange={e => setCaratMax(Math.max(Number(e.target.value), dispMin + 0.1))}
                            className="absolute inset-0 w-full opacity-0 h-4 cursor-pointer" style={{ zIndex:3 }} />
                        </div>
                        <div className="flex justify-between">
                          {ticks.map(val => (
                            <span key={val} className="text-[7px] font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>{val}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-sm font-semibold font-sans px-4 py-2 min-w-[60px] text-center"
                        style={{ background:"rgba(28,169,201,0.06)", border:"1px solid rgba(28,169,201,0.18)", color:"#1CA9C9", borderRadius:"6px" }}>
                        {dispMax.toFixed(1)}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* ─ Clear filters ─ */}
              {hasFilters && (
                <div className="flex justify-end mt-6">
                  <button
                    onClick={resetFilters}
                    className="text-[9px] uppercase tracking-[0.3em] px-6 py-2.5 font-medium transition-all"
                    style={{ borderRadius:"9999px", border:"1px solid rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.5)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "white"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.4)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.5)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.15)"; }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
  
            </div>
          </div>
        )}
  
        {/* ── Content area ── */}
        <div className="max-w-7xl mx-auto px-8 md:px-14 lg:px-20 py-10">
  
          {/* ── Customised tab ── */}
          <AnimatePresence mode="wait">
            {category === "custom" ? (
              <motion.div
                key="custom"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="py-24 text-center max-w-xl mx-auto flex flex-col items-center gap-6"
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ border: "1px solid rgba(28,169,201,0.2)" }}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M11 2L19 8L11 20L3 8Z" stroke="#1CA9C9" strokeWidth="1.2" strokeLinejoin="round" opacity="0.8" />
                    <path d="M3 8H19" stroke="#1CA9C9" strokeWidth="1.2" opacity="0.8" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.45em] mb-3 font-medium" style={{ color: "#1CA9C9" }}>Bespoke Sourcing</p>
                  <h2 className="font-serif text-3xl text-white mb-4">Describe exactly what you need.</h2>
                  <p className="text-white/40 text-sm leading-relaxed">
                    We source to specification — carat, shape, colour, clarity, origin.
                    Natural and lab-grown. Every brief is handled personally and confidentially.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link href="/contact">
                    <Button className="rounded-none text-xs uppercase tracking-[0.18em] font-medium text-white hover:opacity-90"
                      style={{ background:"#1CA9C9", height:"48px", padding:"0 2rem" }} data-testid="btn-custom-enquiry">
                      Submit a Brief
                    </Button>
                  </Link>
                  <Link href="/services">
                    <Button variant="outline" className="rounded-none text-xs uppercase tracking-[0.18em] hover:bg-white/10"
                      style={{ borderColor:"rgba(255,255,255,0.2)", color:"rgba(255,255,255,0.7)", height:"48px", padding:"0 2rem" }}>
                      View Our Services
                    </Button>
                  </Link>
                </div>
              </motion.div>

            ) : category === "loose" ? (
              /* ── Loose diamonds tab content ── */
              <motion.div key="loose" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.3 }}>

                {/* Loose diamonds info banner */}
                <div
                  className="mb-8 p-5 flex flex-col sm:flex-row items-start gap-4"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div className="shrink-0 w-10 h-10 flex items-center justify-center" style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
                    <svg width="18" height="18" viewBox="0 0 100 120" fill="none">
                      <polygon points="50,4 88,30 88,70 50,96 12,70 12,30" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.5)" strokeWidth="3"/>
                      <polygon points="50,4 88,30 50,54 12,30" fill="rgba(255,255,255,0.18)" strokeWidth="0"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.35em] font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.7)" }}>
                      Loose Diamonds — Sold Without Grading Reports
                    </p>
                    <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.38)" }}>
                      These stones are available to the trade as uncertified inventory. Weights and grades are assessed in-house.
                      Independent GIA or IGI certification can be arranged prior to purchase on request.
                      Stones range from sub-carat melee to exceptional large specimens up to 20ct.
                    </p>
                  </div>
                </div>

                {/* Trust strip — loose-specific */}
                <div
                  className="grid grid-cols-2 md:grid-cols-4 gap-px mb-8"
                  style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)" }}
                >
                  {[
                    { icon: "◈", label: "Trade Pricing",        sub: "No retail margin, direct to trade" },
                    { icon: "⬡", label: "In-House Assessment",  sub: "All grades verified by our gemologists" },
                    { icon: "◎", label: "Cert on Request",      sub: "GIA/IGI grading available pre-purchase" },
                    { icon: "✦", label: "Up to 20ct",           sub: "Large & parcel lots available" },
                  ].map(t => (
                    <div key={t.label} className="flex items-start gap-3 p-4" style={{ background:"#010D1C" }}>
                      <span className="text-base mt-0.5 shrink-0" style={{ color: "rgba(255,255,255,0.4)" }}>{t.icon}</span>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-white">{t.label}</p>
                        <p className="text-[9px] mt-0.5 leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>{t.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Active filter chips */}
                {hasFilters && (
                  <div className="flex flex-wrap items-center gap-2 mb-5">
                    <span className="text-[8px] uppercase tracking-[0.35em] shrink-0" style={{ color: "rgba(255,255,255,0.3)" }}>
                      Filtered by
                    </span>
                    {shape !== "All" && (
                      <button onClick={() => setShape("All")} className="flex items-center gap-1.5 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] font-medium transition-all hover:opacity-75"
                        style={{ background:"rgba(28,169,201,0.12)", border:"1px solid rgba(28,169,201,0.3)", color:"#1CA9C9" }}>
                        Shape: {shape} <span style={{ fontSize:"10px" }}>×</span>
                      </button>
                    )}
                    {colorFilter !== "All" && (
                      <button onClick={() => setColorFilter("All")} className="flex items-center gap-1.5 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] font-medium transition-all hover:opacity-75"
                        style={{ background:"rgba(28,169,201,0.12)", border:"1px solid rgba(28,169,201,0.3)", color:"#1CA9C9" }}>
                        Color: {colorFilter} <span style={{ fontSize:"10px" }}>×</span>
                      </button>
                    )}
                    {clarity !== "All" && (
                      <button onClick={() => setClarity("All")} className="flex items-center gap-1.5 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] font-medium transition-all hover:opacity-75"
                        style={{ background:"rgba(28,169,201,0.12)", border:"1px solid rgba(28,169,201,0.3)", color:"#1CA9C9" }}>
                        Clarity: {clarity} <span style={{ fontSize:"10px" }}>×</span>
                      </button>
                    )}
                    {cut !== "All" && (
                      <button onClick={() => setCut("All")} className="flex items-center gap-1.5 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] font-medium transition-all hover:opacity-75"
                        style={{ background:"rgba(28,169,201,0.12)", border:"1px solid rgba(28,169,201,0.3)", color:"#1CA9C9" }}>
                        Cut: {cut} <span style={{ fontSize:"10px" }}>×</span>
                      </button>
                    )}
                    {fluorFilter !== "All" && (
                      <button onClick={() => setFluorFilter("All")} className="flex items-center gap-1.5 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] font-medium transition-all hover:opacity-75"
                        style={{ background:"rgba(74,85,104,0.15)", border:"1px solid rgba(74,85,104,0.4)", color:"rgba(180,190,210,0.85)" }}>
                        Fluor: {fluorFilter} <span style={{ fontSize:"10px" }}>×</span>
                      </button>
                    )}
                    <button onClick={resetFilters} className="text-[9px] uppercase tracking-[0.25em] px-2.5 py-1 transition-all hover:opacity-75"
                      style={{ border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.4)" }}>
                      Clear all
                    </button>
                  </div>
                )}

                {/* Results bar */}
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <p className="text-[10px] uppercase tracking-[0.35em]" style={{ color: "rgba(255,255,255,0.4)" }}>
                    <span className="text-white font-semibold text-sm">{filtered.length}</span>
                    {" "}{filtered.length === 1 ? "stone" : "stones"} available
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase tracking-[0.3em]" style={{ color: "rgba(255,255,255,0.3)" }}>Sort</span>
                      <select
                        value={sortKey}
                        onChange={e => setSortKey(e.target.value as SortKey)}
                        className="text-[9px] uppercase tracking-[0.2em] py-1.5 px-3 appearance-none cursor-pointer"
                        style={{ background: "#021C38", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)", outline: "none" }}
                      >
                        <option value="default">Default</option>
                        <option value="carat-desc">Carat · High → Low</option>
                        <option value="carat-asc">Carat · Low → High</option>
                        <option value="clarity">Clarity · Best First</option>
                        <option value="color">Color · D First</option>
                      </select>
                    </div>
                    <div className="flex gap-1">
                      {([2,3] as const).map(n => (
                        <button key={n} onClick={() => { setGridCols(n); setViewMode("grid"); }}
                          className="w-8 h-8 transition-all text-[9px] font-mono"
                          style={{ border: `1px solid ${viewMode === "grid" && gridCols === n ? "#1CA9C9" : "rgba(255,255,255,0.12)"}`, color: viewMode === "grid" && gridCols === n ? "#1CA9C9" : "rgba(255,255,255,0.3)", background: viewMode === "grid" && gridCols === n ? "rgba(28,169,201,0.08)" : "transparent" }}
                        >{n}×</button>
                      ))}
                      <button
                        onClick={() => setViewMode("list")}
                        className="w-8 h-8 transition-all flex items-center justify-center"
                        style={{ border: `1px solid ${viewMode === "list" ? "#1CA9C9" : "rgba(255,255,255,0.12)"}`, background: viewMode === "list" ? "rgba(28,169,201,0.08)" : "transparent" }}
                        title="List view"
                      >
                        <svg width="13" height="11" viewBox="0 0 13 11" fill="none" style={{ color: viewMode === "list" ? "#1CA9C9" : "rgba(255,255,255,0.3)" }}>
                          <rect x="0" y="0" width="4" height="1.5" rx="0.5" fill="currentColor" opacity="0.5" />
                          <rect x="5.5" y="0" width="7.5" height="1.5" rx="0.5" fill="currentColor" />
                          <rect x="0" y="4.25" width="4" height="1.5" rx="0.5" fill="currentColor" opacity="0.5" />
                          <rect x="5.5" y="4.25" width="7.5" height="1.5" rx="0.5" fill="currentColor" />
                          <rect x="0" y="8.5" width="4" height="1.5" rx="0.5" fill="currentColor" opacity="0.5" />
                          <rect x="5.5" y="8.5" width="7.5" height="1.5" rx="0.5" fill="currentColor" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Loose diamond grid / list */}
                {filtered.length > 0 ? (
                  viewMode === "list" ? (
                    <DiamondTable
                      diamonds={filtered}
                      isShortlisted={isInShortlist}
                      onToggleShortlist={d => isInShortlist(d.stockId) ? removeFromShortlist(d.stockId) : addToShortlist(d)}
                      onQuickView={setQuickViewDiamond}
                    />
                  ) : (
                  <div className={`grid ${gridClass} gap-4`}>
                    {filtered.map((d, i) => (
                      <motion.div key={d.id} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45, delay: i * 0.04 }}>
                        <StoneCard
                          diamond={d}
                          isShortlisted={isInShortlist(d.stockId)}
                          onToggleShortlist={() => isInShortlist(d.stockId) ? removeFromShortlist(d.stockId) : addToShortlist(d)}
                          onQuickView={() => setQuickViewDiamond(d)}
                        />
                      </motion.div>
                    ))}
                  </div>
                  )
                ) : (
                  <div className="py-24 text-center">
                    <p className="font-serif text-xl mb-3" style={{ color:"rgba(255,255,255,0.2)" }}>No stones match your filters</p>
                    <button onClick={resetFilters} className="text-[10px] uppercase tracking-[0.35em] transition-colors" style={{ color:"#1CA9C9" }}>
                      Clear all filters
                    </button>
                  </div>
                )}

              </motion.div>
  
            ) : (
              <motion.div key={category} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.3 }}>
  
                {/* Trust strip */}
                <div
                  className="grid grid-cols-2 md:grid-cols-4 gap-px mb-8"
                  style={{ border: "1px solid rgba(28,169,201,0.12)", background: "rgba(28,169,201,0.06)" }}
                >
                  {[
                    { img: "/gia-logo.png", icon: null,  label: "GIA Certified",    sub: "Every stone independently graded" },
                    { img: null, icon: "◈",               label: "Trade Pricing",    sub: "No retail margin, direct to trade" },
                    { img: null, icon: "⬡",               label: "IF→FL Conversion", sub: "Free viability assessment" },
                    { img: null, icon: "◎",               label: "Discretion",       sub: "White-label sourcing available" },
                  ].map(t => (
                    <div key={t.label} className="flex items-start gap-3 p-4" style={{ background:"#010D1C" }}>
                      {t.img ? (
                        <img src={t.img} alt="GIA" className="shrink-0 mt-0.5" style={{ width:"24px", height:"24px", objectFit:"contain", opacity:1, mixBlendMode:"screen" }} />
                      ) : (
                        <span className="text-base mt-0.5 shrink-0" style={{ color: "#1CA9C9" }}>{t.icon}</span>
                      )}
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-white">{t.label}</p>
                        <p className="text-[9px] mt-0.5 leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>{t.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
  
                {/* Active filter chips */}
                {hasFilters && (
                  <div className="flex flex-wrap items-center gap-2 mb-5">
                    <span className="text-[8px] uppercase tracking-[0.35em] shrink-0" style={{ color: "rgba(255,255,255,0.3)" }}>
                      Filtered by
                    </span>
                    {shape !== "All" && (
                      <button onClick={() => setShape("All")} className="flex items-center gap-1.5 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] font-medium transition-all hover:opacity-75"
                        style={{ background:"rgba(28,169,201,0.12)", border:"1px solid rgba(28,169,201,0.3)", color:"#1CA9C9" }}>
                        Shape: {shape} <span style={{ fontSize:"10px" }}>×</span>
                      </button>
                    )}
                    {colorFilter !== "All" && (
                      <button onClick={() => setColorFilter("All")} className="flex items-center gap-1.5 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] font-medium transition-all hover:opacity-75"
                        style={{ background:"rgba(28,169,201,0.12)", border:"1px solid rgba(28,169,201,0.3)", color:"#1CA9C9" }}>
                        Color: {colorFilter} <span style={{ fontSize:"10px" }}>×</span>
                      </button>
                    )}
                    {clarity !== "All" && (
                      <button onClick={() => setClarity("All")} className="flex items-center gap-1.5 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] font-medium transition-all hover:opacity-75"
                        style={{ background:"rgba(28,169,201,0.12)", border:"1px solid rgba(28,169,201,0.3)", color:"#1CA9C9" }}>
                        Clarity: {clarity} <span style={{ fontSize:"10px" }}>×</span>
                      </button>
                    )}
                    {cut !== "All" && (
                      <button onClick={() => setCut("All")} className="flex items-center gap-1.5 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] font-medium transition-all hover:opacity-75"
                        style={{ background:"rgba(28,169,201,0.12)", border:"1px solid rgba(28,169,201,0.3)", color:"#1CA9C9" }}>
                        Cut: {cut} <span style={{ fontSize:"10px" }}>×</span>
                      </button>
                    )}
                    {fluorFilter !== "All" && (
                      <button onClick={() => setFluorFilter("All")} className="flex items-center gap-1.5 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] font-medium transition-all hover:opacity-75"
                        style={{ background:"rgba(74,85,104,0.15)", border:"1px solid rgba(74,85,104,0.4)", color:"rgba(180,190,210,0.85)" }}>
                        Fluor: {fluorFilter} <span style={{ fontSize:"10px" }}>×</span>
                      </button>
                    )}
                    {certFilter !== "All" && (
                      <button onClick={() => setCertFilter("All")} className="flex items-center gap-1.5 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] font-medium transition-all hover:opacity-75"
                        style={{ background:"rgba(28,169,201,0.12)", border:"1px solid rgba(28,169,201,0.3)", color:"#1CA9C9" }}>
                        Cert: {certFilter} <span style={{ fontSize:"10px" }}>×</span>
                      </button>
                    )}
                    <button onClick={resetFilters} className="text-[9px] uppercase tracking-[0.25em] px-2.5 py-1 transition-all hover:opacity-75"
                      style={{ border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.4)" }}>
                      Clear all
                    </button>
                  </div>
                )}
  
                {/* Results bar */}
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <p className="text-[10px] uppercase tracking-[0.35em]" style={{ color: "rgba(255,255,255,0.4)" }}>
                    <span className="text-white font-semibold text-sm">{filtered.length}</span>
                    {" "}{filtered.length === 1 ? "stone" : "stones"} available
                  </p>
                  <div className="flex items-center gap-3">
                    {/* Sort */}
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase tracking-[0.3em]" style={{ color: "rgba(255,255,255,0.3)" }}>Sort</span>
                      <select
                        value={sortKey}
                        onChange={e => setSortKey(e.target.value as SortKey)}
                        className="text-[9px] uppercase tracking-[0.2em] py-1.5 px-3 appearance-none cursor-pointer"
                        style={{
                          background: "#021C38",
                          border: "1px solid rgba(255,255,255,0.12)",
                          color: "rgba(255,255,255,0.6)",
                          outline: "none",
                        }}
                      >
                        <option value="default">Default</option>
                        <option value="carat-desc">Carat · High → Low</option>
                        <option value="carat-asc">Carat · Low → High</option>
                        <option value="clarity">Clarity · Best First</option>
                        <option value="color">Color · D First</option>
                      </select>
                    </div>
                    {/* Grid / List toggle */}
                    <div className="flex gap-1">
                      {([2,3] as const).map(n => (
                        <button
                          key={n}
                          onClick={() => { setGridCols(n); setViewMode("grid"); }}
                          className="w-8 h-8 transition-all text-[9px] font-mono"
                          style={{
                            border: `1px solid ${viewMode === "grid" && gridCols === n ? "#1CA9C9" : "rgba(255,255,255,0.12)"}`,
                            color: viewMode === "grid" && gridCols === n ? "#1CA9C9" : "rgba(255,255,255,0.3)",
                            background: viewMode === "grid" && gridCols === n ? "rgba(28,169,201,0.08)" : "transparent",
                          }}
                        >{n}×</button>
                      ))}
                      <button
                        onClick={() => setViewMode("list")}
                        className="w-8 h-8 transition-all flex items-center justify-center"
                        style={{ border: `1px solid ${viewMode === "list" ? "#1CA9C9" : "rgba(255,255,255,0.12)"}`, background: viewMode === "list" ? "rgba(28,169,201,0.08)" : "transparent" }}
                        title="List view"
                      >
                        <svg width="13" height="11" viewBox="0 0 13 11" fill="none" style={{ color: viewMode === "list" ? "#1CA9C9" : "rgba(255,255,255,0.3)" }}>
                          <rect x="0" y="0" width="4" height="1.5" rx="0.5" fill="currentColor" opacity="0.5" />
                          <rect x="5.5" y="0" width="7.5" height="1.5" rx="0.5" fill="currentColor" />
                          <rect x="0" y="4.25" width="4" height="1.5" rx="0.5" fill="currentColor" opacity="0.5" />
                          <rect x="5.5" y="4.25" width="7.5" height="1.5" rx="0.5" fill="currentColor" />
                          <rect x="0" y="8.5" width="4" height="1.5" rx="0.5" fill="currentColor" opacity="0.5" />
                          <rect x="5.5" y="8.5" width="7.5" height="1.5" rx="0.5" fill="currentColor" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
  
                {/* Diamond grid / list */}
                {filtered.length > 0 ? (
                  viewMode === "list" ? (
                    <DiamondTable
                      diamonds={filtered}
                      isShortlisted={isInShortlist}
                      onToggleShortlist={d => isInShortlist(d.stockId) ? removeFromShortlist(d.stockId) : addToShortlist(d)}
                      onQuickView={setQuickViewDiamond}
                    />
                  ) : (
                  <div className={`grid ${gridClass} gap-4`}>
                    {filtered.map((d, i) => (
                      <motion.div
                        key={d.id}
                        initial={{ opacity:0, y:16 }}
                        animate={{ opacity:1, y:0 }}
                        transition={{ duration:0.45, delay: i * 0.04 }}
                      >
                        <StoneCard
                          diamond={d}
                          isShortlisted={isInShortlist(d.stockId)}
                          onToggleShortlist={() => isInShortlist(d.stockId) ? removeFromShortlist(d.stockId) : addToShortlist(d)}
                          onQuickView={() => setQuickViewDiamond(d)}
                        />
                      </motion.div>
                    ))}
                  </div>
                  )
                ) : (
                  <div className="py-24 text-center">
                    <p className="font-serif text-xl mb-3" style={{ color:"rgba(255,255,255,0.2)" }}>No stones match your filters</p>
                    <button onClick={resetFilters} className="text-[10px] uppercase tracking-[0.35em] transition-colors" style={{ color:"#1CA9C9" }}>
                      Clear all filters
                    </button>
                  </div>
                )}
  
              </motion.div>
            )}
          </AnimatePresence>
        </div>
  
        {/* ── Stone quick view dialog ── */}
        <StoneQuickView
          diamond={quickViewDiamond}
          isShortlisted={quickViewDiamond ? isInShortlist(quickViewDiamond.stockId) : false}
          onToggleShortlist={() => {
            if (!quickViewDiamond) return;
            isInShortlist(quickViewDiamond.stockId)
              ? removeFromShortlist(quickViewDiamond.stockId)
              : addToShortlist(quickViewDiamond);
          }}
          onClose={() => setQuickViewDiamond(null)}
        />

        {/* ── Enquiry modal ── */}
        {showEnquiryModal && (
          <EnquiryModal onClose={() => setShowEnquiryModal(false)} />
        )}

        {/* ── Floating shortlist bar ── */}
        <AnimatePresence>
          {shortlistCount > 0 && (
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-6 left-1/2 z-40 flex items-center gap-4 px-6 py-3.5 shadow-2xl"
              style={{
                transform: "translateX(-50%)",
                background: "rgba(2,28,56,0.97)",
                border: "1px solid rgba(28,169,201,0.35)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                maxWidth: "calc(100vw - 2rem)",
              }}
            >
              <div className="flex items-center gap-2.5">
                <svg width="14" height="14" viewBox="0 0 22 22" fill="none">
                  <path d="M11 2L19 8L11 20L3 8Z" stroke="#1CA9C9" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M3 8H19" stroke="#1CA9C9" strokeWidth="1.5" />
                </svg>
                <span className="text-[10px] uppercase tracking-[0.3em] font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
                  <span style={{ color: "#1CA9C9" }}>{shortlistCount}</span>
                  {" "}{shortlistCount === 1 ? "stone" : "stones"} shortlisted
                </span>
              </div>
              <div className="w-px h-5" style={{ background: "rgba(255,255,255,0.12)" }} />
              {/* Subtle "Edit" link */}
              <button
                onClick={() => navigate("/shortlist")}
                className="text-[9px] uppercase tracking-[0.28em] transition-colors"
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.38)", cursor: "pointer", padding: "0" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.65)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.38)"; }}
              >
                Edit
              </button>
              {/* Primary enquiry CTA */}
              <button
                onClick={() => setShowEnquiryModal(true)}
                className="text-[10px] uppercase tracking-[0.35em] font-semibold text-white px-5 py-2 transition-opacity"
                style={{ background: "#1CA9C9", border: "none", cursor: "pointer" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
                data-testid="btn-submit-enquiry"
              >
                Submit Enquiry
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }