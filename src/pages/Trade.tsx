import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { EASE } from "@/lib/motion";
import { useSanityQuery } from "@/lib/useSanityData";
import { isSanityConfigured } from "@/lib/sanity";
import { TRADE_PAGE_QUERY } from "@/lib/sanity-queries";
import SeoHead from "@/components/SeoHead";

/* ─── Animation variants ─────────────────────────────────────────── */
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.11 } } };
const up = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } };
const fade = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.9, ease: EASE } } };

/* ─── Floating label inputs ──────────────────────────────────────── */
function FloatInput({ label, type = "text", testId, value, onChange, required }: {
  label: string; type?: string; testId: string;
  value: string; onChange: (v: string) => void; required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;
  return (
    <div style={{ position: "relative", paddingTop: "18px" }}>
      <label style={{
        position: "absolute", left: 0,
        top: lifted ? "0px" : "30px",
        fontSize: lifted ? "8px" : "12px",
        letterSpacing: lifted ? "0.4em" : "0.03em",
        color: lifted && focused ? "#1CA9C9" : "rgba(255,255,255,0.35)",
        textTransform: "uppercase",
        transition: "all 0.22s cubic-bezier(0.22,1,0.36,1)",
        pointerEvents: "none",
        fontFamily: "'Inter', sans-serif", fontWeight: 500,
      }}>
        {label}{required && <span style={{ color: "#1CA9C9" }}> *</span>}
      </label>
      <input
        type={type} required={required} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        data-testid={testId}
        style={{
          width: "100%", height: "42px", background: "transparent",
          border: "none",
          borderBottom: `1px solid ${focused ? "#1CA9C9" : "rgba(255,255,255,0.15)"}`,
          outline: "none", color: "#fff", fontSize: "13px",
          fontFamily: "'Inter', sans-serif",
          transition: "border-color 0.2s ease", paddingBottom: "6px",
        }}
      />
    </div>
  );
}

function FloatSelect({ label, options, testId, value, onChange, required }: {
  label: string; options: { value: string; label: string }[];
  testId: string; value: string; onChange: (v: string) => void; required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;
  return (
    <div style={{ position: "relative", paddingTop: "18px" }}>
      <label style={{
        position: "absolute", left: 0,
        top: lifted ? "0px" : "30px",
        fontSize: lifted ? "8px" : "12px",
        letterSpacing: lifted ? "0.4em" : "0.03em",
        color: lifted && focused ? "#1CA9C9" : "rgba(255,255,255,0.35)",
        textTransform: "uppercase",
        transition: "all 0.22s cubic-bezier(0.22,1,0.36,1)",
        pointerEvents: "none",
        fontFamily: "'Inter', sans-serif", fontWeight: 500,
      }}>
        {label}{required && <span style={{ color: "#1CA9C9" }}> *</span>}
      </label>
      <select
        required={required} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        data-testid={testId}
        style={{
          width: "100%", height: "42px", background: "#02274A",
          border: "none",
          borderBottom: `1px solid ${focused ? "#1CA9C9" : "rgba(255,255,255,0.15)"}`,
          outline: "none", color: value ? "#fff" : "transparent",
          fontSize: "13px", fontFamily: "'Inter', sans-serif",
          transition: "border-color 0.2s ease", paddingBottom: "6px",
          appearance: "none", cursor: "pointer",
        }}
      >
        <option value="" disabled style={{ background: "#02274A" }} />
        {options.map(o => (
          <option key={o.value} value={o.value} style={{ background: "#02274A", color: "#fff" }}>
            {o.label}
          </option>
        ))}
      </select>
      <svg width="10" height="6" viewBox="0 0 10 6"
        style={{ position: "absolute", right: 4, bottom: 14, opacity: 0.3, pointerEvents: "none" }}>
        <path d="M1 1l4 4 4-4" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function FloatTextarea({ label, testId, value, onChange, required }: {
  label: string; testId: string; value: string; onChange: (v: string) => void; required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;
  return (
    <div style={{ position: "relative", paddingTop: "18px" }}>
      <label style={{
        position: "absolute", left: 0,
        top: lifted ? "0px" : "30px",
        fontSize: lifted ? "8px" : "12px",
        letterSpacing: lifted ? "0.4em" : "0.03em",
        color: lifted && focused ? "#1CA9C9" : "rgba(255,255,255,0.35)",
        textTransform: "uppercase",
        transition: "all 0.22s cubic-bezier(0.22,1,0.36,1)",
        pointerEvents: "none",
        fontFamily: "'Inter', sans-serif", fontWeight: 500,
      }}>
        {label}{required && <span style={{ color: "#1CA9C9" }}> *</span>}
      </label>
      <textarea
        required={required} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        data-testid={testId} rows={4}
        style={{
          width: "100%", background: "transparent", border: "none",
          borderBottom: `1px solid ${focused ? "#1CA9C9" : "rgba(255,255,255,0.15)"}`,
          outline: "none", color: "#fff", fontSize: "13px",
          fontFamily: "'Inter', sans-serif",
          transition: "border-color 0.2s ease", resize: "none",
          paddingTop: "8px", paddingBottom: "6px",
        }}
      />
    </div>
  );
}

/* ─── Data ───────────────────────────────────────────────────────── */
const WHO_QUALIFIES = [
  {
    icon: "◈",
    title: "Diamond Traders",
    body: "Established traders with verified industry credentials seeking reliable access to GIA-certified natural and lab-grown inventory.",
  },
  {
    icon: "◇",
    title: "Jewellery Manufacturers",
    body: "Manufacturers requiring precise, consistent parcels — specific shapes, colour-clarity brackets, and carat weights delivered on schedule.",
  },
  {
    icon: "◆",
    title: "High-End Retailers",
    body: "Retailers serving discerning clientele who need bespoke sourcing for client briefs, from single exceptional stones to ongoing standing orders.",
  },
  {
    icon: "◉",
    title: "Investment Buyers",
    body: "Portfolio buyers and family offices acquiring GIA-certified stones as a hard asset, with full provenance documentation and IF→FL conversion advisory.",
  },
];

const WHAT_WE_OFFER = [
  {
    number: "01",
    title: "Standing Supply Briefs",
    body: "Commit to a recurring specification — shape, carat, colour-clarity range — and we fulfil it consistently against agreed lead times. No spot-market volatility, no quality surprises.",
    detail: "Rounds, ovals, cushions and most standard shapes from 0.30ct upward. Natural and lab grown.",
  },
  {
    number: "02",
    title: "Bespoke Stone Sourcing",
    body: "Provide a brief and we locate it. Our network spans primary cutting facilities and established trading relationships built over 47 years. If the stone exists at grade, we find it.",
    detail: "Single stones to large parcels. Full GIA documentation provided on every stone.",
  },
  {
    number: "03",
    title: "IF → FL Conversion",
    body: "Our house speciality. We assess Internally Flawless stones for surface characteristics that hold them below FL grade. Where viable, a precision micro-regrind and GIA re-submission produces a certified Flawless diamond.",
    detail: "The FL premium over IF justifies conversion cost many times over at commercial scale.",
  },
  {
    number: "04",
    title: "Trade Advisory",
    body: "Market intelligence, grading verification, acquisition structuring — for buyers who need more than a transaction. We act as a long-term sourcing partner, not just a supplier.",
    detail: "Confidential. Relationship-based. Available to qualified trade accounts only.",
  },
];

const PROCESS_STEPS = [
  { step: "01", title: "Submit Application", body: "Complete the trade account form below with your business details and primary sourcing requirements." },
  { step: "02", title: "Qualification Review", body: "We review every application personally. Established trade credentials are verified before access is granted — typically within 2 business days." },
  { step: "03", title: "Account Activation", body: "Approved partners receive access to our full inventory, trade pricing, and a dedicated point of contact." },
  { step: "04", title: "Ongoing Partnership", body: "Standing briefs, priority allocation, and direct advisory access. The relationship is built for the long term." },
];

const BUSINESS_TYPES = [
  { value: "trader", label: "Diamond Trader" },
  { value: "manufacturer", label: "Jewellery Manufacturer" },
  { value: "retailer", label: "Retail Jeweller" },
  { value: "investment", label: "Investment / Portfolio Buyer" },
  { value: "other", label: "Other Trade" },
];

const VOLUME_OPTIONS = [
  { value: "under-50k", label: "Under AUD $50,000 p.a." },
  { value: "50k-250k",  label: "AUD $50,000 – $250,000 p.a." },
  { value: "250k-1m",   label: "AUD $250,000 – $1,000,000 p.a." },
  { value: "over-1m",   label: "Over AUD $1,000,000 p.a." },
];

/* ─── Page ───────────────────────────────────────────────────────── */
interface SanityTradePage {
  seo?: {
    metaTitle?: string; metaDescription?: string; metaKeywords?: string;
    ogTitle?: string; ogDescription?: string; ogImageUrl?: string;
    twitterCard?: string; noIndex?: boolean;
    structuredDataType?: string; additionalJsonLd?: string;
  };
  heroTagline?: string; heroHeading?: string; heroSubtext?: string;
  heroCta?: string; heroSecondaryCta?: string;
  heroVideoUrl?: string; heroImageUrl?: string;
  partnerTypesTagline?: string; partnerTypesHeading?: string;
  partnerTypes?: { title: string; body: string; tags: string[] }[];
  accessTagline?: string; accessHeading?: string;
  accessFeatures?: { title: string; body: string }[];
  jewellersHeading?: string; jewellersBody?: string;
  ctaHeading?: string; ctaBody?: string;
}

export default function Trade() {
  const { data: sanityTrade } = useSanityQuery<SanityTradePage>(["trade-page"], TRADE_PAGE_QUERY);
  const seo = sanityTrade?.seo;
  const trd = isSanityConfigured ? sanityTrade : null;

  const formRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", company: "",
    role: "", businessType: "", annualVolume: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 900);
  };

  return (
    <>
      <SeoHead
        metaTitle={seo?.metaTitle || "Trade Portal | FLX Diamonds — B2B Diamond Sourcing for Jewellers & Retailers"}
        metaDescription={seo?.metaDescription || "Trade-only access to GIA-certified natural and lab-grown diamonds. Standing supply briefs, bespoke sourcing, and IF→FL conversion. ABN verification required."}
        metaKeywords={seo?.metaKeywords || "diamond trade portal, B2B diamond supply, jeweller diamond source, IF FL trade, GIA diamonds Australia trade"}
        ogTitle={seo?.ogTitle}
        ogDescription={seo?.ogDescription}
        ogImageUrl={seo?.ogImageUrl}
        twitterCard={seo?.twitterCard}
        noIndex={seo?.noIndex}
        structuredDataType={seo?.structuredDataType || "WebPage"}
        additionalJsonLd={seo?.additionalJsonLd}
        siteName="FLX Diamonds"
      />
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ══════════════════════════════════════════
          1. HERO — full-bleed navy
      ══════════════════════════════════════════ */}
      <section style={{ background: "#02274A", position: "relative", overflow: "hidden" }}>

        {/* Sanity CMS background media */}
        {sanityTrade?.heroVideoUrl ? (
          <>
            <video
              autoPlay muted loop playsInline
              aria-hidden="true"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
            >
              <source src={sanityTrade.heroVideoUrl} type="video/mp4" />
            </video>
            <div style={{ position: "absolute", inset: 0, background: "rgba(2,39,74,0.72)", zIndex: 1 }} />
          </>
        ) : sanityTrade?.heroImageUrl ? (
          <>
            <img
              src={sanityTrade.heroImageUrl}
              alt=""
              aria-hidden="true"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
            />
            <div style={{ position: "absolute", inset: 0, background: "rgba(2,39,74,0.72)", zIndex: 1 }} />
          </>
        ) : (
          <>
            {/* Decorative teal glow (fallback when no media) */}
            <div style={{
              position: "absolute", top: "50%", right: "-8%",
              width: "55vw", height: "55vw", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(28,169,201,0.10) 0%, transparent 65%)",
              transform: "translateY(-50%)", pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute", bottom: 0, left: "-5%",
              width: "35vw", height: "35vw", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(28,169,201,0.05) 0%, transparent 65%)",
              pointerEvents: "none",
            }} />
          </>
        )}

        <div style={{
          position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto",
          padding: "clamp(120px,16vw,180px) clamp(24px,6vw,80px) clamp(80px,10vw,120px)",
        }}>
          <motion.div initial="hidden" animate="visible" variants={stagger}>

            <motion.p variants={up} style={{
              fontSize: "9px", letterSpacing: "0.55em", textTransform: "uppercase",
              color: "#1CA9C9", marginBottom: "28px", fontWeight: 500,
            }}>
              {sanityTrade?.heroTagline || "Trade Partnership — B2B Only"}
            </motion.p>

            <motion.h1 variants={up} style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(42px, 6vw, 84px)",
              fontWeight: 400, color: "#fff", lineHeight: 1.05,
              marginBottom: "32px", maxWidth: "780px",
            }}>
              {sanityTrade?.heroHeading || "Where the Diamond Trade Comes to Source."}
            </motion.h1>

            <motion.p variants={up} style={{
              fontSize: "clamp(14px, 1.5vw, 17px)", color: "rgba(255,255,255,0.62)",
              maxWidth: "560px", lineHeight: 1.8, marginBottom: "52px",
            }}>
              {sanityTrade?.heroSubtext || "FLX Diamonds operates exclusively with established trade partners — jewellers, manufacturers, traders, and portfolio buyers who require precision sourcing, consistent supply, and a 47-year network they can rely on."}
            </motion.p>

            <motion.div variants={up} style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <button
                data-testid="btn-apply-hero"
                onClick={scrollToForm}
                style={{
                  height: "52px", padding: "0 36px",
                  background: "#1CA9C9", color: "#fff", border: "none",
                  fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase",
                  fontFamily: "'Inter', sans-serif", fontWeight: 600, cursor: "pointer",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#1594b0")}
                onMouseLeave={e => (e.currentTarget.style.background = "#1CA9C9")}
              >
                Apply for Trade Account
              </button>
              <Link href="/diamonds">
                <button
                  data-testid="btn-browse-hero"
                  style={{
                    height: "52px", padding: "0 36px",
                    background: "transparent", color: "#fff",
                    border: "1px solid rgba(255,255,255,0.25)",
                    fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase",
                    fontFamily: "'Inter', sans-serif", fontWeight: 500, cursor: "pointer",
                    transition: "border-color 0.2s ease, color 0.2s ease",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "#1CA9C9";
                    e.currentTarget.style.color = "#1CA9C9";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
                    e.currentTarget.style.color = "#fff";
                  }}
                >
                  Browse Inventory
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          2. STATS BAR
      ══════════════════════════════════════════ */}
      <section style={{ background: "#1CA9C9" }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto",
          padding: "0 clamp(24px,6vw,80px)",
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        }}>
          {[
            { val: "47",   label: "Years in Trade" },
            { val: "FL",   label: "Highest Grade Certified" },
            { val: "GIA",  label: "Certified On Every Stone" },
            { val: "B2B",  label: "Trade Partners Only" },
          ].map((s, i) => (
            <div key={i} style={{
              padding: "28px 16px",
              borderRight: i < 3 ? "1px solid rgba(255,255,255,0.20)" : "none",
              textAlign: "center",
            }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px,3vw,34px)", color: "#fff", fontWeight: 400 }}>{s.val}</div>
              <div style={{ fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)", marginTop: "6px", fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3. WHO QUALIFIES — white
      ══════════════════════════════════════════ */}
      <section style={{ background: "#fff" }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto",
          padding: "clamp(72px,10vw,120px) clamp(24px,6vw,80px)",
        }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>

            <motion.p variants={up} style={{
              fontSize: "9px", letterSpacing: "0.55em", textTransform: "uppercase",
              color: "#1CA9C9", marginBottom: "20px", fontWeight: 500,
            }}>
              Qualification
            </motion.p>
            <motion.h2 variants={up} style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(30px,4vw,52px)", fontWeight: 400,
              color: "#02274A", marginBottom: "60px", lineHeight: 1.1,
            }}>
              {trd?.partnerTypesHeading || "Who We Work With"}
            </motion.h2>

            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "2px", background: "rgba(2,39,74,0.06)",
            }}>
              {WHO_QUALIFIES.map((q, i) => (
                <motion.div key={i} variants={up} style={{
                  background: "#fff", padding: "44px 36px",
                  borderTop: "3px solid transparent",
                  transition: "border-color 0.2s ease",
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderTopColor = "#1CA9C9")}
                  onMouseLeave={e => (e.currentTarget.style.borderTopColor = "transparent")}
                >
                  <div style={{ fontSize: "22px", color: "#1CA9C9", marginBottom: "20px" }}>{q.icon}</div>
                  <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "20px", color: "#02274A", marginBottom: "14px", fontWeight: 400,
                  }}>{q.title}</div>
                  <p style={{ fontSize: "13px", color: "rgba(2,39,74,0.6)", lineHeight: 1.75 }}>{q.body}</p>
                </motion.div>
              ))}
            </div>

          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          4. WHAT WE OFFER — navy
      ══════════════════════════════════════════ */}
      <section style={{ background: "#02274A", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: "30%", right: "-10%",
          width: "50vw", height: "50vw", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(28,169,201,0.07) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />
        <div style={{
          maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1,
          padding: "clamp(72px,10vw,120px) clamp(24px,6vw,80px)",
        }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>

            <motion.p variants={up} style={{
              fontSize: "9px", letterSpacing: "0.55em", textTransform: "uppercase",
              color: "#1CA9C9", marginBottom: "20px", fontWeight: 500,
            }}>
              Services
            </motion.p>
            <motion.h2 variants={up} style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(30px,4vw,52px)", fontWeight: 400,
              color: "#fff", marginBottom: "64px", lineHeight: 1.1,
            }}>
              {trd?.accessHeading || "What Trade Partners Access"}
            </motion.h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1px", background: "rgba(255,255,255,0.06)" }}>
              {WHAT_WE_OFFER.map((s, i) => (
                <motion.div key={i} variants={up} style={{
                  background: "#02274A", padding: "44px 36px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}>
                  <div style={{ fontSize: "10px", letterSpacing: "0.4em", color: "#1CA9C9", marginBottom: "20px", fontWeight: 500 }}>
                    {s.number}
                  </div>
                  <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "21px", color: "#fff", marginBottom: "16px", fontWeight: 400, lineHeight: 1.2,
                  }}>{s.title}</div>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.58)", lineHeight: 1.78, marginBottom: "20px" }}>{s.body}</p>
                  <p style={{
                    fontSize: "11px", color: "#1CA9C9", lineHeight: 1.6,
                    borderLeft: "2px solid rgba(28,169,201,0.3)", paddingLeft: "12px",
                  }}>{s.detail}</p>
                </motion.div>
              ))}
            </div>

            <motion.div variants={up} style={{ marginTop: "52px", textAlign: "center" }}>
              <Link href="/services">
                <button
                  data-testid="btn-services-detail"
                  style={{
                    height: "48px", padding: "0 32px",
                    background: "transparent", color: "rgba(255,255,255,0.7)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase",
                    fontFamily: "'Inter', sans-serif", fontWeight: 500, cursor: "pointer",
                    transition: "border-color 0.2s, color 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#1CA9C9"; e.currentTarget.style.color = "#1CA9C9"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                >
                  View All Services
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          5. PROCESS — white
      ══════════════════════════════════════════ */}
      <section style={{ background: "#F4F8FC" }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto",
          padding: "clamp(72px,10vw,120px) clamp(24px,6vw,80px)",
        }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>

            <motion.p variants={up} style={{
              fontSize: "9px", letterSpacing: "0.55em", textTransform: "uppercase",
              color: "#1CA9C9", marginBottom: "20px", fontWeight: 500,
            }}>
              How It Works
            </motion.p>
            <motion.h2 variants={up} style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(30px,4vw,52px)", fontWeight: 400,
              color: "#02274A", marginBottom: "64px", lineHeight: 1.1,
            }}>
              The Path to Trade Access
            </motion.h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "32px" }}>
              {PROCESS_STEPS.map((p, i) => (
                <motion.div key={i} variants={up} style={{ position: "relative" }}>
                  {/* Connector line */}
                  {i < PROCESS_STEPS.length - 1 && (
                    <div style={{
                      position: "absolute", top: "22px", left: "calc(100% + 8px)",
                      width: "calc(100% - 16px)", height: "1px",
                      background: "rgba(28,169,201,0.2)",
                      display: "none",
                    }} />
                  )}
                  <div style={{
                    width: "44px", height: "44px", border: "1px solid #1CA9C9",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "24px",
                  }}>
                    <span style={{ fontSize: "11px", letterSpacing: "0.2em", color: "#1CA9C9", fontWeight: 600 }}>{p.step}</span>
                  </div>
                  <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "19px", color: "#02274A", marginBottom: "12px", fontWeight: 400,
                  }}>{p.title}</div>
                  <p style={{ fontSize: "13px", color: "rgba(2,39,74,0.58)", lineHeight: 1.75 }}>{p.body}</p>
                </motion.div>
              ))}
            </div>

            <motion.div variants={up} style={{ marginTop: "56px", textAlign: "center" }}>
              <button
                data-testid="btn-apply-process"
                onClick={scrollToForm}
                style={{
                  height: "52px", padding: "0 40px",
                  background: "#02274A", color: "#fff", border: "none",
                  fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase",
                  fontFamily: "'Inter', sans-serif", fontWeight: 600, cursor: "pointer",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#1CA9C9")}
                onMouseLeave={e => (e.currentTarget.style.background = "#02274A")}
              >
                Begin Application
              </button>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          6. IF→FL CALLOUT — teal band
      ══════════════════════════════════════════ */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
        variants={fade}
        style={{ background: "#1CA9C9" }}
      >
        <div style={{
          maxWidth: "1200px", margin: "0 auto",
          padding: "clamp(52px,7vw,80px) clamp(24px,6vw,80px)",
          display: "flex", flexWrap: "wrap",
          alignItems: "center", justifyContent: "space-between", gap: "32px",
        }}>
          <div>
            <p style={{
              fontSize: "9px", letterSpacing: "0.55em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.7)", marginBottom: "12px", fontWeight: 500,
            }}>
              House Speciality
            </p>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(24px,3.5vw,42px)", color: "#fff",
              fontWeight: 400, lineHeight: 1.15, margin: 0,
            }}>
              {trd?.jewellersHeading ? trd.jewellersHeading : (<>IF → FL Conversion<br />for Trade Partners</>)}
            </h3>
          </div>
          <div style={{ maxWidth: "440px" }}>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.82)", lineHeight: 1.78, marginBottom: "28px" }}>
              {trd?.jewellersBody || "The FL grade carries a material premium over IF that justifies conversion cost many times over at commercial scale. We assess stones, execute precision micro-regrind, and manage the GIA re-submission — delivering a certified Flawless diamond."}
            </p>
            <Link href="/services#conversion">
              <button
                data-testid="btn-conversion-learn"
                style={{
                  height: "46px", padding: "0 28px",
                  background: "#fff", color: "#02274A", border: "none",
                  fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase",
                  fontFamily: "'Inter', sans-serif", fontWeight: 600, cursor: "pointer",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                Learn About Conversion
              </button>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════
          7. TRADE ACCOUNT APPLICATION FORM — navy
      ══════════════════════════════════════════ */}
      <section ref={formRef} style={{ background: "#02274A", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", bottom: "-10%", left: "-8%",
          width: "45vw", height: "45vw", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(28,169,201,0.08) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />

        <div style={{
          maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1,
          padding: "clamp(72px,10vw,120px) clamp(24px,6vw,80px)",
        }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>

            <motion.p variants={up} style={{
              fontSize: "9px", letterSpacing: "0.55em", textTransform: "uppercase",
              color: "#1CA9C9", marginBottom: "20px", fontWeight: 500,
            }}>
              Trade Account Application
            </motion.p>
            <motion.h2 variants={up} style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(28px,4vw,50px)", fontWeight: 400,
              color: "#fff", marginBottom: "12px", lineHeight: 1.1,
            }}>
              Apply for Access
            </motion.h2>
            <motion.p variants={up} style={{
              fontSize: "14px", color: "rgba(255,255,255,0.5)", marginBottom: "56px", lineHeight: 1.7,
            }}>
              All applications are reviewed personally. Qualified trade partners are contacted
              within 2 business days.
            </motion.p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
                style={{
                  padding: "60px 48px", border: "1px solid rgba(28,169,201,0.3)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "28px", marginBottom: "20px" }}>◈</div>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif", fontSize: "28px",
                  color: "#fff", fontWeight: 400, marginBottom: "16px",
                }}>
                  Application Received
                </h3>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, maxWidth: "440px", margin: "0 auto 36px" }}>
                  Thank you for your interest in an FLX Diamonds trade account.
                  We will review your application and be in contact within 2 business days.
                </p>
                <Link href="/diamonds">
                  <button
                    data-testid="btn-browse-after-submit"
                    style={{
                      height: "46px", padding: "0 32px",
                      background: "#1CA9C9", color: "#fff", border: "none",
                      fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase",
                      fontFamily: "'Inter', sans-serif", fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    Browse Our Inventory
                  </button>
                </Link>
              </motion.div>
            ) : (
              <motion.form variants={up} onSubmit={handleSubmit} noValidate>
                {/* Name row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: "8px" }}>
                  <FloatInput label="First Name" testId="input-first-name" value={form.firstName} onChange={v => set("firstName", v)} required />
                  <FloatInput label="Last Name" testId="input-last-name" value={form.lastName} onChange={v => set("lastName", v)} required />
                </div>
                {/* Contact row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: "8px", marginTop: "24px" }}>
                  <FloatInput label="Business Email" type="email" testId="input-email" value={form.email} onChange={v => set("email", v)} required />
                  <FloatInput label="Company / Trading Name" testId="input-company" value={form.company} onChange={v => set("company", v)} required />
                </div>
                {/* Role + type row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: "8px", marginTop: "24px" }}>
                  <FloatInput label="Your Role / Title" testId="input-role" value={form.role} onChange={v => set("role", v)} required />
                  <FloatSelect
                    label="Business Type" testId="select-business-type"
                    options={BUSINESS_TYPES} value={form.businessType}
                    onChange={v => set("businessType", v)} required
                  />
                </div>
                {/* Volume */}
                <div style={{ marginTop: "24px", marginBottom: "8px" }}>
                  <FloatSelect
                    label="Estimated Annual Diamond Purchasing Volume" testId="select-volume"
                    options={VOLUME_OPTIONS} value={form.annualVolume}
                    onChange={v => set("annualVolume", v)}
                  />
                </div>
                {/* Message */}
                <div style={{ marginTop: "24px", marginBottom: "48px" }}>
                  <FloatTextarea
                    label="Tell us about your sourcing requirements" testId="textarea-message"
                    value={form.message} onChange={v => set("message", v)}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
                  <button
                    type="submit"
                    data-testid="btn-submit-application"
                    disabled={submitting}
                    style={{
                      height: "52px", padding: "0 40px",
                      background: submitting ? "rgba(28,169,201,0.6)" : "#1CA9C9",
                      color: "#fff", border: "none",
                      fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase",
                      fontFamily: "'Inter', sans-serif", fontWeight: 600,
                      cursor: submitting ? "not-allowed" : "pointer",
                      transition: "background 0.2s ease",
                    }}
                    onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = "#1594b0"; }}
                    onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = "#1CA9C9"; }}
                  >
                    {submitting ? "Submitting…" : "Submit Application"}
                  </button>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", lineHeight: 1.6, maxWidth: "320px" }}>
                    Applications are reviewed personally. We do not share your details with third parties.
                  </p>
                </div>
              </motion.form>
            )}

          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          8. BOTTOM CTA — light
      ══════════════════════════════════════════ */}
      <section style={{ background: "#fff", borderTop: "1px solid rgba(2,39,74,0.07)" }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto",
          padding: "clamp(52px,7vw,80px) clamp(24px,6vw,80px)",
          display: "flex", flexWrap: "wrap",
          alignItems: "center", justifyContent: "space-between", gap: "32px",
        }}>
          <div>
            <p style={{ fontSize: "9px", letterSpacing: "0.45em", textTransform: "uppercase", color: "#1CA9C9", marginBottom: "10px", fontWeight: 500 }}>
              Questions First?
            </p>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px,3vw,36px)", color: "#02274A", fontWeight: 400, margin: 0 }}>
              {trd?.ctaHeading || "Speak with the team directly."}
            </h3>
          </div>
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <Link href="/contact">
              <button
                data-testid="btn-contact-bottom"
                style={{
                  height: "48px", padding: "0 32px",
                  background: "#02274A", color: "#fff", border: "none",
                  fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase",
                  fontFamily: "'Inter', sans-serif", fontWeight: 600, cursor: "pointer",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#1CA9C9")}
                onMouseLeave={e => (e.currentTarget.style.background = "#02274A")}
              >
                Contact Us
              </button>
            </Link>
            <Link href="/faq">
              <button
                data-testid="btn-faq-bottom"
                style={{
                  height: "48px", padding: "0 32px",
                  background: "transparent", color: "#02274A",
                  border: "1px solid rgba(2,39,74,0.2)",
                  fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase",
                  fontFamily: "'Inter', sans-serif", fontWeight: 500, cursor: "pointer",
                  transition: "border-color 0.2s, color 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#1CA9C9"; e.currentTarget.style.color = "#1CA9C9"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(2,39,74,0.2)"; e.currentTarget.style.color = "#02274A"; }}
              >
                Read FAQ
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
    </>
  );
}
