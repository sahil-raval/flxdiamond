import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useSanityQuery } from "@/lib/useSanityData";
import { INVESTMENT_PANELS_QUERY } from "@/lib/sanity-queries";

// ── Default panels (used as fallback when Sanity has no content) ──────────
const H_PANELS = [
  {
    type: "intro",
    step: null as string | null,
    tag: "The Exact Process",
    title: "Six Steps from IF\nto Flawless.",
    body: "A documented, repeatable path from GIA IF certificate to GIA FL certificate. Every stage is defined. Every outcome is verifiable.",
    img: "/1.jpg",
    imgAlt: "FL diamond — overhead",
  },
  {
    type: "step",
    step: "01",
    tag: "Free · 24 h response",
    title: "Submit Your\nGIA Certificate",
    body: "Send us the certificate number. We read the GIA Comments field — specific language such as 'extra facet' or 'surface graining' is the key indicator of conversion candidacy.",
    img: "/2.jpg",
    imgAlt: "GIA FL Certificate",
  },
  {
    type: "step",
    step: "02",
    tag: "Technical GIA reading",
    title: "We Read Between\nthe Grades",
    body: "Our team decodes the GIA Comments section. An IF grade often contains surface characteristics invisible to the naked eye — and removable without touching carat weight.",
    img: "/3.jpg",
    imgAlt: "Diamond analysis",
  },
  {
    type: "decision",
    step: "?",
    tag: "~15–20% of IF stones qualify",
    title: "Does Your Stone\nQualify?",
    body: "The surface characteristic must be removable without crossing the carat threshold. Roughly 1 in 5 IF stones pass this filter. You receive a clear yes or no — at no cost.",
    img: "/4.jpg",
    imgAlt: "Diamond qualification",
  },
  {
    type: "step",
    step: "03",
    tag: "Written · No obligation",
    title: "A Clear,\nWritten Assessment",
    body: "If the stone qualifies, we deliver a written feasibility report — projected FL outcome, timeline, and cost structure. No commitment required at this stage.",
    img: "/5.jpg",
    imgAlt: "Written assessment",
  },
  {
    type: "step",
    step: "04",
    tag: "47 years · Babu Vekariya",
    title: "The Craft of\nPrecision",
    body: "Babu Vekariya executes the precision micro-regrind. Under 0.01mm removed from the affected facet. Hours per stone. No automation, no margin for error.",
    img: "/6.jpg",
    imgAlt: "Precision regrind",
  },
  {
    type: "end",
    step: "FL",
    tag: "Value uplift: 15–35%",
    title: "Your Stone.\nReborn Flawless.",
    body: "The stone is independently resubmitted to GIA. A new Flawless certificate is issued — same carat bracket, verifiable, permanent, globally recognised.",
    img: "/7.jpg",
    imgAlt: "FL diamond — result",
  },
];

type Panel = (typeof H_PANELS)[number];

// Shape returned by INVESTMENT_PANELS_QUERY
type SanityPanel = {
  type?: string;
  step?: string | null;
  tag?: string;
  title?: string;
  body?: string;
  imgAlt?: string;
  imgUrl?: string;
};

const TOTAL = H_PANELS.length;

// ── Dark navy wall palette ─────────────────────────────────────────────
// Base wall tone: #03274a. The rest of the palette is derived from it so
// the rail, skirting, and vignette all stay in the same hue family.
const WALL        = "#03274a";
const WALL_MID     = "#02203d";
const WALL_SHADOW = "#010b18";
const WALL_LIGHT  = "#0f4172";

// Teal palette — brightened slightly so it reads clearly on a dark ground
const T = {
  full:  "#2FC6E8",
  mid:   "rgba(47,198,232,0.65)",
  soft:  "rgba(47,198,232,0.35)",
  dim:   "rgba(47,198,232,0.15)",
  text:  "#5FDBF0",
};

// Text on the dark wall
const INK       = "#F2F5F9";
const INK_SOFT  = "rgba(242,245,249,0.58)";
const INK_FAINT = "rgba(242,245,249,0.38)";

// Single smooth easing curve used everywhere so nothing feels jerky
// relative to anything else on the page.
const EASE = [0.4, 0, 0.2, 1] as const;

// Subtle grain texture as an inline SVG noise tile — this is what gives
// the whole scene a filmic, non-flat quality instead of looking like a
// clean vector render.
const GRAIN_URI =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'>
      <filter id='n'>
        <feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/>
        <feColorMatrix type='saturate' values='0'/>
      </filter>
      <rect width='100%' height='100%' filter='url(#n)'/>
    </svg>`
  );

function getSlotStyle(distance: number) {
  if (distance === 0) return { scale: 1,    opacity: 1,    zIndex: 10, blur: 0 };
  if (distance === 1) return { scale: 0.81, opacity: 0.4,  zIndex: 6,  blur: 2 };
  if (distance === 2) return { scale: 0.65, opacity: 0.16, zIndex: 2,  blur: 4 };
  return                      { scale: 0.52, opacity: 0.06, zIndex: 1,  blur: 6 };
}

function cssEase(e: readonly [number, number, number, number]) {
  return `cubic-bezier(${e[0]}, ${e[1]}, ${e[2]}, ${e[3]})`;
}

// ── Single gallery frame ────────────────────────────────────────────────
function GalleryFrame({
  panel,
  index,
  activeIndex,
  onClick,
}: {
  panel: Panel;
  index: number;
  activeIndex: number;
  onClick: () => void;
}) {
  const isEnd      = panel.type === "end";
  const isDecision = panel.type === "decision";
  const isIntro    = panel.type === "intro";
  const isActive   = index === activeIndex;
  const distance   = Math.abs(index - activeIndex);
  const { scale, opacity, zIndex, blur } = getSlotStyle(distance);

  // ── Responsive sizing ──────────────────────────────────────────────
  const frameSize = isActive
  ? "clamp(260px, min(50vh, 56vw), 520px)"
  : "clamp(190px, min(36vh, 40vw), 380px)";
  const frameMax  = isActive ? "520px" : "380px";

  return (
    <motion.div
      onClick={onClick}
      animate={{ scale, opacity }}
      transition={{ duration: 0.85, ease: EASE }}
      style={{
        position: "relative", flexShrink: 0,
        display: "flex", flexDirection: "column", alignItems: "center",
        zIndex, cursor: isActive ? "default" : "pointer",
        width: "100vw",
      }}
    >
      {/* Image container — a plate the image sits centered inside of.
          Depth-of-field blur (via getSlotStyle) does the work of pulling
          focus toward the active frame, cinematic-lens style, instead of
          a glow shape doing it. */}
      <div style={{
        position: "relative",
        width: frameSize, height: frameSize,
        maxWidth: frameMax, maxHeight: frameMax,
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
        background: "transparent",
        boxShadow: isActive
          ? "0 24px 70px rgba(0,0,0,0.6)"
          : "0 8px 24px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.4)",
        transition: [
          `width 0.85s ${cssEase(EASE)}`,
          `height 0.85s ${cssEase(EASE)}`,
          `max-width 0.85s ${cssEase(EASE)}`,
          `max-height 0.85s ${cssEase(EASE)}`,
          `box-shadow 0.6s ${cssEase(EASE)}`,
        ].join(", "),
        flexShrink: 0,
      }}>
        {/* Image — centered, contained, no crop, no border */}
        <img
          src={panel.img}
          alt={panel.imgAlt}
          style={{
            display: "block",
            margin: "auto",
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
            filter: isActive
              ? "brightness(1.1) contrast(1.1) saturate(1.05)"
              : `brightness(0.32) contrast(0.92) saturate(0.5) blur(${blur}px)`,
            transition: `filter 0.7s ${cssEase(EASE)}`,
            zIndex: 1,
          }}
        />

        {/* Rim-light sweep across the top of the active image, like a
            spotlight grazing the surface */}
        {isActive && (
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(160deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.05) 22%, transparent 46%)",
            pointerEvents: "none", zIndex: 2, mixBlendMode: "screen",
          }} />
        )}

        {/* Cool falloff at the base — the beam's light pools and fades
            toward the bottom of the frame rather than stopping sharply */}
        {isActive && (
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(1,11,24,0.35) 0%, transparent 40%)",
            pointerEvents: "none", zIndex: 2,
          }} />
        )}

        {/* Ghosted IF→FL on intro */}
        {isIntro && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "Georgia, serif",
            fontSize: "clamp(1.5rem, 5vw, 4rem)",
            letterSpacing: "-0.04em",
            color: "rgba(47,198,232,0.08)",
            pointerEvents: "none", zIndex: 2, userSelect: "none",
          }}>IF→FL</div>
        )}

        {/* Step badge */}
        {panel.step && isActive && (
          <div style={{
            position: "absolute",
            top: "10px", left: "10px",
            padding: "4px 10px",
            fontFamily: "Georgia, serif", fontSize: "10px", letterSpacing: "0.1em",
            color: isEnd ? T.full : T.text,
            background: "rgba(1,11,24,0.72)",
            boxShadow: "0 1px 6px rgba(0,0,0,0.4)",
            zIndex: 8,
          }}>{panel.step}</div>
        )}

        {/* Decision badge */}
        {isDecision && isActive && (
          <div style={{
            position: "absolute",
            bottom: "10px", right: "10px",
            padding: "4px 10px", fontSize: "7px",
            fontFamily: "'Inter', sans-serif", letterSpacing: "0.35em", textTransform: "uppercase",
            color: T.text,
            background: "rgba(1,11,24,0.72)",
            boxShadow: "0 1px 6px rgba(0,0,0,0.4)",
            zIndex: 8,
          }}>~20% qualify</div>
        )}

        {/* FL badge */}
        {isEnd && isActive && (
          <div style={{
            position: "absolute",
            top: "10px", right: "10px",
            padding: "4px 12px", fontSize: "7px",
            fontFamily: "'Inter', sans-serif", letterSpacing: "0.35em", textTransform: "uppercase",
            color: T.full,
            background: "rgba(1,11,24,0.72)",
            boxShadow: "0 1px 6px rgba(0,0,0,0.4)",
            zIndex: 8,
          }}>Flawless</div>
        )}
      </div>

      {/* Caption */}
      <motion.div
        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 8 }}
        transition={{ duration: 0.6, ease: EASE, delay: isActive ? 0.15 : 0 }}
        style={{
          marginTop: "22px", textAlign: "center",
          pointerEvents: "none", maxWidth: "min(64vw, 500px)",
        }}
      >
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: "8px",
          letterSpacing: "0.5em", textTransform: "uppercase",
          color: isEnd ? T.full : T.text, marginBottom: "8px", fontWeight: 500,
        }}>{panel.tag}</p>

        <h2 style={{
          fontFamily: "Georgia, serif",
          fontSize: "clamp(1rem, 1.9vw, 1.3rem)",
          letterSpacing: "0.14em", textTransform: "uppercase",
          color: INK, lineHeight: 1.35, whiteSpace: "pre-line", marginBottom: "10px",
        }}>{panel.title}</h2>

        <p style={{
          fontFamily: "Georgia, serif", fontStyle: "italic",
          fontSize: "clamp(0.7rem, 1vw, 0.82rem)",
          color: INK_SOFT, letterSpacing: "0.02em", lineHeight: 1.7,
        }}>{panel.body}</p>

        {isDecision && (
          <div style={{
            display: "inline-flex", alignItems: "flex-start", gap: "10px",
            marginTop: "14px", padding: "10px 16px",
            background: "rgba(47,198,232,0.06)", maxWidth: "340px", textAlign: "left",
          }}>
            <span style={{
              fontSize: "7px", letterSpacing: "0.35em", textTransform: "uppercase",
              color: T.text, marginTop: "2px", flexShrink: 0,
              fontFamily: "'Inter', sans-serif",
            }}>If no →</span>
            <p style={{ fontSize: "11px", color: INK_FAINT, lineHeight: 1.55, fontFamily: "'Inter', sans-serif" }}>
              Stone returned unchanged. No cost. No risk. Full discretion maintained.
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// MAIN EXPORT — self-fetches panel content from Sanity, falls back to defaults
// ══════════════════════════════════════════════════════════════════════
export default function IFtoFLHorizontalScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [vpWidth, setVpWidth]         = useState(() => typeof window !== "undefined" ? window.innerWidth : 1440);
  const [activeIndex, setActiveIndex] = useState(0);

  // Pull editable panel content from Sanity. Each field falls back to the
  // built-in default when empty, so the component always renders fully.
  const { data } = useSanityQuery<{ conversionPanels?: SanityPanel[] }>(
    ["investment-conversion-panels"],
    INVESTMENT_PANELS_QUERY
  );
  const panels: Panel[] = H_PANELS.map((def, i) => {
    const s = data?.conversionPanels?.[i];
    if (!s) return def;
    return {
      ...def,
      type: s.type || def.type,
      step: s.step ?? def.step,
      tag: s.tag || def.tag,
      title: s.title || def.title,
      body: s.body || def.body,
      img: s.imgUrl || def.img,
      imgAlt: s.imgAlt || def.imgAlt,
    };
  });

  useEffect(() => {
    const h = () => setVpWidth(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  useEffect(() => scrollYProgress.on("change", (v) => {
    const idx = Math.round(v * (TOTAL - 1));
    setActiveIndex(Math.max(0, Math.min(TOTAL - 1, idx)));
  }), [scrollYProgress]);

  const x           = useTransform(scrollYProgress, [0, 1], [0, -(TOTAL - 1) * vpWidth]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  const scrollToPanel = useCallback((idx: number) => {
    if (!containerRef.current) return;
    const el  = containerRef.current;
    const top = el.offsetTop + (idx / (TOTAL - 1)) * (el.scrollHeight - window.innerHeight);
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  return (
    <div ref={containerRef} style={{ height: `${TOTAL * 100}vh`, position: "relative" }}>

      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: WALL }}>

        {/* Wall: dark navy radial — brighter navy centre fading to near-black edges */}
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse 80% 75% at 50% 40%, ${WALL_LIGHT} 0%, ${WALL} 52%, ${WALL_SHADOW} 100%)`,
          zIndex: 0, pointerEvents: "none",
        }} />

        {/* Ambient ceiling wash — very large, very soft, just enough to
            suggest the light source without ever forming a visible shape */}
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: "70vw", height: "92vh",
          background: "radial-gradient(ellipse 48% 56% at 50% 0%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 40%, transparent 68%)",
          pointerEvents: "none", zIndex: 1,
        }} />

        {/* Teal ambient bleed from the ceiling apex */}
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: "50vw", height: "42vh",
          background: "radial-gradient(ellipse 45% 50% at 50% 0%, rgba(47,198,232,0.09) 0%, transparent 70%)",
          pointerEvents: "none", zIndex: 1,
        }} />

        {/* ── Picture rail — dark brushed-metal moulding ── */}
        <div style={{
          position: "absolute", top: "57px", left: 0, right: 0, height: "4px",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.35), transparent)",
          zIndex: 3, pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "61px", left: 0, right: 0, height: "10px",
          background: `linear-gradient(to bottom, ${WALL_LIGHT} 0%, ${WALL_MID} 45%, ${WALL_SHADOW} 100%)`,
          boxShadow: [
            "0 4px 10px rgba(0,0,0,0.45)",
            "0 1px 3px rgba(0,0,0,0.30)",
            "inset 0 1px 0 rgba(255,255,255,0.18)",
            "inset 0 -1px 0 rgba(0,0,0,0.3)",
          ].join(", "),
          zIndex: 3, pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "71px", left: 0, right: 0, height: "10px",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.35), transparent)",
          zIndex: 3, pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "81px", left: "12%", right: "12%", height: "1px",
          background: `linear-gradient(90deg, transparent, ${T.dim} 20%, ${T.soft} 50%, ${T.dim} 80%, transparent)`,
          zIndex: 3, pointerEvents: "none",
        }} />

        {/* ── Skirting board — dark navy metal ── */}
        <div style={{
          position: "absolute", bottom: "48px", left: 0, right: 0, height: "1px",
          background: "rgba(255,255,255,0.10)",
          zIndex: 3, pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "30px", left: 0, right: 0, height: "18px",
          background: `linear-gradient(to bottom, ${WALL_LIGHT} 0%, ${WALL_MID} 45%, ${WALL_SHADOW} 100%)`,
          boxShadow: [
            "0 -3px 8px rgba(0,0,0,0.35)",
            "inset 0 1px 0 rgba(255,255,255,0.14)",
          ].join(", "),
          zIndex: 3, pointerEvents: "none",
        }} />
        {/* Baseboard */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "30px",
          background: `linear-gradient(to bottom, ${WALL_SHADOW} 0%, #010509 100%)`,
          boxShadow: "inset 0 2px 5px rgba(0,0,0,0.4)",
          zIndex: 3, pointerEvents: "none",
        }} />

        {/* Side wall shadow vignette */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, rgba(0,0,0,0.55) 0%, transparent 13%, transparent 87%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none", zIndex: 9,
        }} />

        {/* Gallery track — vertically centered so the frame sits with
            balanced space above and below, instead of hugging the rail
            and leaving a large empty gap at the bottom */}
        <motion.div style={{
          x, display: "flex", alignItems: "center",
          height: "100%", willChange: "transform", paddingTop: "40px",
        }}>
          {panels.map((panel, i) => (
            <GalleryFrame
              key={i} panel={panel} index={i} activeIndex={activeIndex}
              onClick={() => { if (i !== activeIndex) scrollToPanel(i); }}
            />
          ))}
        </motion.div>

        {/* Cinematic vignette — darkens the corners so the eye is pulled
            toward the lit frame at centre, like a stage seen from the
            audience rather than a flat screenshot */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 100% 100% at 50% 48%, transparent 45%, rgba(0,0,0,0.22) 78%, rgba(0,0,0,0.5) 100%)",
          pointerEvents: "none", zIndex: 11,
        }} />

        {/* Film grain — subtle texture so the scene reads as photographed
            light rather than a flat vector render */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url("${GRAIN_URI}")`,
          backgroundSize: "140px 140px",
          opacity: 0.05,
          mixBlendMode: "overlay",
          pointerEvents: "none", zIndex: 12,
        }} />

        {/* FLX wordmark — top left */}
        <div style={{
          position: "absolute", top: "16px", left: "28px",
          fontFamily: "Georgia, serif", fontSize: "10px",
          letterSpacing: "0.45em", textTransform: "uppercase",
          color: INK_FAINT, zIndex: 15, userSelect: "none",
        }}>FLX · IF→FL</div>

        {/* Step counter — top right */}
        <div style={{
          position: "absolute", top: "16px", right: "28px",
          fontFamily: "'Inter', sans-serif", fontSize: "9px",
          letterSpacing: "0.35em", color: INK_FAINT,
          zIndex: 15, userSelect: "none",
        }}>{String(activeIndex + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}</div>

        {/* Dot nav */}
        <div style={{
          position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)",
          display: "flex", alignItems: "center", gap: "8px", zIndex: 15,
        }}>
          {panels.map((_, i) => (
            <button key={i} onClick={() => scrollToPanel(i)} aria-label={`Go to step ${i + 1}`} style={{
              width: i === activeIndex ? "30px" : "5px", height: "2px",
              background: i === activeIndex ? T.full : "rgba(47,198,232,0.28)",
              border: "none", padding: 0, cursor: "pointer",
              transition: `all 0.6s ${cssEase(EASE)}`,
            }} />
          ))}
        </div>

        {/* Scroll hint */}
        <motion.div style={{
          opacity: hintOpacity, position: "absolute", bottom: "54px", left: "28px", zIndex: 15,
        }}>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: "8px",
            letterSpacing: "0.45em", textTransform: "uppercase",
            color: INK_FAINT, marginBottom: "7px",
          }}>Scroll to explore</p>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "22px", height: "1px", background: T.soft }} />
            <svg width="5" height="9" viewBox="0 0 5 9" fill="none">
              <path d="M1 1l3 3.5L1 8" stroke={T.mid} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </motion.div>

      </div>
    </div>
  );
}