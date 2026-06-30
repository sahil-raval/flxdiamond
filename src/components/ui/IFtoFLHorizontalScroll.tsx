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

// Pure grey wall — no beige, no warm tones
const WALL        = "#EBEBEB";
const WALL_MID    = "#D8D8D8";
const WALL_SHADOW = "#C2C2C2";
const WALL_LIGHT  = "#F5F5F5";

// Teal palette
const T = {
  full:  "#1CA9C9",
  mid:   "rgba(28,169,201,0.65)",
  soft:  "rgba(28,169,201,0.35)",
  dim:   "rgba(28,169,201,0.15)",
  text:  "#0e6b80",
};

function getSlotStyle(distance: number) {
  if (distance === 0) return { scale: 1,    opacity: 1,    zIndex: 10 };
  if (distance === 1) return { scale: 0.81, opacity: 0.45, zIndex: 6  };
  if (distance === 2) return { scale: 0.65, opacity: 0.20, zIndex: 2  };
  return                      { scale: 0.52, opacity: 0.08, zIndex: 1  };
}

// ── 3-D Spanish moulding — pure grey, no beige ─────────────────────────
function MouldingFrame({
  active,
  isEnd,
  isDecision,
}: {
  active: boolean;
  isEnd: boolean;
  isDecision: boolean;
}) {
  const accentColor = isEnd ? T.full : isDecision ? T.mid : T.soft;

  return (
    <>
      {/* Layer 1 — outermost raised bead, lit top-left */}
      <div style={{
        position: "absolute", inset: 0,
        border: "10px solid transparent",
        borderTopColor:    "rgba(255,255,255,0.92)",
        borderLeftColor:   "rgba(255,255,255,0.82)",
        borderBottomColor: "rgba(150,150,150,0.95)",
        borderRightColor:  "rgba(150,150,150,0.88)",
        zIndex: 6, pointerEvents: "none", boxSizing: "border-box",
      }} />

      {/* Layer 2 — recessed shadow channel */}
      <div style={{
        position: "absolute", inset: "10px",
        border: "6px solid transparent",
        borderTopColor:    "rgba(130,130,130,0.95)",
        borderLeftColor:   "rgba(130,130,130,0.85)",
        borderBottomColor: "rgba(255,255,255,0.65)",
        borderRightColor:  "rgba(255,255,255,0.58)",
        zIndex: 6, pointerEvents: "none", boxSizing: "border-box",
      }} />

      {/* Layer 3 — inner raised flat field */}
      <div style={{
        position: "absolute", inset: "16px",
        border: "7px solid transparent",
        borderTopColor:    "rgba(255,255,255,0.75)",
        borderLeftColor:   "rgba(255,255,255,0.68)",
        borderBottomColor: "rgba(145,145,145,0.9)",
        borderRightColor:  "rgba(145,145,145,0.82)",
        zIndex: 6, pointerEvents: "none", boxSizing: "border-box",
      }} />

      {/* Layer 4 — teal accent innermost rule */}
      <div style={{
        position: "absolute", inset: "23px",
        border: `2px ${isDecision ? "dashed" : "solid"} ${accentColor}`,
        zIndex: 7, pointerEvents: "none", boxSizing: "border-box",
        transition: "border-color 0.4s ease",
        boxShadow: active ? `inset 0 0 0 1px ${T.dim}, 0 0 0 1px ${T.dim}` : "none",
      }} />

      {/* Active teal glow halo */}
      {active && (
        <div style={{
          position: "absolute", inset: "-4px",
          boxShadow: `0 0 0 1px ${T.dim}, 0 0 28px rgba(28,169,201,0.18)`,
          zIndex: 5, pointerEvents: "none",
        }} />
      )}

      {/* 3-D drop shadow — frame lifts off the wall */}
      <div style={{
        position: "absolute", inset: 0,
        boxShadow: active
          ? [
              "8px 16px 48px rgba(0,0,0,0.38)",
              "4px 8px 18px rgba(0,0,0,0.28)",
              "2px 4px 6px rgba(0,0,0,0.18)",
              "-2px -2px 0 rgba(255,255,255,0.7)",
            ].join(", ")
          : [
              "4px 8px 24px rgba(0,0,0,0.22)",
              "2px 4px 8px rgba(0,0,0,0.14)",
              "1px 2px 3px rgba(0,0,0,0.10)",
            ].join(", "),
        zIndex: 5, pointerEvents: "none", transition: "box-shadow 0.5s ease",
      }} />
    </>
  );
}

// ── Hanging wire ────────────────────────────────────────────────────────
function HangingWire({ active }: { active: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
      {/* Hook */}
      <div style={{
        width: 7, height: 7, borderRadius: "50%",
        background: active
          ? "radial-gradient(circle at 35% 35%, #e0e0e0, #888)"
          : "radial-gradient(circle at 35% 35%, #d0d0d0, #aaa)",
        boxShadow: active
          ? "0 1px 4px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.5)"
          : "0 1px 2px rgba(0,0,0,0.25)",
        transition: "all 0.4s",
        flexShrink: 0,
      }} />
      {/* Wire strand */}
      <div style={{
        width: "1.5px", height: "52px",
        background: active
          ? "linear-gradient(to bottom, rgba(160,160,160,0.85) 0%, rgba(110,110,110,0.35) 100%)"
          : "linear-gradient(to bottom, rgba(160,160,160,0.35) 0%, rgba(110,110,110,0.08) 100%)",
        transition: "background 0.4s",
      }} />
    </div>
  );
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
  const { scale, opacity, zIndex } = getSlotStyle(distance);

  const frameSize    = isActive ? "min(50vh, 46vw)" : "min(38vh, 36vw)";
  const frameMax     = isActive ? "500px" : "360px";
  const totalPadding = 26;

  return (
    <motion.div
      onClick={onClick}
      animate={{ scale, opacity }}
      transition={{ duration: 0.72, ease: [0.77, 0, 0.175, 1] }}
      style={{
        position: "relative", flexShrink: 0,
        display: "flex", flexDirection: "column", alignItems: "center",
        zIndex, cursor: isActive ? "default" : "pointer",
        width: "100vw", paddingTop: "4vh",
      }}
    >
      <HangingWire active={isActive} />

      {/* Moulding container — pure grey, no beige */}
      <div style={{
        position: "relative",
        width: frameSize, height: frameSize,
        maxWidth: frameMax, maxHeight: frameMax,
        background: WALL,
        transition: "width 0.65s cubic-bezier(0.77,0,0.175,1), height 0.65s, max-width 0.65s, max-height 0.65s",
        flexShrink: 0,
      }}>
        <MouldingFrame active={isActive} isEnd={isEnd} isDecision={isDecision} />

        {/* Image inset */}
        <img
          src={panel.img}
          alt={panel.imgAlt}
          style={{
            position: "absolute",
            inset: `${totalPadding}px`,
            width: `calc(100% - ${totalPadding * 2}px)`,
            height: `calc(100% - ${totalPadding * 2}px)`,
            objectFit: isIntro ? "contain" : "cover",
            objectPosition: "center",
            padding: isIntro ? "12px" : 0,
            filter: isActive
              ? "brightness(0.88) contrast(1.05) saturate(0.82)"
              : "brightness(0.55) contrast(0.95) saturate(0.55)",
            background: "#d4d4d4",
            display: "block",
            transition: "filter 0.5s ease",
            zIndex: 1,
          }}
        />

        {/* Ghosted IF→FL on intro */}
        {isIntro && (
          <div style={{
            position: "absolute", inset: `${totalPadding}px`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "Georgia, serif",
            fontSize: "clamp(1.5rem, 5vw, 4rem)",
            letterSpacing: "-0.04em",
            color: "rgba(28,169,201,0.06)",
            pointerEvents: "none", zIndex: 2, userSelect: "none",
          }}>IF→FL</div>
        )}

        {/* Step badge */}
        {panel.step && isActive && (
          <div style={{
            position: "absolute",
            top: `${totalPadding + 8}px`, left: `${totalPadding + 8}px`,
            padding: "4px 10px",
            fontFamily: "Georgia, serif", fontSize: "10px", letterSpacing: "0.1em",
            color: isEnd ? T.full : T.text,
            background: "rgba(235,235,235,0.95)",
            border: `1px solid ${isEnd ? T.mid : T.soft}`,
            boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
            zIndex: 8,
          }}>{panel.step}</div>
        )}

        {/* Decision badge */}
        {isDecision && isActive && (
          <div style={{
            position: "absolute",
            bottom: `${totalPadding + 8}px`, right: `${totalPadding + 8}px`,
            padding: "4px 10px", fontSize: "7px",
            fontFamily: "'Inter', sans-serif", letterSpacing: "0.35em", textTransform: "uppercase",
            color: T.text,
            background: "rgba(235,235,235,0.95)",
            border: `1px dashed ${T.soft}`,
            boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
            zIndex: 8,
          }}>~20% qualify</div>
        )}

        {/* FL badge */}
        {isEnd && isActive && (
          <div style={{
            position: "absolute",
            top: `${totalPadding + 8}px`, right: `${totalPadding + 8}px`,
            padding: "4px 12px", fontSize: "7px",
            fontFamily: "'Inter', sans-serif", letterSpacing: "0.35em", textTransform: "uppercase",
            color: T.full,
            background: "rgba(235,235,235,0.95)",
            border: `1px solid ${T.mid}`,
            boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
            zIndex: 8,
          }}>Flawless</div>
        )}
      </div>

      {/* Caption */}
      <motion.div
        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 8 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: isActive ? 0.12 : 0 }}
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
          color: "#02274A", lineHeight: 1.35, whiteSpace: "pre-line", marginBottom: "10px",
        }}>{panel.title}</h2>

        <p style={{
          fontFamily: "Georgia, serif", fontStyle: "italic",
          fontSize: "clamp(0.7rem, 1vw, 0.82rem)",
          color: "rgba(2,39,74,0.48)", letterSpacing: "0.02em", lineHeight: 1.7,
        }}>{panel.body}</p>

        {isDecision && (
          <div style={{
            display: "inline-flex", alignItems: "flex-start", gap: "10px",
            marginTop: "14px", padding: "10px 16px",
            border: `1px solid ${T.dim}`,
            background: "rgba(28,169,201,0.04)", maxWidth: "340px", textAlign: "left",
          }}>
            <span style={{
              fontSize: "7px", letterSpacing: "0.35em", textTransform: "uppercase",
              color: T.text, marginTop: "2px", flexShrink: 0,
              fontFamily: "'Inter', sans-serif",
            }}>If no →</span>
            <p style={{ fontSize: "11px", color: "rgba(2,39,74,0.45)", lineHeight: 1.55, fontFamily: "'Inter', sans-serif" }}>
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

        {/* Wall: pure grey radial — bright centre, darker edges, zero beige */}
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse 80% 75% at 50% 40%, ${WALL_LIGHT} 0%, ${WALL} 52%, ${WALL_SHADOW} 100%)`,
          zIndex: 0, pointerEvents: "none",
        }} />

        {/* Ceiling spotlight — neutral white, no colour cast */}
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: "65vw", height: "88vh",
          background: "radial-gradient(ellipse 50% 54% at 50% 0%, rgba(255,255,255,0.55) 0%, transparent 65%)",
          pointerEvents: "none", zIndex: 1,
        }} />

        {/* Very subtle teal tint at ceiling apex only */}
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: "50vw", height: "40vh",
          background: "radial-gradient(ellipse 45% 50% at 50% 0%, rgba(28,169,201,0.04) 0%, transparent 70%)",
          pointerEvents: "none", zIndex: 1,
        }} />

        {/* ── Picture rail — pure grey 3-D moulding ── */}
        {/* Shadow above */}
        <div style={{
          position: "absolute", top: "57px", left: 0, right: 0, height: "4px",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.10), transparent)",
          zIndex: 3, pointerEvents: "none",
        }} />
        {/* Rail body */}
        <div style={{
          position: "absolute", top: "61px", left: 0, right: 0, height: "10px",
          background: `linear-gradient(to bottom, ${WALL_LIGHT} 0%, ${WALL_MID} 45%, ${WALL_SHADOW} 100%)`,
          boxShadow: [
            "0 4px 10px rgba(0,0,0,0.16)",
            "0 1px 3px rgba(0,0,0,0.10)",
            "inset 0 1px 0 rgba(255,255,255,0.95)",
            "inset 0 -1px 0 rgba(0,0,0,0.06)",
          ].join(", "),
          zIndex: 3, pointerEvents: "none",
        }} />
        {/* Rail bottom drop shadow */}
        <div style={{
          position: "absolute", top: "71px", left: 0, right: 0, height: "10px",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.12), transparent)",
          zIndex: 3, pointerEvents: "none",
        }} />
        {/* Teal accent line under rail */}
        <div style={{
          position: "absolute", top: "81px", left: "12%", right: "12%", height: "1px",
          background: `linear-gradient(90deg, transparent, ${T.dim} 20%, ${T.soft} 50%, ${T.dim} 80%, transparent)`,
          zIndex: 3, pointerEvents: "none",
        }} />

        {/* ── Skirting board — pure grey ── */}
        <div style={{
          position: "absolute", bottom: "48px", left: 0, right: 0, height: "1px",
          background: "rgba(255,255,255,0.75)",
          zIndex: 3, pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "30px", left: 0, right: 0, height: "18px",
          background: `linear-gradient(to bottom, ${WALL_LIGHT} 0%, ${WALL_MID} 45%, ${WALL_SHADOW} 100%)`,
          boxShadow: [
            "0 -3px 8px rgba(0,0,0,0.10)",
            "inset 0 1px 0 rgba(255,255,255,0.9)",
          ].join(", "),
          zIndex: 3, pointerEvents: "none",
        }} />
        {/* Baseboard */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "30px",
          background: `linear-gradient(to bottom, ${WALL_SHADOW} 0%, #B8B8B8 100%)`,
          boxShadow: "inset 0 2px 5px rgba(0,0,0,0.12)",
          zIndex: 3, pointerEvents: "none",
        }} />

        {/* Side wall shadow vignette */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, rgba(170,170,170,0.58) 0%, transparent 13%, transparent 87%, rgba(170,170,170,0.58) 100%)",
          pointerEvents: "none", zIndex: 9,
        }} />

        {/* Gallery track */}
        <motion.div style={{
          x, display: "flex", alignItems: "flex-start",
          height: "100%", willChange: "transform", paddingTop: "61px",
        }}>
          {panels.map((panel, i) => (
            <GalleryFrame
              key={i} panel={panel} index={i} activeIndex={activeIndex}
              onClick={() => { if (i !== activeIndex) scrollToPanel(i); }}
            />
          ))}
        </motion.div>

        {/* FLX wordmark — top left */}
        <div style={{
          position: "absolute", top: "16px", left: "28px",
          fontFamily: "Georgia, serif", fontSize: "10px",
          letterSpacing: "0.45em", textTransform: "uppercase",
          color: "rgba(2,39,74,0.42)", zIndex: 15, userSelect: "none",
        }}>FLX · IF→FL</div>

        {/* Step counter — top right */}
        <div style={{
          position: "absolute", top: "16px", right: "28px",
          fontFamily: "'Inter', sans-serif", fontSize: "9px",
          letterSpacing: "0.35em", color: "rgba(2,39,74,0.35)",
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
              background: i === activeIndex ? T.full : "rgba(28,169,201,0.25)",
              border: "none", padding: 0, cursor: "pointer",
              transition: "all 0.4s cubic-bezier(0.77,0,0.175,1)",
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
            color: "rgba(2,39,74,0.38)", marginBottom: "7px",
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