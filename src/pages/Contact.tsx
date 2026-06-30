import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASE } from "@/lib/motion";
import { Link } from "wouter";
import { useSanityQuery } from "@/lib/useSanityData";
import { isSanityConfigured } from "@/lib/sanity";
import { CONTACT_PAGE_QUERY } from "@/lib/sanity-queries";
import SeoHead from "@/components/SeoHead";

/* ─── Floating label input ──────────────────────────────────── */
function FloatInput({ label, type = "text", testId, value, onChange, required }: {
  label: string; type?: string; testId: string;
  value: string; onChange: (v: string) => void; required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;
  return (
    <div className="relative" style={{ paddingTop: "18px" }}>
      <label style={{
        position: "absolute", left: 0,
        top: lifted ? "0px" : "30px",
        fontSize: lifted ? "8px" : "12px",
        letterSpacing: lifted ? "0.4em" : "0.03em",
        color: lifted && focused ? "#1CA9C9" : "rgba(2,39,74,0.38)",
        textTransform: "uppercase",
        transition: "all 0.22s cubic-bezier(0.22,1,0.36,1)",
        pointerEvents: "none",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 500,
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
          borderBottom: `1px solid ${focused ? "#1CA9C9" : "rgba(2,39,74,0.15)"}`,
          outline: "none", color: "#02274A", fontSize: "13px",
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
    <div className="relative" style={{ paddingTop: "18px" }}>
      <label style={{
        position: "absolute", left: 0,
        top: lifted ? "0px" : "30px",
        fontSize: lifted ? "8px" : "12px",
        letterSpacing: lifted ? "0.4em" : "0.03em",
        color: lifted && focused ? "#1CA9C9" : "rgba(2,39,74,0.38)",
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
          width: "100%", height: "42px", background: "transparent",
          border: "none",
          borderBottom: `1px solid ${focused ? "#1CA9C9" : "rgba(2,39,74,0.15)"}`,
          outline: "none", color: value ? "#02274A" : "transparent",
          fontSize: "13px", fontFamily: "'Inter', sans-serif",
          transition: "border-color 0.2s ease", paddingBottom: "6px",
          appearance: "none", cursor: "pointer",
        }}
      >
        <option value="" disabled style={{ background: "#fff" }} />
        {options.map(o => (
          <option key={o.value} value={o.value} style={{ background: "#fff", color: "#02274A" }}>
            {o.label}
          </option>
        ))}
      </select>
      <svg width="10" height="6" viewBox="0 0 10 6"
        style={{ position: "absolute", right: 4, bottom: 14, opacity: 0.3, pointerEvents: "none" }}>
        <path d="M1 1l4 4 4-4" stroke="#02274A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
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
    <div className="relative" style={{ paddingTop: "18px" }}>
      <label style={{
        position: "absolute", left: 0,
        top: lifted ? "0px" : "30px",
        fontSize: lifted ? "8px" : "12px",
        letterSpacing: lifted ? "0.4em" : "0.03em",
        color: lifted && focused ? "#1CA9C9" : "rgba(2,39,74,0.38)",
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
        data-testid={testId} rows={3}
        style={{
          width: "100%", background: "transparent", border: "none",
          borderBottom: `1px solid ${focused ? "#1CA9C9" : "rgba(2,39,74,0.15)"}`,
          outline: "none", color: "#02274A", fontSize: "13px",
          fontFamily: "'Inter', sans-serif",
          transition: "border-color 0.2s ease", resize: "none",
          paddingTop: "8px", paddingBottom: "6px",
        }}
      />
    </div>
  );
}

const ENQUIRY_TYPES = [
  { value: "conversion",  label: "IF→FL Conversion" },
  { value: "supply",      label: "Diamond Supply" },
  { value: "investment",  label: "Investment Advisory" },
  { value: "partnership", label: "Trade Partnership" },
  { value: "other",       label: "Other" },
];

const STATS = [
  { value: "47",  label: "Years of Mastery" },
  { value: "FL",  label: "Grade Certified" },
  { value: "GIA", label: "Certified Stones" },
  { value: "B2B", label: "Trade Enquiries Only" },
];

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const up = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

interface SanityContactPage {
  seo?: {
    metaTitle?: string; metaDescription?: string; metaKeywords?: string;
    ogTitle?: string; ogDescription?: string; ogImageUrl?: string;
    twitterCard?: string; noIndex?: boolean;
    structuredDataType?: string; additionalJsonLd?: string;
  };
  heroTagline?: string; heroHeading?: string; heroSubtext?: string;
  formTagline?: string; formHeading?: string; responsePromise?: string;
  directContactTagline?: string; directContactHeading?: string;
  email?: string;
  phones?: { label: string; value: string; subtext?: string }[];
  address?: string; abn?: string; privacyNote?: string;
}

export default function Contact() {
  const { data: sanityContact } = useSanityQuery<SanityContactPage>(["contact-page"], CONTACT_PAGE_QUERY);
  const seo = sanityContact?.seo;

  const email = (isSanityConfigured && sanityContact?.email) || "help@flxdiamond.com";
  const phones = (isSanityConfigured && sanityContact?.phones?.length)
    ? sanityContact.phones
    : [{ label: "Australia", value: "0474 817 548" }, { label: "India", value: "+91 99982 17496" }];
  const address = (isSanityConfigured && sanityContact?.address) || "Geelong, Victoria, Australia";

  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", company: "", type: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };

  return (
    <>
      <SeoHead
        metaTitle={seo?.metaTitle || "Contact | FLX Diamonds — Begin the Conversation"}
        metaDescription={seo?.metaDescription || "Get in touch with FLX Diamonds. Trade enquiries, diamond sourcing briefs, and IF→FL conversion assessments. Based in Geelong, Australia. Respond within 24 hours."}
        metaKeywords={seo?.metaKeywords || "contact FLX Diamonds, diamond trade enquiry, IF FL conversion contact, Geelong diamond"}
        ogTitle={seo?.ogTitle}
        ogDescription={seo?.ogDescription}
        ogImageUrl={seo?.ogImageUrl}
        twitterCard={seo?.twitterCard}
        noIndex={seo?.noIndex}
        structuredDataType={seo?.structuredDataType || "LocalBusiness"}
        additionalJsonLd={seo?.additionalJsonLd}
        siteName="FLX Diamonds"
      />
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#F4F8FC", position: "relative" }}>

      {/* Teal radial glow top-right */}
      <div style={{
        position: "absolute", top: 0, right: 0, zIndex: 0,
        width: "600px", height: "600px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(28,169,201,0.08) 0%, transparent 65%)",
        pointerEvents: "none", transform: "translate(20%, -20%)",
      }} />
      {/* Navy radial tint bottom-left */}
      <div style={{
        position: "absolute", bottom: "10%", left: "20%", zIndex: 0,
        width: "500px", height: "500px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(2,39,74,0.04) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      {/* ══ Page content ══ */}
      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        {/* ── Hero: headline + form ── */}
        <div className="flex flex-col lg:flex-row flex-1" style={{ minHeight: "100vh" }}>

          {/* LEFT — headline + contact info */}
          <motion.div
            initial="hidden" animate="visible" variants={stagger}
            className="flex flex-col justify-start lg:w-1/2 xl:w-5/12"
            style={{ padding: "clamp(110px, 14vw, 160px) clamp(32px, 6vw, 80px) clamp(48px, 6vw, 80px)" }}
          >
            <motion.p variants={up} style={{
              fontSize: "9px", letterSpacing: "0.55em", textTransform: "uppercase",
              color: "#1CA9C9", marginBottom: "24px", fontWeight: 500,
            }}>
              {(isSanityConfigured && sanityContact?.heroTagline) || "Get in Touch"}
            </motion.p>

            <motion.h1 variants={up} className="font-serif" style={{
              fontSize: "clamp(3rem, 6vw, 5.5rem)",
              lineHeight: 1.05, color: "#02274A", marginBottom: "28px",
            }}>
              {(isSanityConfigured && sanityContact?.heroHeading) || "Get in touch."}
            </motion.h1>

            <motion.div variants={up} style={{ display: "flex", gap: "10px", marginBottom: "32px" }}>
              <div style={{ width: "40px", height: "2px", background: "#1CA9C9" }} />
              <div style={{ width: "16px", height: "2px", background: "rgba(28,169,201,0.3)" }} />
            </motion.div>

            <motion.p variants={up} style={{
              fontSize: "14px", lineHeight: 1.8,
              color: "rgba(2,39,74,0.5)", maxWidth: "340px", marginBottom: "56px",
            }}>
              {(isSanityConfigured && sanityContact?.heroSubtext) ||
                "All enquiries are handled personally under strict commercial confidence. No sales process, just a direct conversation."}
            </motion.p>

            {/* Contact details */}
            <motion.div variants={stagger} initial="hidden" animate="visible" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ width: "100%", height: "1px", background: "rgba(2,39,74,0.08)", marginBottom: "4px" }} />
              {[
                { label: "Location", value: address },
                { label: "Email",    value: email, teal: true },
                { label: "Phone",    value: phones.map(p => p.value).join("  ·  ") },
              ].map(({ label, value, teal }: any) => (
                <motion.div key={label} variants={up} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontSize: "8px", letterSpacing: "0.42em", textTransform: "uppercase", color: "rgba(2,39,74,0.3)" }}>
                    {label}
                  </span>
                  <span style={{ fontSize: "12px", color: teal ? "#1CA9C9" : "rgba(2,39,74,0.65)" }}>
                    {value}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT — form card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            className="flex items-center justify-center lg:w-1/2 xl:w-7/12"
            style={{ padding: "clamp(32px, 8vw, 120px) clamp(24px, 5vw, 64px) clamp(40px, 5vw, 64px)" }}
          >
            <div style={{
              width: "100%", maxWidth: "520px",
              background: "#ffffff",
              border: "1px solid rgba(2,39,74,0.09)",
              boxShadow: "0 4px 40px rgba(2,39,74,0.07)",
              padding: "clamp(28px, 4vw, 48px)",
            }}>
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div key="success"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    style={{ textAlign: "center", padding: "40px 0" }}
                    className="space-y-7"
                  >
                    <div style={{ margin: "0 auto", width: "64px", height: "64px" }}>
                      <svg viewBox="0 0 64 64" fill="none" style={{ width: "64px", height: "64px" }}>
                        <polygon points="32,4 60,32 32,60 4,32" stroke="#1CA9C9" strokeWidth="1" />
                        <motion.path d="M22 32l7 7 13-13" stroke="#1CA9C9" strokeWidth="1.5"
                          strokeLinecap="round" strokeLinejoin="round"
                          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="font-serif" style={{ fontSize: "1.8rem", color: "#02274A", marginBottom: "12px" }}>
                        Enquiry received.
                      </h2>
                      <p style={{ fontSize: "13px", lineHeight: 1.7, color: "rgba(2,39,74,0.5)", maxWidth: "300px", margin: "0 auto" }}>
                        {(isSanityConfigured && sanityContact?.responsePromise) || "We will respond personally within one business day. All correspondence is commercially confidential."}
                      </p>
                    </div>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: "8px",
                      padding: "8px 18px", border: "1px solid rgba(28,169,201,0.3)",
                    }}>
                      <span style={{ fontSize: "9px", letterSpacing: "0.4em", textTransform: "uppercase", color: "#1CA9C9" }}>
                        {email}
                      </span>
                    </div>
                    <div>
                      <Link href="/services">
                        <button style={{
                          fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase",
                          color: "rgba(2,39,74,0.35)", background: "none", border: "none",
                          cursor: "pointer", fontFamily: "'Inter', sans-serif",
                        }}
                          className="hover:text-[#02274A] transition-colors"
                        >
                          ← Browse our services
                        </button>
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <div style={{ marginBottom: "32px" }}>
                      <p style={{ fontSize: "8px", letterSpacing: "0.52em", textTransform: "uppercase", color: "rgba(2,39,74,0.35)", marginBottom: "8px", fontWeight: 500 }}>
                        {(isSanityConfigured && sanityContact?.formTagline) || "Enquiry Form"}
                      </p>
                      <div style={{ width: "28px", height: "1px", background: "#1CA9C9" }} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "0 20px" }}>
                      <FloatInput label="First Name" testId="input-firstname" value={form.firstName} onChange={v => set("firstName", v)} required />
                      <FloatInput label="Last Name"  testId="input-lastname"  value={form.lastName}  onChange={v => set("lastName", v)}  required />
                    </div>
                    <FloatInput label="Business Email" type="email" testId="input-email" value={form.email} onChange={v => set("email", v)} required />
                    <FloatInput label="Company / Organisation" testId="input-company" value={form.company} onChange={v => set("company", v)} />
                    <FloatSelect label="Nature of Enquiry" testId="select-enquiry-type" value={form.type} onChange={v => set("type", v)} options={ENQUIRY_TYPES} required />
                    <FloatTextarea label="Message" testId="input-message" value={form.message} onChange={v => set("message", v)} required />

                    <div style={{ height: "28px" }} />
                    <SubmitButton />

                    <p style={{
                      textAlign: "center", paddingTop: "14px",
                      fontSize: "8px", letterSpacing: "0.28em", textTransform: "uppercase",
                      color: "rgba(2,39,74,0.22)",
                    }}>
                      {(isSanityConfigured && sanityContact?.privacyNote) || "All correspondence is commercially confidential"}
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* ══ Stats strip ══ */}
        <div style={{
          borderTop: "1px solid rgba(2,39,74,0.08)",
          background: "#ffffff",
          padding: "24px clamp(32px, 6vw, 80px)",
          display: "flex", flexWrap: "wrap",
          justifyContent: "space-between", alignItems: "stretch",
          gap: "0",
        }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{
              display: "flex", flexDirection: "column", gap: "4px",
              padding: "8px 32px 8px 0",
              borderRight: i < STATS.length - 1 ? "1px solid rgba(2,39,74,0.08)" : "none",
              marginRight: i < STATS.length - 1 ? "32px" : "0",
            }}>
              <span style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", color: "#02274A", fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>
                {s.value}
              </span>
              <span style={{ fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(2,39,74,0.35)" }}>
                {s.label}
              </span>
            </div>
          ))}

          <Link href="/faq" style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: "9px", letterSpacing: "0.32em", textTransform: "uppercase", color: "#1CA9C9", cursor: "pointer" }}>
              Read FAQ →
            </span>
          </Link>
        </div>

      </div>
    </div>
    </>
  );
}

/* ─── Submit button ─────────────────────────────────────────── */
function SubmitButton() {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="submit"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-testid="btn-submit"
      style={{
        position: "relative", width: "100%", height: "50px",
        background: hovered ? "#1CA9C9" : "#02274A",
        border: "none",
        cursor: "pointer", overflow: "hidden",
        transition: "background 0.3s ease",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <span style={{
        position: "relative", zIndex: 1,
        fontSize: "10px", letterSpacing: "0.32em", textTransform: "uppercase",
        color: "#ffffff",
        fontWeight: 500,
      }}>
        Submit Enquiry
      </span>
    </button>
  );
}
