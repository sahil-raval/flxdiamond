import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import { useShortlist } from "@/contexts/ShortlistContext";
import { useAuth } from "@/contexts/AuthContext";
import type { Diamond } from "@/lib/diamond_types";

const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || "";
const EMAILJS_OWNER_TMPL  = import.meta.env.VITE_EMAILJS_OWNER_TMPL  || "";
const EMAILJS_BUYER_TMPL  = import.meta.env.VITE_EMAILJS_BUYER_TMPL  || "";
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || "";

const emailjsConfigured = !!(EMAILJS_SERVICE_ID && EMAILJS_OWNER_TMPL && EMAILJS_PUBLIC_KEY);

function formatStonesList(stones: Diamond[]): string {
  return stones.map((d, i) =>
    `${i + 1}. ${d.stockId} — ${d.carat.toFixed(2)}ct ${d.shape} | ${d.color}/${d.clarity}/${d.cut} | ${d.certification}`
  ).join("\n");
}

function StoneRow({ diamond }: { diamond: Diamond }) {
  return (
    <div
      className="flex items-center gap-4 px-5 py-3.5"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div
        className="shrink-0 w-8 h-8 flex items-center justify-center"
        style={{ background: "rgba(28,169,201,0.08)", border: "1px solid rgba(28,169,201,0.18)" }}
      >
        <svg width="14" height="14" viewBox="0 0 22 22" fill="none">
          <path d="M11 2L19 8L11 20L3 8Z" stroke="#1CA9C9" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M3 8H19" stroke="#1CA9C9" strokeWidth="1.2" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
          <span className="font-serif text-white text-sm">{diamond.shape}</span>
          <span className="text-sm font-semibold" style={{ color: "#1CA9C9" }}>{diamond.carat.toFixed(2)} ct</span>
          <span className="font-mono text-[9px]" style={{ color: "rgba(255,255,255,0.35)" }}>{diamond.stockId}</span>
        </div>
        <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
          {diamond.color} · {diamond.clarity} · {diamond.cut} · {diamond.certification !== "None" ? diamond.certification : "Uncert."}
        </p>
      </div>
    </div>
  );
}

export default function QuoteRequest() {
  const { shortlist, clearShortlist, count } = useShortlist();
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?return=/quote-request");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated && count === 0 && status !== "success") {
      navigate("/shortlist");
    }
  }, [isAuthenticated, count, status, navigate]);

  if (!isAuthenticated || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    const stonesList = formatStonesList(shortlist);
    const now = new Date().toLocaleString("en-AU", { timeZone: "Australia/Melbourne", dateStyle: "full", timeStyle: "short" });

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
        // Buyer confirmation email is optional — only send it if a buyer template is configured.
        if (EMAILJS_BUYER_TMPL) {
          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_BUYER_TMPL, { ...buyerParams, to_email: user.email }, EMAILJS_PUBLIC_KEY);
        }
      } else {
        await new Promise(r => setTimeout(r, 1200));
        console.info("[FLX] EmailJS not configured — quote data:", ownerParams);
      }
      clearShortlist();
      setStatus("success");
    } catch (err) {
      console.error(err);
      setErrorMsg("There was a problem sending your request. Please try again or contact us directly.");
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "success") {
    return (
      <div style={{ background: "#02274A", minHeight: "100vh" }} className="flex items-center justify-center px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-lg mx-auto py-24 flex flex-col items-center gap-6"
        >
          {/* Tick */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "rgba(28,169,201,0.1)", border: "1px solid rgba(28,169,201,0.3)" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 12L10 17L19 7" stroke="#1CA9C9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.45em] mb-3 font-medium" style={{ color: "#1CA9C9" }}>
              Quote Submitted
            </p>
            <h2 className="font-serif text-3xl text-white mb-4">Thank you, {user.name.split(" ")[0]}.</h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
              Your quote request has been received. We'll respond to <strong style={{ color: "rgba(255,255,255,0.7)" }}>{user.email}</strong>{" "}
              personally within one business day with pricing and availability.
            </p>
          </div>

          <div
            className="w-full px-5 py-4 text-left"
            style={{ background: "rgba(28,169,201,0.05)", border: "1px solid rgba(28,169,201,0.15)" }}
          >
            <p className="text-[9px] uppercase tracking-[0.35em] font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>What happens next</p>
            <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
              A confirmation has been sent to your email. Our team will review your selection and prepare an itemised trade quote with full disclosure on each stone.
            </p>
          </div>

          {!emailjsConfigured && (
            <div
              className="w-full px-5 py-4"
              style={{ background: "rgba(255,180,0,0.06)", border: "1px solid rgba(255,180,0,0.2)" }}
            >
              <p className="text-[10px] uppercase tracking-[0.3em] font-semibold mb-1" style={{ color: "rgba(255,180,100,0.8)" }}>
                Dev mode — EmailJS not configured
              </p>
              <p className="text-[10px] leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
                Set <code style={{ color: "rgba(28,169,201,0.8)" }}>VITE_EMAILJS_SERVICE_ID</code>,{" "}
                <code style={{ color: "rgba(28,169,201,0.8)" }}>VITE_EMAILJS_OWNER_TMPL</code>, and{" "}
                <code style={{ color: "rgba(28,169,201,0.8)" }}>VITE_EMAILJS_PUBLIC_KEY</code> to enable real email sending.{" "}
                <code style={{ color: "rgba(28,169,201,0.8)" }}>VITE_EMAILJS_BUYER_TMPL</code> is optional (buyer confirmation email).
              </p>
            </div>
          )}

          <div className="flex gap-3 mt-2">
            <Link href="/diamonds">
              <button
                className="px-6 py-3 text-[10px] uppercase tracking-[0.35em] font-medium transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.55)" }}
              >
                Continue Browsing
              </button>
            </Link>
            <Link href="/">
              <button
                className="px-6 py-3 text-[10px] uppercase tracking-[0.4em] font-semibold text-white"
                style={{ background: "#1CA9C9" }}
              >
                Home
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ background: "#02274A", minHeight: "100vh" }}>

      {/* Hero */}
      <div className="pt-28 md:pt-40 pb-10 px-8 md:px-14 lg:px-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.45em] mb-4 font-medium" style={{ color: "#1CA9C9" }}>
            Trade Quote Request
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-3 leading-tight">
            Review & Submit
          </h1>
          <div className="w-10 h-px my-4" style={{ background: "#1CA9C9" }} />
          <p className="text-white/45 text-sm max-w-xl leading-relaxed font-light">
            Confirm your stone selection and submit your quote request. We'll respond within one business day.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-8 md:px-14 lg:px-20 pb-24">
        <form onSubmit={handleSubmit} className="grid md:grid-cols-5 gap-10">

          {/* Left: stones + message */}
          <div className="md:col-span-3 flex flex-col gap-6">

            {/* Stone list */}
            <div style={{ background: "#021C38", border: "1px solid rgba(28,169,201,0.12)" }}>
              <div
                className="flex items-center justify-between px-5 py-3"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
              >
                <span className="text-[10px] uppercase tracking-[0.35em] font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {count} {count === 1 ? "Stone" : "Stones"} Selected
                </span>
                <Link href="/shortlist">
                  <span className="text-[9px] uppercase tracking-[0.25em] cursor-pointer transition-colors" style={{ color: "rgba(28,169,201,0.6)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#1CA9C9"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(28,169,201,0.6)"; }}>
                    Edit Shortlist
                  </span>
                </Link>
              </div>
              {shortlist.map(d => <StoneRow key={d.stockId} diamond={d} />)}
            </div>

            {/* Optional message */}
            <div>
              <label
                className="block text-[9px] uppercase tracking-[0.38em] font-semibold mb-3"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                Additional Notes (optional)
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={4}
                placeholder="Any specific requirements, timing, or questions about these stones..."
                className="w-full text-sm text-white bg-transparent resize-none outline-none placeholder:text-white/20"
                style={{
                  border: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.15)",
                  padding: "10px 0 8px",
                  lineHeight: 1.6,
                  transition: "border-color 0.2s",
                }}
                onFocus={e => { e.currentTarget.style.borderBottomColor = "#1CA9C9"; }}
                onBlur={e => { e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.15)"; }}
              />
            </div>
          </div>

          {/* Right: buyer details + submit */}
          <div className="md:col-span-2 flex flex-col gap-5">

            {/* Buyer summary */}
            <div style={{ background: "#021C38", border: "1px solid rgba(28,169,201,0.12)" }}>
              <div
                className="flex items-center justify-between px-5 py-3"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
              >
                <span className="text-[10px] uppercase tracking-[0.35em] font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Submitting As
                </span>
              </div>
              {[
                { label: "Name",    value: user.name },
                { label: "Email",   value: user.email },
                { label: "Company", value: user.company },
                { label: "Phone",   value: user.phone || "—" },
              ].map(row => (
                <div
                  key={row.label}
                  className="flex items-center justify-between px-5 py-2.5"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <span className="text-[9px] uppercase tracking-[0.25em]" style={{ color: "rgba(255,255,255,0.28)" }}>
                    {row.label}
                  </span>
                  <span className="text-[11px] text-right max-w-[60%] truncate" style={{ color: "rgba(255,255,255,0.65)" }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Confidentiality note */}
            <div
              className="px-4 py-3"
              style={{ background: "rgba(28,169,201,0.04)", border: "1px solid rgba(28,169,201,0.1)" }}
            >
              <p className="text-[10px] leading-relaxed" style={{ color: "rgba(255,255,255,0.38)" }}>
                All quotes are strictly confidential. Your enquiry is handled personally — never automated or shared.
              </p>
            </div>

            {/* Error */}
            <AnimatePresence>
              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[11px] leading-relaxed"
                  style={{ color: "rgba(255,140,140,0.85)" }}
                >
                  {errorMsg}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 text-[10px] uppercase tracking-[0.4em] font-semibold text-white transition-all"
              style={{
                background: submitting ? "rgba(28,169,201,0.5)" : "#1CA9C9",
                cursor: submitting ? "wait" : "pointer",
              }}
              data-testid="btn-submit-quote"
            >
              {submitting ? "Sending..." : "Submit Quote Request"}
            </button>

            {!emailjsConfigured && (
              <p className="text-[9px] text-center" style={{ color: "rgba(255,255,255,0.22)" }}>
                EmailJS env vars not set — quote will log to console in dev mode.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}