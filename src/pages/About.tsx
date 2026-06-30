import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useSanityQuery } from "@/lib/useSanityData";
import { isSanityConfigured } from "@/lib/sanity";
import { ABOUT_PAGE_QUERY } from "@/lib/sanity-queries";
import SeoHead from "@/components/SeoHead";

const up = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.14 } },
};

const PARTNERSHIPS = [
  {
    name: "KGK Diamond",
    role: "Sourcing & Conversion Partner",
    detail: "Supplied precision-cut FL diamonds and specialised regrinding services across multiple production seasons.",
  },
  {
    name: "Venus Jewellery",
    role: "Technical Evaluation Partner",
    detail: "Provided expert stone assessment and IF→FL conversion for high-value finished jewellery projects.",
  },
  {
    name: "Excell Overseas",
    role: "Long-term Trade Partner",
    detail: "Ongoing supply relationship spanning loose FL diamonds and GIA-verified conversion parcels.",
  },
];

const PILLARS = [
  {
    label: "Technical Depth",
    body: "We do not grade by eye alone. Each stone is assessed against its GIA report with full understanding of what the inclusions are, where they sit, and whether removal is viable without carat loss beyond threshold.",
  },
  {
    label: "Commercial Discretion",
    body: "Every enquiry is handled under strict commercial confidence. We do not discuss client relationships publicly, and we expect the same standard from the partners we choose to work with.",
  },
  {
    label: "Geelong, Australia",
    body: "Operating from Geelong, Victoria, we serve trade partners globally while maintaining the time-zone availability and regulatory environment of a mature, stable business jurisdiction.",
  },
];

interface SanityAboutPage {
  seo?: {
    metaTitle?: string; metaDescription?: string; metaKeywords?: string;
    ogTitle?: string; ogDescription?: string; ogImageUrl?: string;
    twitterCard?: string; noIndex?: boolean;
    structuredDataType?: string; additionalJsonLd?: string;
  };
  partnerships?: { name: string; role: string; detail: string }[];
  pillars?: { label: string; body: string }[];
  heroTagline?: string;
  heroHeading?: string;
  heroSubtext?: string;
  craftsman?: { name: string; beganCutting: string; yearsMastery: string; primaryCraft: string; basedIn: string; biography?: string[]; photoUrl?: string };
  techniqueTagline?: string;
  techniqueHeading?: string;
  techniqueIntro?: string[];
  techniqueSteps?: { step: string; title: string; body: string }[];
  ctaHeading?: string;
  ctaBody?: string;
}

const CRAFTSMAN_BIO = [
  "Babu began cutting diamonds in 1978, aged 12, apprenticed to craftsmen in the diamond ateliers of Surat. The work in those ateliers was exacting: every error came out of the stone's value, which meant every error came out of his reputation.",
  "By his late 20s he had developed what most craftsmen in the industry never acquire: the ability to read a GIA report not as a grade, but as a map. He could identify which surface inclusions were responsible for holding a stone at IF grade, and could determine, often by examination alone, whether those characteristics sat within reach of a micro-regrind.",
  "The IF→FL conversion is not taught formally. It is developed over a career of failed attempts, successful recoveries, and accumulated judgment. Of the craftsmen who attempt it with regularity, only a handful can execute consistently at commercial scale without meaningful carat loss. Babu is among them.",
];

const TECHNIQUE_INTRO = [
  "GIA grades Internally Flawless (IF) stones based on the absence of internal inclusions, but allows for minor surface blemishes such as naturals, extra facets, or surface graining. FL grade requires that neither internal nor external characteristics are present under 10× magnification by a trained grader.",
  "When the only barrier to FL is a surface-level characteristic, a precision micro-regrind of the affected facet can eliminate it entirely. The operation is measured in hundredths of a millimetre, typically under 0.01mm of material removal. Executed correctly, carat weight is preserved within GIA rounding thresholds and the stone re-grades as FL.",
];

const TECHNIQUE_STEPS = [
  { step: "01", title: "Certificate Assessment", body: "The GIA report is read as a technical document, not a grade. Inclusion type, facet location, and depth are mapped against the stone." },
  { step: "02", title: "Physical Examination", body: "The stone is examined under 10× loupe and microscopy. The surface characteristic is identified, measured, and assessed for removability." },
  { step: "03", title: "Micro-Regrind", body: "A precision regrind of the affected facet removes the characteristic within sub-0.01mm tolerance. Polish is restored to GIA standard." },
  { step: "04", title: "GIA Re-submission", body: "The stone is submitted to GIA for re-grading. A new FL certificate is issued. The conversion is documented and verifiable." },
];

export default function About() {
  const { data: sanityAbout } = useSanityQuery<SanityAboutPage>(["about-page"], ABOUT_PAGE_QUERY);

  const cms = isSanityConfigured ? sanityAbout : null;

  const partnerships = cms?.partnerships?.length
    ? cms.partnerships
    : PARTNERSHIPS;

  const pillars = cms?.pillars?.length
    ? cms.pillars
    : PILLARS;

  const c = cms?.craftsman;
  const craftsmanStats = [
    { label: "Began cutting", value: c?.beganCutting || "1978, Age 12" },
    { label: "Years mastery", value: c?.yearsMastery || "47 Years" },
    { label: "Primary craft", value: c?.primaryCraft || "IF → FL Conversion" },
    { label: "Based in",      value: c?.basedIn || "Geelong, VIC" },
  ];
  const craftsmanBio = c?.biography?.length ? c.biography : CRAFTSMAN_BIO;
  const techniqueIntro = cms?.techniqueIntro?.length ? cms.techniqueIntro : TECHNIQUE_INTRO;
  const techniqueSteps = cms?.techniqueSteps?.length ? cms.techniqueSteps : TECHNIQUE_STEPS;

  const seo = sanityAbout?.seo;

  return (
    <>
      <SeoHead
        metaTitle={seo?.metaTitle || "About | FLX Diamonds — Heritage, Mastery & IF→FL Precision"}
        metaDescription={seo?.metaDescription || "47 years of diamond mastery. Babu Vekariya pioneered the IF→FL conversion technique from Geelong, Australia. GIA-certified sourcing for global trade partners."}
        metaKeywords={seo?.metaKeywords || "FLX Diamonds about, Babu Vekariya, diamond craftsman, IF to FL conversion, diamond sourcing Geelong"}
        ogTitle={seo?.ogTitle}
        ogDescription={seo?.ogDescription}
        ogImageUrl={seo?.ogImageUrl}
        twitterCard={seo?.twitterCard}
        noIndex={seo?.noIndex}
        structuredDataType={seo?.structuredDataType || "WebPage"}
        additionalJsonLd={seo?.additionalJsonLd}
        siteName="FLX Diamonds"
      />
    <div className="" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Hero ── */}
      <section className="pt-28 md:pt-40 pb-20 md:pb-28 px-8 md:px-14 lg:px-20" style={{ background: "#02274A" }}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid md:grid-cols-2 gap-10 md:gap-20 items-center"
        >
          <div className="space-y-5 md:space-y-6">
            <motion.p variants={up} className="text-[10px] uppercase tracking-[0.45em] font-medium" style={{ color: "#1CA9C9" }}>
              {(isSanityConfigured && sanityAbout?.heroTagline) || "Our Story"}
            </motion.p>
            <motion.h1 variants={up} className="font-serif leading-[1.05]" style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)", color: "rgba(255,255,255,0.92)" }}>
              {(isSanityConfigured && sanityAbout?.heroHeading) || "Heritage. Mastery. Quiet Confidence."}
            </motion.h1>
            <motion.span variants={up} className="block w-10 h-px" style={{ background: "#1CA9C9" }} />
          </div>
          <motion.p variants={up} className="text-sm sm:text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.42)" }}>
            {(isSanityConfigured && sanityAbout?.heroSubtext) || "FLX Diamonds was built around one craftsman's 47 years of accumulated knowledge, knowledge that cannot be certified, cannot be replicated, and cannot be rushed."}
          </motion.p>
        </motion.div>
      </section>

      {/* ── The Origin ── */}
      <section className="py-20 md:py-28 px-6" style={{ background: "#F4F8FC" }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10 md:gap-16 items-start">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="lg:col-span-1 space-y-6"
          >
            {sanityAbout?.craftsman?.photoUrl && (
              <motion.div variants={up} className="overflow-hidden" style={{ aspectRatio: "3/4", maxHeight: "320px" }}>
                <img
                  src={sanityAbout.craftsman.photoUrl}
                  alt={sanityAbout.craftsman?.name || "Babu Vekariya"}
                  className="w-full h-full object-cover object-top"
                />
              </motion.div>
            )}
            <motion.p variants={up} className="text-[10px] uppercase tracking-[0.4em] font-medium" style={{ color: "#1CA9C9" }}>
              The Craftsman
            </motion.p>
            <motion.h2 variants={up} className="font-serif text-4xl text-[#02274A] leading-tight">
              {sanityAbout?.craftsman?.name || "Babu Vekariya"}
            </motion.h2>
            <motion.span variants={up} className="block w-10 h-px" style={{ background: "#1CA9C9" }} />
            <motion.div variants={up} className="space-y-0">
              {craftsmanStats.map((s, i) => (
                <div key={i} className="flex justify-between items-baseline border-b py-3" style={{ borderColor: "#02274A10" }}>
                  <span className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(2,39,74,0.35)" }}>{s.label}</span>
                  <span className="text-sm text-[#02274A]">{s.value}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="lg:col-span-2 space-y-6 lg:pt-16"
          >
            {craftsmanBio.map((para, i) => (
              <motion.p key={i} variants={up} className="text-sm sm:text-base leading-relaxed" style={{ color: "rgba(2,39,74,0.5)" }}>
                {para}
              </motion.p>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── The Technique ── */}
      <section className="py-20 md:py-28 px-6" style={{ background: "#02274A" }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid lg:grid-cols-2 gap-12 md:gap-20 items-start"
          >
            <div className="space-y-6">
              <motion.p variants={up} className="text-[10px] uppercase tracking-[0.4em] font-medium" style={{ color: "#1CA9C9" }}>
                {cms?.techniqueTagline || "The Technique"}
              </motion.p>
              <motion.h2 variants={up} className="font-serif text-4xl text-white leading-tight">
                {cms?.techniqueHeading ? cms.techniqueHeading : (<>What the conversion<br /><span style={{ color: "rgba(255,255,255,0.3)" }}>actually requires.</span></>)}
              </motion.h2>
              <motion.span variants={up} className="block w-10 h-px" style={{ background: "#1CA9C9" }} />
              {techniqueIntro.map((para, i) => (
                <motion.p key={i} variants={up} className="text-sm sm:text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.42)" }}>
                  {para}
                </motion.p>
              ))}
            </div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-4 lg:pt-16"
            >
              {techniqueSteps.map((s) => (
                <motion.div key={s.step} variants={up} className="flex gap-6 items-start p-5 border" style={{ borderColor: "rgba(28,169,201,0.12)", background: "rgba(28,169,201,0.04)" }}>
                  <span className="text-xl shrink-0 font-medium tabular-nums" style={{ color: "rgba(28,169,201,0.4)" }}>{s.step}</span>
                  <div>
                    <p className="text-white text-sm font-medium tracking-wide mb-1">{s.title}</p>
                    <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.42)" }}>{s.body}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Notable Partnerships ── */}
      <section className="py-20 md:py-28 px-6" style={{ background: "#F4F8FC" }}>
        <div className="max-w-7xl mx-auto space-y-10 md:space-y-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-2xl space-y-5"
          >
            <motion.p variants={up} className="text-[10px] uppercase tracking-[0.4em] font-medium" style={{ color: "#1CA9C9" }}>
              Notable Relationships
            </motion.p>
            <motion.h2 variants={up} className="font-serif text-4xl text-[#02274A] leading-tight">
              Trusted by names that<br />
              <span style={{ color: "rgba(2,39,74,0.3)" }}>hold their own standard.</span>
            </motion.h2>
            <motion.span variants={up} className="block w-10 h-px" style={{ background: "#1CA9C9" }} />
            <motion.p variants={up} className="text-sm sm:text-base leading-relaxed" style={{ color: "rgba(2,39,74,0.45)" }}>
              Over four decades, Babu's craft earned the trust of established names in the diamond and
              jewellery trade. These are relationships built on consistent output, not on contracts alone.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid lg:grid-cols-3 gap-8"
          >
            {partnerships.map((p) => (
              <motion.div
                key={p.name}
                variants={up}
                className="p-8 space-y-4 border-t-2"
                style={{ background: "white", borderTopColor: "#1CA9C9" }}
              >
                <h3 className="font-serif text-xl text-[#02274A]">{p.name}</h3>
                <p className="text-[10px] uppercase tracking-[0.3em] font-medium" style={{ color: "#1CA9C9" }}>
                  {p.role}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(2,39,74,0.5)" }}>{p.detail}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── What We Stand For ── */}
      <section className="py-20 md:py-28 px-6" style={{ background: "#02274A" }}>
        <div className="max-w-7xl mx-auto space-y-10 md:space-y-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center space-y-4 max-w-xl mx-auto"
          >
            <motion.p variants={up} className="text-[10px] uppercase tracking-[0.4em] font-medium" style={{ color: "#1CA9C9" }}>
              Our Position
            </motion.p>
            <motion.h2 variants={up} className="font-serif text-4xl text-white leading-tight">
              How we operate.
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid lg:grid-cols-3 gap-10"
          >
            {pillars.map((p) => (
              <motion.div key={p.label} variants={up} className="space-y-4 pt-6 border-t" style={{ borderColor: "rgba(28,169,201,0.2)" }}>
                <h3 className="font-serif text-xl text-white">{p.label}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{p.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="py-20 md:py-28 px-6 text-center" style={{ background: "#F4F8FC" }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-2xl mx-auto space-y-8"
        >
          <motion.h2 variants={up} className="font-serif text-4xl text-[#02274A] leading-tight">
            {(isSanityConfigured && sanityAbout?.ctaHeading) || "Ready to begin a serious conversation?"}
          </motion.h2>
          <motion.p variants={up} className="text-base" style={{ color: "rgba(2,39,74,0.45)" }}>
            {(isSanityConfigured && sanityAbout?.ctaBody) || "All enquiries are handled directly and under strict commercial confidence."}
          </motion.p>
          <motion.div variants={up} className="flex justify-center gap-4 flex-wrap">
            <Link href="/contact">
              <Button
                className="rounded-none text-[10px] uppercase tracking-[0.25em] text-white hover:opacity-90"
                style={{ background: "#1CA9C9", height: "48px", padding: "0 2rem" }}
                data-testid="btn-about-contact"
              >
                Begin the Conversation
              </Button>
            </Link>
            <Link href="/faq">
              <Button
                variant="outline"
                className="rounded-none text-[10px] uppercase tracking-[0.25em] text-[#02274A] hover:bg-[#02274A] hover:text-white transition-colors"
                style={{ borderColor: "#02274A", height: "48px", padding: "0 2rem" }}
                data-testid="btn-about-faq"
              >
                Read FAQ
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

    </div>
    </>
  );
}
