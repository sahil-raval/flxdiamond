import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useShortlist } from "@/contexts/ShortlistContext";
import { useAuth } from "@/contexts/AuthContext";
import type { Diamond } from "@/lib/diamond_types";

function DiamondRow({ diamond, onRemove }: { diamond: Diamond; onRemove: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-4 md:gap-6 px-5 py-4"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Stone icon */}
      <div
        className="shrink-0 w-10 h-10 flex items-center justify-center"
        style={{ background: "rgba(28,169,201,0.08)", border: "1px solid rgba(28,169,201,0.18)" }}
      >
        <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
          <path d="M11 2L19 8L11 20L3 8Z" stroke="#1CA9C9" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M3 8H19" stroke="#1CA9C9" strokeWidth="1.2" />
        </svg>
      </div>

      {/* Stone details */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
          <span className="font-serif text-white text-base">{diamond.shape}</span>
          <span className="text-sm font-semibold" style={{ color: "#1CA9C9" }}>{diamond.carat.toFixed(2)} ct</span>
          <span className="text-[10px] uppercase tracking-widest font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>{diamond.stockId}</span>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
          <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.45)" }}>
            {diamond.color} · {diamond.clarity} · {diamond.cut}
          </span>
          {diamond.certification !== "None" && (
            <span
              className="text-[9px] font-semibold uppercase tracking-widest px-1.5 py-px"
              style={{
                background: diamond.certification === "GIA" ? "rgba(28,169,201,0.1)" : "rgba(139,92,246,0.1)",
                border: `1px solid ${diamond.certification === "GIA" ? "rgba(28,169,201,0.3)" : "rgba(139,92,246,0.3)"}`,
                color: diamond.certification === "GIA" ? "#1CA9C9" : "#8B5CF6",
              }}
            >
              {diamond.certification}
            </span>
          )}
        </div>
      </div>

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="shrink-0 w-8 h-8 flex items-center justify-center transition-all"
        style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)" }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,100,100,0.4)";
          (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,120,120,0.8)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)";
          (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.3)";
        }}
        aria-label="Remove from shortlist"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </motion.div>
  );
}

export default function Shortlist() {
  const { shortlist, removeFromShortlist, clearShortlist, count } = useShortlist();
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const handleRequestQuote = () => {
    if (isAuthenticated) {
      navigate("/quote-request");
    } else {
      navigate("/login?return=/quote-request");
    }
  };

  return (
    <div style={{ background: "#02274A", minHeight: "100vh" }}>

      {/* Hero */}
      <div className="pt-28 md:pt-40 pb-10 px-8 md:px-14 lg:px-20" style={{ background: "#02274A" }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.45em] mb-4 font-medium" style={{ color: "#1CA9C9" }}>
            Trade Shortlist
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-3 leading-tight">
            Your Stone Selection
          </h1>
          <div className="w-10 h-px my-4" style={{ background: "#1CA9C9" }} />
          <p className="text-white/45 text-sm max-w-xl leading-relaxed font-light">
            Review your selected stones below. When ready, request a trade quote — we'll respond personally within one business day.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 md:px-14 lg:px-20 pb-24">

        {count === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="py-24 text-center flex flex-col items-center gap-6"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ border: "1px solid rgba(28,169,201,0.2)" }}
            >
              <svg width="26" height="26" viewBox="0 0 22 22" fill="none">
                <path d="M11 2L19 8L11 20L3 8Z" stroke="rgba(28,169,201,0.5)" strokeWidth="1.2" strokeLinejoin="round" />
                <path d="M3 8H19" stroke="rgba(28,169,201,0.5)" strokeWidth="1.2" />
              </svg>
            </div>
            <div>
              <h2 className="font-serif text-2xl text-white mb-3">No stones shortlisted</h2>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                Browse our inventory and add stones to your shortlist.
              </p>
            </div>
            <Link href="/diamonds">
              <button
                className="px-8 py-3.5 text-[10px] uppercase tracking-[0.4em] font-semibold text-white transition-all mt-2"
                style={{ background: "#1CA9C9" }}
              >
                Browse Inventory
              </button>
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Stones list */}
            <div
              style={{ background: "#021C38", border: "1px solid rgba(28,169,201,0.12)" }}
            >
              <div
                className="flex items-center justify-between px-5 py-3.5"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
              >
                <span className="text-[10px] uppercase tracking-[0.35em] font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {count} {count === 1 ? "Stone" : "Stones"} Selected
                </span>
                <button
                  onClick={clearShortlist}
                  className="text-[9px] uppercase tracking-[0.25em] transition-all"
                  style={{ color: "rgba(255,255,255,0.28)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,120,120,0.7)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.28)"; }}
                >
                  Clear all
                </button>
              </div>

              <AnimatePresence>
                {shortlist.map(d => (
                  <DiamondRow
                    key={d.stockId}
                    diamond={d}
                    onRemove={() => removeFromShortlist(d.stockId)}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Summary + CTA */}
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <div>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Prices are provided on request — trade accounts only.
                </p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.28)" }}>
                  A confidentiality confirmation is included with every quote.
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <Link href="/diamonds">
                  <button
                    className="px-6 py-3 text-[10px] uppercase tracking-[0.35em] font-medium transition-all"
                    style={{ border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.55)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "white"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.4)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.55)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)"; }}
                  >
                    Add More
                  </button>
                </Link>
                <button
                  onClick={handleRequestQuote}
                  className="px-8 py-3 text-[10px] uppercase tracking-[0.4em] font-semibold text-white transition-all"
                  style={{ background: "#1CA9C9" }}
                  data-testid="btn-request-quote"
                >
                  Request a Quote
                </button>
              </div>
            </div>

            {/* Login nudge if not authenticated */}
            {!isAuthenticated && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 px-5 py-4 flex items-center gap-3"
                style={{ background: "rgba(28,169,201,0.05)", border: "1px solid rgba(28,169,201,0.15)" }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                  <circle cx="8" cy="8" r="7" stroke="#1CA9C9" strokeWidth="1.2" opacity="0.7" />
                  <path d="M8 7v5" stroke="#1CA9C9" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="8" cy="5" r="0.8" fill="#1CA9C9" />
                </svg>
                <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                  You'll be prompted to create a free trade account before submitting your quote request. Your shortlist is saved.
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
