import { useRef, useEffect, useState, type CSSProperties } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
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

// ── Brand palette (matches the rest of flxdiamond.com — see About.tsx) ────
const NAVY = "#02274A";
const TEAL = "#1CA9C9";
const INACTIVE_HEAD = "rgba(2,39,74,0.28)";
const INACTIVE_TAG = "rgba(2,39,74,0.32)";
const BODY = "rgba(2,39,74,0.6)";
const LINE = "rgba(2,39,74,0.15)";

const EASE = [0.4, 0, 0.2, 1] as const;

// Vertical distance (in px) the step list travels per step. Also doubles as
// each list item's own height, so the active item always lands at the same
// anchor point at the top of the sticky viewport. Sized generously (and
// paired with overflow-hidden + line-clamping below) so a long CMS-edited
// body paragraph can never bleed into the next step instead of being cut
// off cleanly.
const ITEM_HEIGHT = 440;

// Clamp helper: truncates text to N lines with an ellipsis instead of
// letting it overflow its row (protects against long Sanity-edited copy).
function clampStyle(lines: number): CSSProperties {
  return {
    display: "-webkit-box",
    WebkitLineClamp: lines,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  };
}

// ── The polaroid-style photo stack. The front card is the active step's
// photo; the two behind it preview the next two steps, so the whole deck
// visibly re-shuffles as the reader scrolls, not just the top photo. ──────
function PhotoDeck({ panels, activeIndex }: { panels: Panel[]; activeIndex: number }) {
  const front = panels[activeIndex];
  const mid = panels[(activeIndex + 1) % panels.length];
  const back = panels[(activeIndex + 2) % panels.length];

  return (
    <div className="relative mx-auto w-full max-w-sm" style={{ aspectRatio: "4 / 5" }}>
      <motion.div
        key={`back-${back.title}`}
        className="absolute inset-0 bg-white p-2 md:p-3"
        style={{ boxShadow: "0 18px 40px rgba(2,39,74,0.16)" }}
        initial={false}
        animate={{ rotate: 7, x: 28, y: 22, scale: 0.9 }}
        transition={{ duration: 0.65, ease: EASE }}
      >
        <div className="w-full h-full overflow-hidden">
          <img src={back.img} alt="" className="w-full h-full object-cover" />
        </div>
      </motion.div>

      <motion.div
        key={`mid-${mid.title}`}
        className="absolute inset-0 bg-white p-2 md:p-3"
        style={{ boxShadow: "0 14px 32px rgba(2,39,74,0.16)" }}
        initial={false}
        animate={{ rotate: -6, x: 14, y: 12, scale: 0.95 }}
        transition={{ duration: 0.65, ease: EASE }}
      >
        <div className="w-full h-full overflow-hidden">
          <img src={mid.img} alt="" className="w-full h-full object-cover" />
        </div>
      </motion.div>

      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={`front-${front.title}`}
          className="absolute inset-0 bg-white p-2 md:p-3"
          style={{ boxShadow: "0 26px 60px rgba(2,39,74,0.24)" }}
          initial={{ opacity: 0, rotate: -3, scale: 0.96, y: 14 }}
          animate={{ opacity: 1, rotate: 0, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.03, transition: { duration: 0.3 } }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <div className="w-full h-full overflow-hidden">
            <img src={front.img} alt={front.imgAlt} className="w-full h-full object-cover" />
          </div>
          {/* Step badge — CMS-editable (`step` on the panel document). Colored
              teal for the final "FL" step, otherwise a plain white chip.
              Intro has no step number, so nothing renders for it. */}
          {front.step && (
            <div
              className="absolute top-3 left-3 md:top-4 md:left-4 px-2.5 py-1 text-[11px] font-semibold tracking-[0.15em]"
              style={{
                color: front.type === "end" ? "#FFFFFF" : NAVY,
                background: front.type === "end" ? TEAL : "rgba(255,255,255,0.92)",
                boxShadow: "0 2px 8px rgba(2,39,74,0.15)",
              }}
            >
              {front.step}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// MAIN EXPORT — self-fetches panel content from Sanity, falls back to defaults
// ══════════════════════════════════════════════════════════════════════
export default function IFtoFLHorizontalScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Pull editable panel content from Sanity. When editors have added panels
  // there, the step count follows THEIR array (add or remove a step in the
  // CMS and the page's scroll length / step list follow) — each entry only
  // falls back to the built-in defaults field-by-field, for whichever local
  // step shares its position, so a lone missing field doesn't blank out the
  // rest of a CMS-authored step. Only when Sanity has no panels at all does
  // the component fall back to the full built-in set.
  const { data } = useSanityQuery<{ conversionPanels?: SanityPanel[] }>(
    ["investment-conversion-panels"],
    INVESTMENT_PANELS_QUERY
  );
  const cmsPanels = data?.conversionPanels;
  const panels: Panel[] =
    cmsPanels && cmsPanels.length > 0
      ? cmsPanels.map((s, i) => {
          const def = H_PANELS[i] || H_PANELS[H_PANELS.length - 1];
          return {
            type: s.type || def.type,
            step: s.step ?? def.step,
            tag: s.tag || def.tag,
            title: s.title || def.title,
            body: s.body || def.body,
            img: s.imgUrl || def.img,
            imgAlt: s.imgAlt || def.imgAlt,
          };
        })
      : H_PANELS;

  const TOTAL = panels.length;

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  // Continuous (unrounded) vertical travel for the step list — smooth, tied
  // directly to scroll position rather than snapping between steps.
  const listY = useTransform(scrollYProgress, [0, 1], [0, -(TOTAL - 1) * ITEM_HEIGHT]);

  // Rounded, discrete index — drives the photo deck and which step reads as
  // "active" in the text list, so the deck doesn't reshuffle continuously.
  //
  // IMPORTANT: `scrollYProgress` is a MotionValue whose identity never
  // changes across re-renders, so a dependency array of just
  // [scrollYProgress] would only ever run this effect once, on mount — and
  // the `TOTAL` it captured in that first closure would then stay frozen
  // for the component's whole lifetime. Sanity data usually isn't back yet
  // on the very first render, so that frozen TOTAL is the *fallback*
  // H_PANELS length (7), not the real CMS panel count (e.g. 10). Once the
  // CMS data arrives and TOTAL correctly becomes 10 everywhere else, this
  // effect would keep computing `idx = round(v * (7 - 1))`, which can never
  // exceed 6 — so panels past index 6 never get marked active, even though
  // the list itself (which reads the live TOTAL) keeps scrolling past them.
  // Including TOTAL here makes the effect re-subscribe with the correct
  // value whenever the panel count changes.
  useEffect(
    () =>
      scrollYProgress.on("change", (v) => {
        const idx = Math.round(v * (TOTAL - 1));
        setActiveIndex(Math.max(0, Math.min(TOTAL - 1, idx)));
      }),
    [scrollYProgress, TOTAL]
  );

  const scrollToPanel = (idx: number) => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const top = el.offsetTop + (idx / (TOTAL - 1)) * (el.scrollHeight - window.innerHeight);
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div ref={containerRef} style={{ height: `${TOTAL * 100}vh`, position: "relative" }}>
      <div className="sticky top-0 h-screen flex items-center overflow-hidden" style={{ background: "#FFFFFF" }}>
        <div className="w-full max-w-6xl mx-auto px-6 md:px-14 lg:px-20 grid md:grid-cols-2 gap-12 md:gap-16 items-center">

          {/* Left: the photo deck */}
          <div className="order-2 md:order-1">
            <PhotoDeck panels={panels} activeIndex={activeIndex} />
          </div>

          {/* Right: vertical step list, translated upward as the reader
              scrolls so the active step always lands at the same anchor. */}
          <div className="order-1 md:order-2 relative" style={{ height: `${ITEM_HEIGHT * 1.5}px`, overflow: "hidden" }}>
            {/* dashed connector running the full list */}
            <div
              className="absolute top-0 bottom-0"
              style={{ left: "6px", borderLeft: `1.5px dashed ${LINE}` }}
            />

            <motion.div style={{ y: listY }} className="absolute inset-x-0 top-0">
              {panels.map((panel, i) => {
                const isActive = i === activeIndex;
                return (
                  <div
                    key={i}
                    className="relative pl-8 overflow-hidden"
                    style={{ height: `${ITEM_HEIGHT}px` }}
                  >
                    <button
                      type="button"
                      onClick={() => scrollToPanel(i)}
                      aria-label={`Go to step ${i + 1}`}
                      className="absolute -left-0.5 top-2 w-3 h-3 rotate-45 transition-colors"
                      style={{ background: isActive ? TEAL : "rgba(2,39,74,0.12)" }}
                    />
                    <p
                      className="text-xs font-medium uppercase tracking-[0.2em] mb-3 transition-colors duration-500"
                      style={{ color: isActive ? TEAL : INACTIVE_TAG, ...clampStyle(1) }}
                    >
                      {panel.tag}
                    </p>
                    <h3
                      className="font-sans font-extrabold leading-tight mb-3 whitespace-pre-line transition-all duration-500"
                      style={{
                        fontSize: isActive ? "clamp(1.75rem, 3.2vw, 2.5rem)" : "1.35rem",
                        color: isActive ? NAVY : INACTIVE_HEAD,
                        ...clampStyle(2),
                      }}
                    >
                      {panel.title}
                    </h3>
                    {/* Body copy only renders for the active step — CMS text
                        length varies a lot between steps, so an inactive row
                        never reserves (or bleeds) space for a paragraph it
                        isn't showing. The clamp is a hard ceiling for
                        whichever step is active, in case its own copy runs
                        unusually long. */}
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="text-sm sm:text-base leading-relaxed max-w-md"
                        style={{ color: BODY, ...clampStyle(6) }}
                      >
                        {panel.body}
                      </motion.p>
                    )}
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* step counter, bottom-right */}
        <div
          className="absolute bottom-6 right-6 md:right-10 text-xs tracking-[0.25em]"
          style={{ color: "rgba(2,39,74,0.4)" }}
        >
          {String(activeIndex + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
        </div>
      </div>
    </div>
  );
}