import { useRef, useState, useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useSanityQuery } from "@/lib/useSanityData";
import { isSanityConfigured } from "@/lib/sanity";
import { JOURNAL_ARTICLES_QUERY, JOURNAL_PAGE_QUERY } from "@/lib/sanity-queries";

// ── Responsive hook ────────────────────────────────────────────────────
function useWindowWidth() {
  const [width, setWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler, { passive: true });
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

// ── Motion helpers ─────────────────────────────────────────────────────
const EASE = [0.25, 0.1, 0.25, 1] as const;

// ── Minimal Link shim ──────────────────────────────────────────────────
function Link({ href, className, children, style, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return <a href={href} className={className} style={style} {...rest}>{children}</a>;
}

// ── Sanity article type ────────────────────────────────────────────────
interface SanityArticle {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  category: string;
  excerpt: string;
  coverImageUrl?: string;
  featured: boolean;
}

function formatDate(d: string) {
  try { return new Date(d).toLocaleDateString("en-AU", { year: "numeric", month: "long", day: "numeric" }); } catch { return d; }
}

const up = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const ARTICLES = [
  {
    id: 1,
    title: "Understanding GIA Certificate Comments",
    date: "March 15, 2026",
    category: "Expertise",
    excerpt: "The true value of a diamond often lies in what the certificate comments reveal. A deep dive into interpreting GIA dossiers for conversion potential and investment positioning.",
    featured: true,
  },
  {
    id: 2,
    title: "IF to FL: The Hidden Opportunity in Diamond Grading",
    date: "February 28, 2026",
    category: "Investment",
    excerpt: "How precise evaluation and masterful regrinding can elevate an Internally Flawless stone to Flawless, unlocking significant premiums without changing carat weight.",
    featured: false,
  },
  {
    id: 3,
    title: "Lab-Grown vs Natural: An Investment Perspective",
    date: "January 12, 2026",
    category: "Market Insights",
    excerpt: "Navigating the diverging markets of lab-grown and natural diamonds. Where true long-term value resides for serious buyers and institutional portfolios.",
    featured: false,
  },
  {
    id: 4,
    title: "The Evolution of Diamond Sourcing",
    date: "December 05, 2025",
    category: "Innovation",
    excerpt: "From traditional craftsmanship to modern precision: how expertise and evaluation rigour are reshaping how premium stones are sourced and assessed globally.",
    featured: false,
  },
];

// ══════════════════════════════════════════════════════════════════════
// STEP DATA
// ══════════════════════════════════════════════════════════════════════

const STEPS = [
  {
    id: 1, label: "Rough Birth Registration", progress: 5,
    details: {
      title: "Rough Birth Registration",
      points: [
        "Each rough diamond parcel is assigned a unique identification code once taken under manufacturing floor.",
        "This code is recorded in the ERP system with the import document evidence.",
      ],
      subHeading: "Splitting & Barcoding",
      subPoints: ["Unique identification number is assigned to each stone and entered in the ERP to track the stone in each process."],
      tags: ["Kimberley Process Certification", "Invoice", "Barcode ID"],
    },
  },
  {
    id: 2, label: "Scanning & Planning", progress: 22,
    details: {
      title: "Scanning & Planning",
      points: ["Each stone is scanned in galaxy scanning machine.", "Scanned stone is planned on the 3D model with optimum value and entered in ERP."],
      subHeading: null, subPoints: [],
      tags: ["Carat", "Color", "Shape", "Clarity"],
    },
  },
  {
    id: 3, label: "Laser Cutting", progress: 43,
    details: {
      title: "Laser Cutting",
      points: ["The planned stone is then split as per the value and entered in ERP."],
      subHeading: "Data Uploaded to ERP", subPoints: [],
      tags: ["Carat", "Color", "Shape", "Clarity", "Cut"],
    },
  },
  {
    id: 4, label: "Plan Registration", progress: 64,
    details: {
      title: "Plan Registration",
      points: [
        "The split stones QC is done and the final registration of plan is done.",
        "The expected polished is registered against the unique code in ERP.",
      ],
      subHeading: "Data Uploaded to ERP", subPoints: [],
      tags: ["Carat", "Color", "Shape", "Clarity", "Cut"],
    },
  },
  {
    id: 5, label: "Shaping & Polishing", progress: 91,
    details: {
      title: "Shaping & Polishing",
      points: [
        "The shaping & polishing is done as per the plan registered.",
        "Pre & post shaping & planning details are entered in ERP.",
      ],
      subHeading: "Data Uploaded to ERP", subPoints: [],
      tags: ["Carat", "Color", "Shape", "Clarity", "Cut", "QC details"],
    },
  },
];

// ══════════════════════════════════════════════════════════════════════
// VIDEO PLAYER — accepts ref + onTimeUpdate for video-sync
// ══════════════════════════════════════════════════════════════════════

// CHANGE 1: Added interface with videoRef and onTimeUpdate props
interface DiamondVideoProps {
  height: number;
  videoRef: React.RefObject<HTMLVideoElement>;
  onTimeUpdate: (currentTime: number, duration: number) => void;
  videoSrc?: string;
}

// CHANGE 2: DiamondVideo now accepts and forwards videoRef + onTimeUpdate
function DiamondVideo({ height, videoRef, onTimeUpdate, videoSrc }: DiamondVideoProps) {
  return (
    <div
      style={{
        height: `${height}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Radial glow backdrop — same as original canvas wrapper */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(28,169,201,0.10) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <video
        ref={videoRef}
        src={videoSrc || "/diamond-journey.mp4"}
        autoPlay
        loop
        muted
        playsInline
        onTimeUpdate={(e) => {
          const vid = e.currentTarget;
          onTimeUpdate(vid.currentTime, vid.duration || 30);
        }}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          background: "transparent",
          position: "relative",
          zIndex: 1,
        }}
      />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// TRACEABILITY SECTION — fully responsive
// ══════════════════════════════════════════════════════════════════════

// CHANGE 3: Removed SLIDE_INTERVAL — video duration drives timing instead
const VIDEO_DURATION = 30;   // total video length in seconds
const STEP_COUNT = 5;        // number of steps
const STEP_DURATION = VIDEO_DURATION / STEP_COUNT; // 6s per step

function DiamondTraceability({ videoSrc }: { videoSrc?: string }) {
  const [activeStep, setActiveStep] = useState(0);
  // CHANGE 4: Replaced paused+progress+intervalRef+tickRef with video-driven state
  const [stepProgress, setStepProgress] = useState(0);   // 0–100 within current step (drives dot ring)
  const [videoProgress, setVideoProgress] = useState(0); // 0–100 across full video (drives progress bar)
  const videoRef = useRef<HTMLVideoElement>(null);

  const step = STEPS[activeStep];
  const width = useWindowWidth();

  // CHANGE 5: jumpTo now seeks the video instead of calling setInterval
  const jumpTo = (i: number) => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.currentTime = i * STEP_DURATION;
    // onTimeUpdate will fire immediately and update activeStep + progress
  };

  // CHANGE 6: handleTimeUpdate is the single source of truth — replaces advance() + both useEffects
  const handleTimeUpdate = (currentTime: number, duration: number) => {
    const dur = isFinite(duration) && duration > 0 ? duration : VIDEO_DURATION;
    const stepDur = dur / STEP_COUNT;
    const stepIdx = Math.min(Math.floor(currentTime / stepDur), STEP_COUNT - 1);
    const timeIntoStep = currentTime - stepIdx * stepDur;
    const pct = Math.min(100, (timeIntoStep / stepDur) * 100);

    setActiveStep(stepIdx);
    setStepProgress(pct);
    setVideoProgress(Math.min(100, (currentTime / dur) * 100));
  };

  const R = 14;
  const circ = 2 * Math.PI * R;
  // CHANGE 7: dash now uses stepProgress (was referencing undefined `progress`)
  const dash = (stepProgress / 100) * circ;

  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  const isDesktop = width >= 1024;

  const canvasHeight = isMobile ? 260 : isTablet ? 340 : 420;

  const DotNav = ({ mt = "28px" }: { mt?: string }) => (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginTop: mt }}>
      {STEPS.map((_, i) => {
        const isActive = i === activeStep;
        return (
          <button
            key={i}
            onClick={() => jumpTo(i)}
            aria-label={`Go to step ${i + 1}`}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {isActive ? (
              <svg width="20" height="20" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r={R} fill="none" stroke="rgba(2,39,74,0.12)" strokeWidth="2.5" />
                <circle
                  cx="16" cy="16" r={R} fill="none" stroke="#1CA9C9" strokeWidth="2.5"
                  strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
                  style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", transition: "stroke-dasharray 0.05s linear" }}
                />
                <circle cx="16" cy="16" r="4" fill="#1CA9C9" />
              </svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 10 10">
                <circle cx="5" cy="5" r="4" fill={i < activeStep ? "#1CA9C9" : "rgba(2,39,74,0.2)"} />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    // CHANGE 8: Removed onMouseEnter/Leave pause — video plays uninterrupted
    <section
      style={{ background: "#f2f5f8", padding: isMobile ? "52px 0 40px" : "80px 0" }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: isMobile ? "0 16px" : "0 24px" }}>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: isMobile ? "32px" : "52px" }}
        >
          <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.45em", color: "#1CA9C9", marginBottom: "12px", fontWeight: 500 }}>
            Diamond Journey
          </p>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: isMobile ? "1.75rem" : "clamp(2rem, 4vw, 3rem)", color: "#02274A", lineHeight: 1.2, margin: 0 }}>
            From Rough to<br />
            <span style={{ color: "rgba(2,39,74,0.25)" }}>Brilliant.</span>
          </h2>
          <span style={{ display: "block", width: "40px", height: "1px", background: "#1CA9C9", marginTop: "18px" }} />
        </motion.div>

        {/* ── MOBILE ── */}
        {isMobile && (
          <div>
            {/* Horizontal scrolling step pills */}
            <div style={{
              display: "flex",
              overflowX: "auto",
              gap: "8px",
              paddingBottom: "16px",
              scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch",
              msOverflowStyle: "none",
            }}>
              {STEPS.map((s, i) => {
                const isActive = i === activeStep;
                return (
                  <button
                    key={s.id}
                    onClick={() => jumpTo(i)}
                    style={{
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 14px",
                      background: isActive ? "#1CA9C9" : "white",
                      color: isActive ? "white" : "rgba(2,39,74,0.5)",
                      border: `1px solid ${isActive ? "#1CA9C9" : "rgba(2,39,74,0.12)"}`,
                      borderRadius: "20px",
                      fontSize: "11px",
                      fontWeight: isActive ? 600 : 400,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      fontFamily: "'Inter', sans-serif",
                      transition: "all 0.2s",
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none">
                      <polygon points="12,2 22,9 12,22 2,9" fill={isActive ? "white" : "#1CA9C9"} opacity="0.9" />
                    </svg>
                    {s.label}
                  </button>
                );
              })}
            </div>

            {/* Progress bar — mobile */}
            {/* CHANGE 9: Uses videoProgress instead of step.progress; plain div instead of motion.div */}
            <div style={{ marginBottom: "4px" }}>
              <div style={{ height: "3px", background: "rgba(2,39,74,0.08)", borderRadius: "2px", marginBottom: "6px" }}>
                <div
                  style={{ height: "100%", background: "#1CA9C9", borderRadius: "2px", width: `${videoProgress}%`, transition: "width 0.1s linear" }}
                />
              </div>
              <span style={{ fontSize: "11px", color: "rgba(2,39,74,0.4)", letterSpacing: "0.05em" }}>{Math.round(videoProgress)}% complete</span>
            </div>

            {/* Video */}
            {/* CHANGE 10: Passes videoRef + onTimeUpdate to DiamondVideo */}
            <div style={{ margin: "16px 0" }}>
              <DiamondVideo height={canvasHeight} videoRef={videoRef} onTimeUpdate={handleTimeUpdate} videoSrc={videoSrc} />
            </div>

            {/* Step details card — unchanged */}
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              style={{
                background: "white",
                padding: "20px 18px",
                boxShadow: "0 2px 20px rgba(2,39,74,0.07)",
                borderRadius: "2px",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "14px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "3px", flexShrink: 0 }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", border: "2px solid #1CA9C9", background: "white" }} />
                  <div style={{ width: "1px", height: "20px", background: "rgba(28,169,201,0.3)", margin: "4px 0" }} />
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", border: "2px solid rgba(28,169,201,0.4)", background: "white" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontFamily: "Georgia, serif", fontSize: "15px", color: "#02274A", margin: "0 0 10px", lineHeight: 1.3 }}>
                    {step.details.title}
                  </h3>
                  <ul style={{ margin: 0, padding: "0 0 0 16px" }}>
                    {step.details.points.map((pt, i) => (
                      <li key={i} style={{ fontSize: "12px", color: "rgba(2,39,74,0.6)", marginBottom: "6px", lineHeight: 1.5 }}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </div>
              {step.details.subHeading && (
                <p style={{ fontSize: "12px", fontWeight: 600, color: "#02274A", marginBottom: "8px", marginLeft: "22px" }}>
                  {step.details.subHeading}
                </p>
              )}
              {step.details.subPoints.map((sp, i) => (
                <p key={i} style={{ fontSize: "12px", color: "rgba(2,39,74,0.55)", marginLeft: "22px", lineHeight: 1.5 }}>{sp}</p>
              ))}
              <div style={{ marginTop: "16px", marginLeft: "22px" }}>
                <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.3em", color: "rgba(2,39,74,0.35)", marginBottom: "10px" }}>
                  Data Uploaded to ERP
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {step.details.tags.map((tag) => (
                    <span key={tag} style={{
                      fontSize: "10px", padding: "4px 10px",
                      border: "1px solid rgba(2,39,74,0.12)", color: "rgba(2,39,74,0.55)",
                      borderRadius: "2px", letterSpacing: "0.02em",
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>

            <DotNav mt="28px" />
          </div>
        )}

        {/* ── TABLET ── */}
        {isTablet && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "24px", alignItems: "start" }}>

              {/* Left: steps list */}
              <div style={{ background: "white", borderRadius: "2px", overflow: "hidden", boxShadow: "0 2px 16px rgba(2,39,74,0.06)" }}>
                {STEPS.map((s, i) => {
                  const isActive = i === activeStep;
                  const isPast = i < activeStep;
                  return (
                    <button
                      key={s.id}
                      onClick={() => jumpTo(i)}
                      style={{
                        display: "flex", alignItems: "center", gap: "10px", width: "100%",
                        padding: "14px 16px", background: isActive ? "white" : "transparent",
                        border: "none", borderLeft: isActive ? "3px solid #1CA9C9" : "3px solid transparent",
                        cursor: "pointer", textAlign: "left", transition: "all 0.2s",
                        borderBottom: "1px solid rgba(2,39,74,0.06)",
                      }}
                    >
                      <div style={{ width: "24px", height: "24px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: isActive ? 1 : isPast ? 0.7 : 0.3 }}>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                          <polygon points="12,2 22,9 12,22 2,9" fill={isActive ? "#1CA9C9" : "#02274A"} opacity={isActive ? 0.9 : 0.5} />
                        </svg>
                      </div>
                      <span style={{
                        fontSize: "11px", fontWeight: isActive ? 600 : 400,
                        color: isActive ? "#02274A" : isPast ? "#02274A" : "rgba(2,39,74,0.4)",
                        lineHeight: 1.3, fontFamily: "'Inter', sans-serif", letterSpacing: "0.01em",
                      }}>{s.label}</span>
                    </button>
                  );
                })}
                {/* CHANGE 11: Progress bar uses videoProgress, plain div */}
                <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(2,39,74,0.07)" }}>
                  <div style={{ height: "3px", background: "rgba(2,39,74,0.08)", borderRadius: "2px", marginBottom: "6px" }}>
                    <div
                      style={{ height: "100%", background: "#1CA9C9", borderRadius: "2px", width: `${videoProgress}%`, transition: "width 0.1s linear" }}
                    />
                  </div>
                  <span style={{ fontSize: "11px", color: "rgba(2,39,74,0.4)", letterSpacing: "0.05em" }}>{Math.round(videoProgress)}%</span>
                </div>
              </div>

              {/* Right: video — CHANGE 12: passes videoRef + onTimeUpdate */}
              <DiamondVideo height={canvasHeight} videoRef={videoRef} onTimeUpdate={handleTimeUpdate} videoSrc={videoSrc} />
            </div>

            {/* Details below the two-col row — unchanged */}
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              style={{
                background: "white", padding: "24px 22px",
                boxShadow: "0 2px 20px rgba(2,39,74,0.07)", borderRadius: "2px", marginTop: "24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "14px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "3px", flexShrink: 0 }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", border: "2px solid #1CA9C9", background: "white" }} />
                  <div style={{ width: "1px", height: "20px", background: "rgba(28,169,201,0.3)", margin: "4px 0" }} />
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", border: "2px solid rgba(28,169,201,0.4)", background: "white" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontFamily: "Georgia, serif", fontSize: "16px", color: "#02274A", margin: "0 0 10px", lineHeight: 1.3 }}>
                    {step.details.title}
                  </h3>
                  <ul style={{ margin: 0, padding: "0 0 0 16px" }}>
                    {step.details.points.map((pt, i) => (
                      <li key={i} style={{ fontSize: "12px", color: "rgba(2,39,74,0.6)", marginBottom: "6px", lineHeight: 1.5 }}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </div>
              {step.details.subHeading && (
                <p style={{ fontSize: "12px", fontWeight: 600, color: "#02274A", marginBottom: "8px", marginLeft: "22px" }}>
                  {step.details.subHeading}
                </p>
              )}
              {step.details.subPoints.map((sp, i) => (
                <p key={i} style={{ fontSize: "12px", color: "rgba(2,39,74,0.55)", marginLeft: "22px", lineHeight: 1.5 }}>{sp}</p>
              ))}
              <div style={{ marginTop: "20px", marginLeft: "22px" }}>
                <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.3em", color: "rgba(2,39,74,0.35)", marginBottom: "10px" }}>
                  Data Uploaded to ERP
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {step.details.tags.map((tag) => (
                    <span key={tag} style={{
                      fontSize: "10px", padding: "4px 10px",
                      border: "1px solid rgba(2,39,74,0.12)", color: "rgba(2,39,74,0.55)",
                      borderRadius: "2px", letterSpacing: "0.02em",
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>

            <DotNav mt="36px" />
          </div>
        )}

        {/* ── DESKTOP ── */}
        {isDesktop && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "220px 1fr 300px", gap: "32px", alignItems: "center" }}>

              {/* LEFT — Steps list */}
              <div style={{ background: "white", borderRadius: "2px", overflow: "hidden", boxShadow: "0 2px 16px rgba(2,39,74,0.06)" }}>
                {STEPS.map((s, i) => {
                  const isActive = i === activeStep;
                  const isPast = i < activeStep;
                  return (
                    <button
                      key={s.id}
                      onClick={() => jumpTo(i)}
                      style={{
                        display: "flex", alignItems: "center", gap: "12px", width: "100%",
                        padding: "16px 18px", background: isActive ? "white" : "transparent",
                        border: "none", borderLeft: isActive ? "3px solid #1CA9C9" : "3px solid transparent",
                        cursor: "pointer", textAlign: "left", transition: "all 0.2s",
                        borderBottom: "1px solid rgba(2,39,74,0.06)",
                      }}
                    >
                      <div style={{ width: "28px", height: "28px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: isActive ? 1 : isPast ? 0.7 : 0.3 }}>
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
                          <polygon points="12,2 22,9 12,22 2,9" fill={isActive ? "#1CA9C9" : "#02274A"} opacity={isActive ? 0.9 : 0.5} />
                        </svg>
                      </div>
                      <span style={{
                        fontSize: "12px", fontWeight: isActive ? 600 : 400,
                        color: isActive ? "#02274A" : isPast ? "#02274A" : "rgba(2,39,74,0.4)",
                        lineHeight: 1.3, fontFamily: "'Inter', sans-serif", letterSpacing: "0.01em",
                      }}>{s.label}</span>
                    </button>
                  );
                })}
                {/* CHANGE 13: Progress bar uses videoProgress, plain div */}
                <div style={{ padding: "14px 18px", borderTop: "1px solid rgba(2,39,74,0.07)" }}>
                  <div style={{ height: "3px", background: "rgba(2,39,74,0.08)", borderRadius: "2px", marginBottom: "8px" }}>
                    <div
                      style={{ height: "100%", background: "#1CA9C9", borderRadius: "2px", width: `${videoProgress}%`, transition: "width 0.1s linear" }}
                    />
                  </div>
                  <span style={{ fontSize: "11px", color: "rgba(2,39,74,0.4)", letterSpacing: "0.05em" }}>{Math.round(videoProgress)}%</span>
                </div>
              </div>

              {/* CENTER — Video — CHANGE 14: passes videoRef + onTimeUpdate */}
              <DiamondVideo height={canvasHeight} videoRef={videoRef} onTimeUpdate={handleTimeUpdate} videoSrc={videoSrc} />

              {/* RIGHT — Step details — unchanged */}
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{ background: "white", padding: "28px 24px", boxShadow: "0 2px 20px rgba(2,39,74,0.07)", borderRadius: "2px" }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "14px" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "3px" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", border: "2px solid #1CA9C9", background: "white" }} />
                    <div style={{ width: "1px", height: "24px", background: "rgba(28,169,201,0.3)", margin: "4px 0" }} />
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", border: "2px solid rgba(28,169,201,0.4)", background: "white" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: "Georgia, serif", fontSize: "16px", color: "#02274A", margin: "0 0 10px", lineHeight: 1.3 }}>
                      {step.details.title}
                    </h3>
                    <ul style={{ margin: 0, padding: "0 0 0 16px" }}>
                      {step.details.points.map((pt, i) => (
                        <li key={i} style={{ fontSize: "12px", color: "rgba(2,39,74,0.6)", marginBottom: "6px", lineHeight: 1.5 }}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                {step.details.subHeading && (
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "#02274A", marginBottom: "8px", marginLeft: "22px" }}>
                    {step.details.subHeading}
                  </p>
                )}
                {step.details.subPoints.map((sp, i) => (
                  <p key={i} style={{ fontSize: "12px", color: "rgba(2,39,74,0.55)", marginLeft: "22px", lineHeight: 1.5 }}>{sp}</p>
                ))}
                <div style={{ marginTop: "20px", marginLeft: "22px" }}>
                  <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.3em", color: "rgba(2,39,74,0.35)", marginBottom: "10px" }}>
                    Data Uploaded to ERP
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {step.details.tags.map((tag) => (
                      <span key={tag} style={{
                        fontSize: "10px", padding: "4px 10px",
                        border: "1px solid rgba(2,39,74,0.12)", color: "rgba(2,39,74,0.55)",
                        borderRadius: "2px", letterSpacing: "0.02em",
                      }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            <DotNav mt="40px" />
          </>
        )}

      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════
// JOURNAL PAGE
// ══════════════════════════════════════════════════════════════════════

export default function Journal() {
  const { data: sanityArticles } = useSanityQuery<SanityArticle[]>(["journal-articles"], JOURNAL_ARTICLES_QUERY);
  const { data: jp } = useSanityQuery<{ heroTagline?: string; heroHeading?: string; heroSubtext?: string; featureVideoUrl?: string }>(["journal-page"], JOURNAL_PAGE_QUERY);
  const jpc = isSanityConfigured ? jp : null;

  const articles = isSanityConfigured && sanityArticles && sanityArticles.length > 0
    ? sanityArticles.map((a, i) => ({
        id: i + 1, title: a.title, date: formatDate(a.publishedAt),
        category: a.category, excerpt: a.excerpt, featured: a.featured,
        slug: a.slug?.current, coverImageUrl: a.coverImageUrl,
      }))
    : ARTICLES;

  const linkFor = (a: { slug?: string; id: number }) => `/journal/${a.slug ?? a.id}`;

  const [featured, ...rest] = articles;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Hero ── */}
      <section className="pt-28 md:pt-40 pb-20 md:pb-28 px-8 md:px-14 lg:px-20" style={{ background: "#02274A" }}>
        <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 md:gap-20 items-end">
          <div className="space-y-5 md:space-y-6">
            <motion.p variants={up} className="text-[10px] uppercase tracking-[0.45em] font-medium" style={{ color: "#1CA9C9" }}>
              {jpc?.heroTagline || "Knowledge & Insight"}
            </motion.p>
            <motion.h1 variants={up} className="font-serif text-5xl md:text-6xl lg:text-7xl text-white leading-tight">
              {jpc?.heroHeading ? jpc.heroHeading : (<>Journal &amp;<br /><span style={{ color: "rgba(255,255,255,0.3)" }}>Insights.</span></>)}
            </motion.h1>
            <motion.span variants={up} className="block w-10 h-px" style={{ background: "#1CA9C9" }} />
          </div>
          <motion.p variants={up} className="text-white/40 text-sm md:text-base leading-relaxed md:pb-3">
            {jpc?.heroSubtext || "Perspectives on diamond grading, investment-grade stones, and the IF→FL conversion process, written for trade professionals who already understand the fundamentals."}
          </motion.p>
        </motion.div>
      </section>

      {/* ── Featured Article ── */}
      <section className="py-20 md:py-28 px-6" style={{ background: "#F4F8FC" }}>
        <div className="max-w-7xl mx-auto">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-[9px] uppercase tracking-[0.45em] mb-10 font-medium" style={{ color: "#1CA9C9" }}>
            Featured
          </motion.p>
          <motion.article
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, ease: EASE }}
            className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center p-8 md:p-14"
            style={{ background: "white", border: "1px solid rgba(2,39,74,0.08)" }}
          >
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <span className="text-[8px] uppercase tracking-[0.42em]" style={{ color: "#1CA9C9" }}>{featured.category}</span>
                <span className="w-6 h-px" style={{ background: "rgba(28,169,201,0.3)" }} />
                <span className="text-[8px] uppercase tracking-[0.3em]" style={{ color: "rgba(2,39,74,0.3)" }}>{featured.date}</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl leading-tight" style={{ color: "#02274A" }}>{featured.title}</h2>
              <span className="block w-8 h-px" style={{ background: "#1CA9C9" }} />
              <p className="text-sm leading-relaxed" style={{ color: "rgba(2,39,74,0.5)" }}>{featured.excerpt}</p>
              <Link href={linkFor(featured)} className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-medium transition-colors hover:gap-3" style={{ color: "#1CA9C9" }}>
                Read Article <ArrowRight size={11} />
              </Link>
            </div>
            <div className="aspect-[4/3] hidden lg:block" style={{ background: "linear-gradient(135deg, #02274A 0%, #04385E 100%)", position: "relative", overflow: "hidden" }}>
              {("coverImageUrl" in featured && (featured as { coverImageUrl?: string }).coverImageUrl) ? (
                <img src={(featured as { coverImageUrl?: string }).coverImageUrl} alt={featured.title} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
              <div className="absolute inset-0 flex items-center justify-center opacity-5">
                <span className="font-serif" style={{ fontSize: "14rem", color: "white", letterSpacing: "-0.04em", lineHeight: 1 }}>01</span>
              </div>
              )}
              <div className="absolute bottom-8 left-8">
                <p className="text-[9px] uppercase tracking-[0.4em] mb-1" style={{ color: "rgba(28,169,201,0.6)" }}>GIA Documentation</p>
                <p className="text-white/20 text-xs">Certificate interpretation for professionals</p>
              </div>
            </div>
          </motion.article>
        </div>
      </section>

      {/* ── Diamond Journey with Video ──
      <DiamondTraceability videoSrc={jpc?.featureVideoUrl} /> */}

      {/* ── Article List ── */}
      <section className="py-20 md:py-28 px-6" style={{ background: "white" }}>
        <div className="max-w-7xl mx-auto">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-[9px] uppercase tracking-[0.45em] mb-10 font-medium" style={{ color: "#1CA9C9" }}>
            All Articles
          </motion.p>
          <div className="divide-y" style={{ borderTop: "1px solid rgba(2,39,74,0.07)", borderColor: "rgba(2,39,74,0.07)" }}>
            {rest.map((article, i) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6, ease: EASE }}
                className="py-10 grid md:grid-cols-[180px_1fr_auto] gap-6 md:gap-12 items-start group"
              >
                <div className="space-y-1">
                  <p className="text-[8px] uppercase tracking-[0.42em] font-medium" style={{ color: "#1CA9C9" }}>{article.category}</p>
                  <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: "rgba(2,39,74,0.3)" }}>{article.date}</p>
                </div>
                <div className="space-y-3">
                  <h2 className="font-serif text-xl md:text-2xl leading-snug group-hover:text-[#1CA9C9] transition-colors" style={{ color: "#02274A" }}>
                    {article.title}
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(2,39,74,0.45)" }}>{article.excerpt}</p>
                </div>
                <div className="flex items-start pt-1">
                  <Link href={linkFor(article)} className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] shrink-0 group-hover:gap-3 transition-all" style={{ color: "rgba(2,39,74,0.3)" }}>
                    Read <ArrowRight size={10} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA strip ── */}
      <section className="py-16 px-6" style={{ background: "#02274A", borderTop: "1px solid rgba(28,169,201,0.1)" }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <p className="text-[9px] uppercase tracking-[0.45em] mb-2" style={{ color: "#1CA9C9" }}>Trade Enquiries</p>
            <p className="font-serif text-2xl text-white">Ready to discuss your stones?</p>
          </div>
          <Link href="/contact">
            <button className="text-[10px] uppercase tracking-[0.3em] text-white transition-all hover:opacity-80" style={{ background: "#1CA9C9", height: "50px", padding: "0 2.5rem", border: "none" }}>
              Begin the Conversation →
            </button>
          </Link>
        </div>
      </section>

    </div>
  );
}