import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";
import { Link } from "wouter";
import { useSanityQuery } from "@/lib/useSanityData";
import { isSanityConfigured } from "@/lib/sanity";
import { SERVICES_QUERY, SERVICES_PAGE_QUERY } from "@/lib/sanity-queries";
import SeoHead from "@/components/SeoHead";

const fade = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

const SERVICES = [
  {
    id: "natural-diamonds",
    number: "01",
    label: "Natural Diamonds",
    title: "Natural\nDiamonds",
    tagline: "Stones sourced with documented provenance and verified GIA grading at every step.",
    body: [
      "We source natural diamonds through an established trade network built over decades. Every stone we handle carries a current GIA grading report, and we verify each one before it reaches a buyer. Provenance is not a marketing claim — it is a condition of supply.",
      "Our inventory spans a range of carat weights, shapes, and colour-clarity combinations, with a consistent focus on quality at the top of each bracket. For buyers who need reliable access to well-graded natural stones, we offer individual sourcing, ongoing standing briefs, and supply arrangements structured to your requirements.",
    ],
    qualifies: [
      "Jewellers and manufacturers requiring consistent access to GIA-graded natural stones",
      "Buyers seeking a sourcing partner with verified trade relationships, not aggregator listings",
      "Enquiries from 0.30ct upward across round brilliant, fancy shapes, and select cuts",
      "Trade accounts with an established business profile",
    ],
    delivers: [
      "Individual stone details with GIA report numbers on request",
      "Accurate representation of colour, clarity, cut, and carat — no embellishment",
      "Discreet, documented delivery with appropriate commercial paperwork",
      "Standing brief fulfilment for buyers with ongoing or repeat requirements",
    ],
    turnaround: "Typically 1–3 weeks depending on specification",
    dark: true,
    signature: false,
  },
  {
    id: "lab-grown",
    number: "02",
    label: "Lab Grown Diamonds",
    title: "Lab Grown\nDiamonds",
    tagline: "Certified consistency and accessible pricing — modern quality without compromise.",
    body: [
      "Lab grown diamonds are chemically and optically identical to their natural counterparts, and the best of them carry the same third-party certifications. What they offer above all else is pricing transparency and grading consistency — qualities that matter to buyers who need to plan, budget, and communicate value to their own clients.",
      "We supply GIA-certified lab grown stones with the same attention to grading accuracy we apply across all our inventory. Supply can be arranged as one-off purchases or ongoing allocation agreements against agreed parameters of size, shape, and quality.",
    ],
    qualifies: [
      "Retailers and manufacturers building product lines around lab grown stones",
      "Buyers seeking a reliable supplier with certified, accurately represented inventory",
      "Enquiries from 0.30ct upward; rounds, ovals, cushions, and other standard shapes",
      "New trade partners subject to a brief qualification process",
    ],
    delivers: [
      "GIA-certified lab grown diamonds with report numbers provided on request",
      "Honest grading representation — the certificate is the specification",
      "Flexible supply arrangements including standing allocation briefs",
      "Discreet commercial documentation and delivery",
    ],
    turnaround: "Typically 1–2 weeks for in-stock stones",
    dark: false,
    signature: false,
  },
  {
    id: "customizing",
    number: "03",
    label: "Customizing Diamonds",
    title: "Customizing\nDiamonds",
    tagline: "Bespoke shaping, cutting, and finishing — the stone, built precisely to your brief.",
    body: [
      "Not every client's requirement is met by what is already available. We offer a bespoke customization service for buyers who need a diamond shaped, cut, or finished to a specific brief — whether that is a particular outline, a target carat range from a given rough, or a refined finish on an existing polished stone.",
      "The process begins with a design consultation to establish what is technically achievable and commercially viable. From there, we manage the cutting and finishing process with the precision that the diamond trade demands, delivering a stone that meets the agreed specification.",
    ],
    qualifies: [
      "Jewellers and designers requiring a stone cut to a specific shape or carat brief",
      "Buyers working with rough or semi-polished material who need expert finishing",
      "Clients with an existing stone requiring recutting, reshaping, or facet refinement",
      "Trade partners whose production requires consistent bespoke supply",
    ],
    delivers: [
      "Initial consultation to assess viability and establish the specification",
      "Expert cutting and finishing to the agreed brief, with milestone updates",
      "Final stone with full documentation of work performed",
      "GIA or equivalent certification arranged where applicable",
    ],
    turnaround: "4–8 weeks from agreed brief to completed stone, depending on complexity",
    dark: true,
    signature: false,
  },
  {
    id: "conversion",
    number: "04",
    label: "House Signature",
    title: "IF → FL\nConversion",
    tagline: "The conversion that redefines a stone's commercial ceiling.",
    body: [
      "We assess Internally Flawless (IF) diamonds for the specific surface characteristics that hold them below FL grade. Where removal is viable — with no meaningful carat loss — we execute a precision micro-regrind of the affected facet and re-submit the stone to GIA for FL certification.",
      "The result is a GIA-certified Flawless diamond with verified carat weight, documented conversion history, and a new certificate. For the buyer or portfolio holder, FL carries a material premium over IF that justifies the conversion cost many times over at commercial scale.",
    ],
    qualifies: [
      "IF diamonds with surface-only characteristics (naturals, extra facets, surface graining)",
      "Minimum 0.50ct; conversion economics justify from this threshold upward",
      "Round brilliant or other standard cuts with accessible facet geometry",
      "Stones accompanied by a current GIA grading report",
    ],
    delivers: [
      "Written assessment with conversion viability and projected outcome",
      "Precision micro-regrind within 0.01mm material removal",
      "GIA re-submission and new FL certificate",
      "Full documentation of the conversion for your records",
    ],
    turnaround: "3–6 weeks from stone receipt to FL certificate",
    dark: false,
    signature: true,
  },
];

function ServiceBlock({ s, index }: { s: typeof SERVICES[number]; index: number }) {
  const bg       = s.dark ? "#02274A" : "white";
  const text     = s.dark ? "rgba(255,255,255,0.85)" : "#02274A";
  const muted    = s.dark ? "rgba(255,255,255,0.36)" : "rgba(2,39,74,0.5)";
  const border   = s.dark ? "rgba(255,255,255,0.07)" : "rgba(2,39,74,0.08)";
  const tagColor = s.dark ? "rgba(255,255,255,0.28)" : "rgba(2,39,74,0.35)";

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={stagger}
      style={{ background: bg, fontFamily: "'Inter', sans-serif" }}
      className="relative overflow-hidden"
    >
      {/* Watermark number — hidden on mobile, subtle on desktop */}
      <div
        className="absolute select-none pointer-events-none hidden md:block"
        style={{
          fontSize: "clamp(160px, 22vw, 340px)",
          fontFamily: "'Playfair Display', serif",
          color: s.dark ? "rgba(255,255,255,0.04)" : "rgba(2,39,74,0.04)",
          lineHeight: 1,
          right: s.dark ? "-1%" : "auto",
          left: s.dark ? "auto" : "-1%",
          top: "50%",
          transform: "translateY(-50%)",
          letterSpacing: "-0.04em",
          fontWeight: 400,
        }}
        aria-hidden="true"
      >
        {s.number}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-32">

        {/* Label breadcrumb row */}
        <motion.div variants={fade} className="flex items-center gap-4 mb-10 md:mb-16">
          <span className="text-[9px] uppercase tracking-[0.55em] font-medium" style={{ color: "#1CA9C9" }}>
            {s.label}
          </span>
          <span className="w-8 md:w-12 h-px" style={{ background: "rgba(28,169,201,0.3)" }} />
          <span className="text-sm tabular-nums" style={{ color: muted }}>
            {s.number}
          </span>
        </motion.div>

        {/* Main grid — single col mobile → 12-col desktop */}
        <div className="grid md:grid-cols-12 gap-10 md:gap-20 items-start">

          {/* LEFT — heading block */}
          <motion.div variants={stagger} className="md:col-span-4 space-y-4">
            {/* Signature badge — only for the IF→FL block */}
            {s.signature && (
              <motion.div variants={fade} className="inline-flex items-center gap-2 mb-0">
                <span
                  className="text-[8px] uppercase tracking-[0.35em] px-2.5 py-1 border"
                  style={{
                    color: "#1CA9C9",
                    borderColor: "rgba(28,169,201,0.35)",
                    background: "rgba(28,169,201,0.06)",
                    letterSpacing: "0.35em",
                  }}
                >
                  Signature Service
                </span>
              </motion.div>
            )}

            <motion.h2
              variants={fade}
              className="font-serif leading-tight"
              style={{
                fontSize: s.signature
                  ? "clamp(2.2rem, 4.5vw, 3.8rem)"
                  : "clamp(2rem, 4vw, 3.4rem)",
                color: text,
                whiteSpace: "pre-line",
              }}
            >
              {s.title}
            </motion.h2>
            <motion.span variants={fade} className="block w-10 h-px" style={{ background: "#1CA9C9" }} />
            <motion.p
              variants={fade}
              className="text-sm leading-relaxed italic"
              style={{
                color: tagColor,
                fontWeight: s.signature ? 500 : 400,
                fontSize: s.signature ? "0.875rem" : undefined,
              }}
            >
              {s.tagline}
            </motion.p>

            {/* Turnaround */}
            <motion.div variants={fade} className="flex items-start gap-3 pt-3">
              <div className="mt-0.5 w-px" style={{ background: "rgba(28,169,201,0.4)", minHeight: "36px" }} />
              <div>
                <p className="text-[9px] uppercase tracking-[0.4em] mb-1" style={{ color: "#1CA9C9" }}>
                  Typical Turnaround
                </p>
                <p className="text-[12px] leading-snug" style={{ color: muted }}>
                  {s.turnaround}
                </p>
              </div>
            </motion.div>

            {/* Mobile CTA */}
            <motion.div variants={fade} className="pt-2 md:hidden">
              <Link href="/contact" data-testid={`btn-services-${s.id}-enquire`}>
                <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em]" style={{ color: "#1CA9C9" }}>
                  Enquire → 
                </span>
              </Link>
            </motion.div>
          </motion.div>

          {/* MIDDLE — body text (full width on mobile, col 5-8 on desktop) */}
          <motion.div variants={stagger} className="md:col-span-4 space-y-5">
            <motion.p variants={fade} className="text-[9px] uppercase tracking-[0.45em] mb-5" style={{ color: "#1CA9C9" }}>
              Overview
            </motion.p>
            {s.body.map((para, i) => (
              <motion.p key={i} variants={fade} className="text-sm leading-relaxed" style={{ color: muted }}>
                {para}
              </motion.p>
            ))}

            {/* Desktop CTA */}
            <motion.div variants={fade} className="pt-6 hidden md:block">
              <Link href="/contact" data-testid={`btn-services-${s.id}-enquire`} className="inline-flex items-center gap-3 group">
                <span
                  className="text-[10px] uppercase tracking-[0.3em] border-b pb-0.5 transition-all duration-300 group-hover:border-[#1CA9C9]"
                  style={{ color: "#1CA9C9", borderColor: "rgba(28,169,201,0.35)" }}
                >
                  Enquire About This Service
                </span>
                <span className="text-[#1CA9C9] transition-transform duration-300 group-hover:translate-x-1 text-[11px]">→</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* RIGHT — qualifies + delivers */}
          <motion.div variants={stagger} className="md:col-span-4 space-y-8">

            <motion.div variants={fade} className="space-y-4">
              <p className="text-[9px] uppercase tracking-[0.4em]" style={{ color: "#1CA9C9" }}>Who This Suits</p>
              <ul className="space-y-3">
                {s.qualifies.map((q, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="mt-1.5 shrink-0 w-1 h-1 rounded-full" style={{ background: "#1CA9C9", opacity: 0.6 }} />
                    <span className="text-[12px] leading-relaxed" style={{ color: muted }}>{q}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={fade} className="w-full h-px" style={{ background: border }} />

            <motion.div variants={fade} className="space-y-4">
              <p className="text-[9px] uppercase tracking-[0.4em]" style={{ color: "#1CA9C9" }}>What You Receive</p>
              <ul className="space-y-3">
                {s.delivers.map((d, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="mt-1.5 shrink-0 text-[10px]" style={{ color: "#1CA9C9", opacity: 0.7 }}>✓</span>
                    <span className="text-[12px] leading-relaxed" style={{ color: muted }}>{d}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

interface SanityService {
  _id: string;
  number: string;
  label: string;
  title: string;
  tagline: string;
  body: string[];
  qualifies: string[];
  delivers: string[];
  turnaround: string;
  dark: boolean;
  signature: boolean;
}

export default function Services() {
  const { data: sanityServices } = useSanityQuery<SanityService[]>(["services"], SERVICES_QUERY);
  const { data: sp } = useSanityQuery<{ heroTagline?: string; heroHeading?: string; heroSubtext?: string; closingTagline?: string; closingHeading?: string; closingBody?: string }>(["services-page"], SERVICES_PAGE_QUERY);
  const spc = isSanityConfigured ? sp : null;

  const activeServices = isSanityConfigured && sanityServices && sanityServices.length > 0
    ? sanityServices.map((s) => ({
        id: s.label.toLowerCase().replace(/\s+/g, "-"),
        number: s.number,
        label: s.label,
        title: s.title,
        tagline: s.tagline,
        body: s.body ?? [],
        qualifies: s.qualifies ?? [],
        delivers: s.delivers ?? [],
        turnaround: s.turnaround,
        dark: s.dark,
        signature: s.signature,
      }))
    : SERVICES;

  return (
    <>
      <SeoHead
        metaTitle="Services | FLX Diamonds — Natural, Lab-Grown, Customising & IF→FL Conversion"
        metaDescription="Four specialist diamond services: natural sourcing, lab-grown supply, bespoke customisation, and the house-signature IF→FL conversion. Trade-only. GIA-certified."
        metaKeywords="diamond services, IF to FL conversion, natural diamonds Australia, lab grown diamonds trade, GIA certified"
        structuredDataType="Service"
        siteName="FLX Diamonds"
      />
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ══ HERO ══ */}
      <section
        className="relative overflow-hidden pt-28 md:pt-40 pb-20 md:pb-36 px-8 md:px-14 lg:px-20"
        style={{ background: "#02274A" }}
      >
        {/* Grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(28,169,201,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(28,169,201,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />

        {/* Desktop watermark */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none hidden lg:block"
          style={{
            fontSize: "clamp(120px, 18vw, 220px)",
            fontFamily: "'Playfair Display', serif",
            color: "rgba(255,255,255,0.025)",
            lineHeight: 1,
            letterSpacing: "-0.04em",
          }}
          aria-hidden="true"
        >
          Services
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative max-w-7xl mx-auto"
        >
          <motion.p variants={fade} className="text-[10px] uppercase tracking-[0.55em] mb-6 md:mb-8" style={{ color: "#1CA9C9" }}>
            {spc?.heroTagline || "What We Do"}
          </motion.p>

          <div className="grid md:grid-cols-2 gap-8 md:gap-16 lg:gap-24 items-center">
            <div>
              <motion.h1
                variants={fade}
                className="font-serif leading-[1.05] mb-6 md:mb-8"
                style={{
                  fontSize: "clamp(2.4rem, 7vw, 5.5rem)",
                  color: "rgba(255,255,255,0.92)",
                }}
              >
                {spc?.heroHeading ? spc.heroHeading : (<>Four services.<br /><span style={{ color: "rgba(255,255,255,0.22)" }}>One standard.</span></>)}
              </motion.h1>
              <motion.span variants={fade} className="block w-12 h-px" style={{ background: "#1CA9C9" }} />
            </div>
            <motion.div variants={stagger} className="space-y-5 md:pb-4">
              <motion.p variants={fade} className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.36)" }}>
                {spc?.heroSubtext || "Every service we offer is built around a single principle: the buyer should know exactly what they are getting before they commit. We describe our work with precision because imprecision in this industry costs people money."}
              </motion.p>
              {/* Service index pills */}
              <motion.div variants={fade} className="flex flex-wrap gap-2 pt-1">
                {activeServices.map(s => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 border transition-all duration-200 hover:border-[#1CA9C9] group"
                    style={{ borderColor: "rgba(28,169,201,0.2)", background: "rgba(28,169,201,0.04)" }}
                  >
                    <span className="text-[8px] font-medium" style={{ color: "rgba(28,169,201,0.5)" }}>{s.number}</span>
                    <span className="text-[9px] uppercase tracking-[0.2em] group-hover:text-[#1CA9C9] transition-colors" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {s.label}
                    </span>
                  </a>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Separator */}
          <motion.div
            variants={fade}
            className="mt-12 md:mt-20 w-full h-px"
            style={{ background: "linear-gradient(90deg, #1CA9C9 0%, rgba(28,169,201,0.2) 40%, transparent 100%)" }}
          />
        </motion.div>
      </section>

      {/* ══ SERVICE BLOCKS ══ */}
      {activeServices.map((s, i) => (
        <div key={s.id} id={s.id}>
          <ServiceBlock s={s} index={i} />
        </div>
      ))}

      {/* ══ CLOSING CTA ══ */}
      <section
        className="relative overflow-hidden py-24 md:py-36 px-6"
        style={{ background: "#02274A" }}
      >
        <div
          className="absolute pointer-events-none"
          style={{
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(28,169,201,0.08) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="relative max-w-3xl mx-auto text-center space-y-6 md:space-y-8"
        >
          <motion.p variants={fade} className="text-[10px] uppercase tracking-[0.55em]" style={{ color: "#1CA9C9" }}>
            {spc?.closingTagline || "All Enquiries"}
          </motion.p>
          <motion.h2
            variants={fade}
            className="font-serif leading-snug"
            style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)", color: "rgba(255,255,255,0.85)" }}
          >
            {spc?.closingHeading || "We handle all enquiries directly and under strict commercial confidence."}
          </motion.h2>
          <motion.p variants={fade} className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.3)" }}>
            {spc?.closingBody || "There is no sales process, only an honest conversation about whether we are the right fit."}
          </motion.p>

          <motion.div variants={fade} className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link href="/contact" data-testid="btn-services-contact">
              <button
                className="w-full sm:w-auto text-[10px] uppercase tracking-[0.3em] text-white transition-all duration-200 hover:opacity-80"
                style={{ background: "#1CA9C9", height: "50px", padding: "0 2.25rem", border: "none" }}
              >
                Begin the Conversation
              </button>
            </Link>
            <Link href="/faq" data-testid="btn-services-faq">
              <button
                className="w-full sm:w-auto text-[10px] uppercase tracking-[0.3em] transition-all duration-200 hover:border-[#1CA9C9] hover:text-[#1CA9C9]"
                style={{
                  background: "transparent",
                  height: "50px",
                  padding: "0 2.25rem",
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                Common Questions
              </button>
            </Link>
          </motion.div>

          <motion.div variants={fade} className="pt-8 md:pt-12 flex justify-center gap-5 md:gap-8 flex-wrap">
            {["B2B Only", "47 Years Mastery", "GIA Certified", "Commercial Confidence"].map(tag => (
              <span key={tag} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full" style={{ background: "rgba(28,169,201,0.4)" }} />
                <span className="text-[9px] uppercase tracking-[0.3em]" style={{ color: "rgba(255,255,255,0.18)" }}>{tag}</span>
              </span>
            ))}
          </motion.div>
        </motion.div>
      </section>

    </div>
    </>
  );
}
