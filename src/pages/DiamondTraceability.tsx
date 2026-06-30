// DiamondTraceability.tsx
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

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

interface DiamondVideoProps {
  height: number;
  videoRef: React.RefObject<HTMLVideoElement>;
  onTimeUpdate: (currentTime: number, duration: number) => void;
  videoSrc?: string;
}

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

const VIDEO_DURATION = 30;   // total video length in seconds
const STEP_COUNT = 5;        // number of steps
const STEP_DURATION = VIDEO_DURATION / STEP_COUNT; // 6s per step

export function DiamondTraceability({ videoSrc }: { videoSrc?: string }) {
  const [activeStep, setActiveStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);   // 0–100 within current step (drives dot ring)
  const [videoProgress, setVideoProgress] = useState(0); // 0–100 across full video (drives progress bar)
  const videoRef = useRef<HTMLVideoElement>(null);

  const step = STEPS[activeStep];
  const width = useWindowWidth();

  const jumpTo = (i: number) => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.currentTime = i * STEP_DURATION;
    // onTimeUpdate will fire immediately and update activeStep + progress
  };

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
            <div style={{ marginBottom: "4px" }}>
              <div style={{ height: "3px", background: "rgba(2,39,74,0.08)", borderRadius: "2px", marginBottom: "6px" }}>
                <div
                  style={{ height: "100%", background: "#1CA9C9", borderRadius: "2px", width: `${videoProgress}%`, transition: "width 0.1s linear" }}
                />
              </div>
              <span style={{ fontSize: "11px", color: "rgba(2,39,74,0.4)", letterSpacing: "0.05em" }}>{Math.round(videoProgress)}% complete</span>
            </div>

            {/* Video */}
            <div style={{ margin: "16px 0" }}>
              <DiamondVideo height={canvasHeight} videoRef={videoRef} onTimeUpdate={handleTimeUpdate} videoSrc={videoSrc} />
            </div>

            {/* Step details card */}
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
                <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(2,39,74,0.07)" }}>
                  <div style={{ height: "3px", background: "rgba(2,39,74,0.08)", borderRadius: "2px", marginBottom: "6px" }}>
                    <div
                      style={{ height: "100%", background: "#1CA9C9", borderRadius: "2px", width: `${videoProgress}%`, transition: "width 0.1s linear" }}
                    />
                  </div>
                  <span style={{ fontSize: "11px", color: "rgba(2,39,74,0.4)", letterSpacing: "0.05em" }}>{Math.round(videoProgress)}%</span>
                </div>
              </div>

              {/* Right: video */}
              <DiamondVideo height={canvasHeight} videoRef={videoRef} onTimeUpdate={handleTimeUpdate} videoSrc={videoSrc} />
            </div>

            {/* Details below the two-col row */}
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
                <div style={{ padding: "14px 18px", borderTop: "1px solid rgba(2,39,74,0.07)" }}>
                  <div style={{ height: "3px", background: "rgba(2,39,74,0.08)", borderRadius: "2px", marginBottom: "8px" }}>
                    <div
                      style={{ height: "100%", background: "#1CA9C9", borderRadius: "2px", width: `${videoProgress}%`, transition: "width 0.1s linear" }}
                    />
                  </div>
                  <span style={{ fontSize: "11px", color: "rgba(2,39,74,0.4)", letterSpacing: "0.05em" }}>{Math.round(videoProgress)}%</span>
                </div>
              </div>

              {/* CENTER — Video */}
              <DiamondVideo height={canvasHeight} videoRef={videoRef} onTimeUpdate={handleTimeUpdate} videoSrc={videoSrc} />

              {/* RIGHT — Step details */}
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

export default DiamondTraceability;