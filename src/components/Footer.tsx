import { Link } from "wouter";
import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";
import { useSanityQuery } from "@/lib/useSanityData";
import { isSanityConfigured } from "@/lib/sanity";
import { SITE_SETTINGS_QUERY } from "@/lib/sanity-queries";

interface SanitySiteSettings {
  logoUrl?: string;
  logoAlt?: string;
  footerTagline?: string;
  footerNote?: string;
  email?: string;
  phones?: { label: string; value: string }[];
  address?: string;
}

const NAV_LEFT = [
  { href: "/diamonds",   label: "Diamonds" },
  { href: "/services",   label: "Services" },
  { href: "/investment", label: "Investment" },
  { href: "/about",      label: "About" },
];

const NAV_RIGHT = [
  { href: "/faq",     label: "FAQ" },
  { href: "/journal", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

const CONTACTS = [
  { label: "Email",     value: "info@flxdiamond.com",    teal: true  },
  { label: "Australia", value: "0474 817 548",              teal: false },
  { label: "India",     value: "+91 99982 17496",         teal: false },
  { label: "Location",  value: "Geelong, VIC, Australia", teal: false },
];

export function Footer() {
  const { data: ssData } = useSanityQuery<SanitySiteSettings>(["site-settings"], SITE_SETTINGS_QUERY);
  const ss = isSanityConfigured ? ssData : null;

  const logoUrl = ss?.logoUrl || "/flx-logo.png";
  const footerTagline = ss?.footerTagline || "Every FL certificate begins with a practiced eye and 47 years of accumulated judgment.";
  const footerNote = ss?.footerNote || "B2B diamond sourcing and precision IF→FL conversion. Serving diamond traders, jewellers, and investors globally from Geelong, Victoria, Australia.";
  const contacts = (ss?.email || ss?.phones?.length || ss?.address)
    ? [
        ...(ss?.email ? [{ label: "Email", value: ss.email, teal: true }] : []),
        ...((ss?.phones || []).map(p => ({ label: p.label, value: p.value, teal: false }))),
        ...(ss?.address ? [{ label: "Location", value: ss.address, teal: false }] : []),
      ]
    : CONTACTS;

  return (
    <footer style={{ background: "#02274A", fontFamily: "'Inter', sans-serif" }}>

      {/* ── Editorial banner ── */}
      <div className="relative overflow-hidden" style={{ borderTop: "1px solid rgba(28,169,201,0.15)" }}>

        {/* Animated teal shimmer line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: "linear-gradient(90deg, transparent 0%, #1CA9C9 30%, rgba(28,169,201,0.4) 60%, transparent 100%)",
            animation: "shimmerLine 6s ease-in-out infinite",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 flex flex-col md:flex-row items-start md:items-end justify-between gap-12">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <Link href="/" data-testid="footer-logo" className="inline-block group">
              <img
                src={logoUrl}
                alt={ss?.logoAlt || "FLX Diamond"}
                style={{
                  height: "clamp(56px, 8vw, 96px)",
                  width: "auto",
                  mixBlendMode: "screen",
                  opacity: 0.92,
                }}
              />
            </Link>
          </motion.div>

          {/* Editorial closing line */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            className="max-w-sm text-right md:pb-3"
          >
            <p
              className="font-serif leading-snug mb-4"
              style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)", color: "rgba(255,255,255,0.6)" }}
            >
              {footerTagline}
            </p>
            <span className="block w-10 h-px ml-auto" style={{ background: "#1CA9C9" }} />
          </motion.div>

        </div>
      </div>

      {/* ── Main grid ── */}
      <div
        className="max-w-7xl mx-auto px-6 pb-16"
        style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 pt-14">

          {/* Brand column */}
          <div className="sm:col-span-2 md:col-span-1 space-y-6">
            <p className="text-[9px] uppercase tracking-[0.45em] font-medium" style={{ color: "#1CA9C9" }}>
              Est. 1978
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.6)", maxWidth: "200px" }}>
              {footerNote}
            </p>
            <div
              className="inline-flex items-center gap-2 px-3 py-2 border"
              style={{ borderColor: "rgba(28,169,201,0.3)", background: "rgba(28,169,201,0.08)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#1CA9C9", opacity: 0.9 }} />
              <span className="text-[9px] uppercase tracking-[0.3em]" style={{ color: "#1CA9C9" }}>
                B2B Enquiries Only
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-6">
            <p className="text-[9px] uppercase tracking-[0.45em] font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>
              Navigate
            </p>
            <ul className="space-y-3">
              {[...NAV_LEFT, ...NAV_RIGHT].map(l => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[11px] tracking-wide transition-all duration-200 hover:translate-x-1 inline-block"
                    style={{ color: "rgba(255,255,255,0.72)" }}
                    data-testid={`footer-link-${l.label.toLowerCase()}`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <p className="text-[9px] uppercase tracking-[0.45em] font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>
              Contact
            </p>
            <ul className="space-y-4">
              {contacts.map(c => (
                <li key={c.label} className="space-y-0.5">
                  <p className="text-[8px] uppercase tracking-[0.35em]" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {c.label}
                  </p>
                  <p
                    className="text-[11px] leading-snug"
                    style={{ color: c.teal ? "#1CA9C9" : "rgba(255,255,255,0.8)" }}
                  >
                    {c.value}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Trusted Partners */}
          <div className="sm:col-span-2 md:col-span-1 space-y-6">
            <p className="text-[9px] uppercase tracking-[0.45em] font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>
              Trusted By
            </p>
            <ul className="space-y-4">
              {[
                { name: "KGK Diamond",     role: "Sourcing Partner" },
                { name: "Venus Jewellery", role: "Conversion Partner" },
                { name: "Excell Overseas", role: "Trade Partner" },
              ].map(p => (
                <li key={p.name} className="space-y-0.5">
                  <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.8)" }}>{p.name}</p>
                  <p className="text-[8px] uppercase tracking-[0.3em]" style={{ color: "rgba(255,255,255,0.4)" }}>{p.role}</p>
                </li>
              ))}
            </ul>
            <p className="text-[10px] leading-relaxed pt-2" style={{ color: "rgba(255,255,255,0.45)" }}>
              All enquiries handled under strict commercial confidence.
            </p>
          </div>

        </div>
      </div>

      {/* ── GIA trust bar ── */}
      <div
        className="max-w-7xl mx-auto px-6 py-8"
        style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div className="flex flex-wrap gap-x-10 gap-y-2">
          {[
            "GIA Certified Stones",
            "47 Years Mastery",
            "IF → FL Conversion Specialists",
            "B2B Only",
            "Commercial Confidence Guaranteed",
          ].map((item, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full" style={{ background: "rgba(28,169,201,0.7)" }} />
              <span className="text-[9px] uppercase tracking-[0.3em]" style={{ color: "rgba(255,255,255,0.5)" }}>
                {item}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div
        className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
      >
        <p className="text-[9px] tracking-[0.3em] uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>
          &copy; {new Date().getFullYear()} FLX Diamonds Pty Ltd &mdash; ABN 43 665 467 274 &mdash; Geelong, Victoria, Australia
        </p>
        <div className="flex gap-6">
          {[{ href: "/privacy", label: "Privacy" }, { href: "/terms", label: "Terms" }].map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[9px] tracking-[0.3em] uppercase transition-colors hover:text-white"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Shimmer keyframe */}
      <style>{`
        @keyframes shimmerLine {
          0%   { transform: translateX(-100%); opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
      `}</style>

    </footer>
  );
}