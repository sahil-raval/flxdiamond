import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASE } from "@/lib/motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useSanityQuery } from "@/lib/useSanityData";
import { isSanityConfigured } from "@/lib/sanity";
import { FAQ_CATEGORIES_QUERY, FAQ_PAGE_QUERY } from "@/lib/sanity-queries";
import SeoHead from "@/components/SeoHead";

const up = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const FAQ_CATEGORIES = [
  {
    id: "process",
    label: "The Conversion Process",
    shortLabel: "Conversion",
    faqs: [
      {
        q: "What does the IF→FL conversion actually involve?",
        a: "The conversion is a precision micro-regrind of one or more facets that carry the surface-level characteristic preventing FL grade. GIA grades a stone as IF when there are no internal inclusions visible under 10× magnification, but allows minor surface blemishes. When a stone is held at IF by a surface feature (such as a natural, extra facet, or surface graining) and that feature is on or near an accessible facet, it can be removed by a controlled regrind. Material removal is typically under 0.01mm. The stone is then re-submitted to GIA for re-grading.",
      },
      {
        q: "How do you assess whether a stone is a candidate for conversion?",
        a: "Assessment starts with the GIA certificate. We read the comments and characteristics fields to identify what is holding the stone at IF grade. We then examine the stone physically under magnification to confirm the location, depth, and accessibility of the surface feature. Not every IF stone is convertible. If the characteristic is too deep, in an inaccessible location, or removal would cause meaningful carat loss, we will tell you clearly and decline to proceed.",
      },
      {
        q: "Does conversion always succeed?",
        a: "We do not proceed with conversions we are not confident in. If we assess a stone and determine the risk of failure from an inaccessible feature, unexpected depth, or problematic facet geometry, we will decline and explain why. If we do proceed, the success rate is extremely high. We have not had a GIA re-submission rejected on a stone we assessed as convertible.",
      },
      {
        q: "What happens to the GIA certificate after conversion?",
        a: "The existing certificate is superseded by the re-submission. GIA issues a new report number and a new FL certificate. The original IF certificate is no longer current and should not be used to represent the stone. We provide documentation of the conversion process that you can retain alongside the new certificate.",
      },
      {
        q: "Can any shape of diamond be converted?",
        a: "Round brilliants are the most accessible because the facet geometry is standardised and predictable. Most other standard cuts (ovals, cushions, pears, emeralds) can also be assessed, but the complexity varies. We assess each stone individually. Unusual or antique cuts may require more detailed evaluation before we can give a conversion assessment.",
      },
    ],
  },
  {
    id: "grading",
    label: "GIA Re-Certification",
    shortLabel: "GIA",
    faqs: [
      {
        q: "Who submits the stone to GIA for re-grading?",
        a: "We handle the GIA submission as part of our service. The stone does not leave our control between regrind and submission. Once the new FL certificate is issued, the stone and the new report are returned to you together.",
      },
      {
        q: "What if GIA grades the stone as IF again rather than FL after conversion?",
        a: "This outcome indicates that the regrind did not fully remove the characteristic, or that a different characteristic was identified during re-examination. In the rare event this occurs, we will re-examine the stone and discuss options with you before re-submitting or returning the stone. We do not charge for a second regrind attempt if the initial conversion was our assessment error rather than undisclosed information about the stone.",
      },
      {
        q: "Does GIA document the conversion on the new certificate?",
        a: "No. GIA grades the stone as presented. The new FL certificate reflects the stone's current condition and grade. It does not reference the prior IF grade or the conversion. The conversion history is documented by us and provided to you separately.",
      },
      {
        q: "What colour and clarity grades are maintained through conversion?",
        a: "Conversion affects clarity grade only. Colour grade is not impacted by a facet regrind. The FL re-grade applies only to the clarity characteristic. All other attributes, including colour, cut, carat weight (within rounding threshold), and fluorescence, are re-examined and graded fresh by GIA on re-submission.",
      },
    ],
  },
  {
    id: "minimums",
    label: "Minimums & Pricing",
    shortLabel: "Pricing",
    faqs: [
      {
        q: "What is the minimum carat weight for conversion?",
        a: "We assess stones from 0.50ct upward. Below this threshold, the economics of conversion (assessment, regrind, GIA submission, and handling) do not justify the process for most buyers. We will consider smaller stones only in the context of a parcel or ongoing trade relationship.",
      },
      {
        q: "Do you publish pricing for the conversion service?",
        a: "No. Conversion pricing is determined per stone based on complexity, carat weight, and the nature of the surface characteristic being removed. We provide a written assessment and pricing quotation before any work proceeds. There is no obligation to proceed once you have received the quotation.",
      },
      {
        q: "Is there a minimum order quantity for diamond supply?",
        a: "There is no minimum number of stones per enquiry. We supply individual stones as well as parcels. For ongoing supply relationships, we typically work with partners who engage at least quarterly, though this is a practical preference rather than a formal minimum.",
      },
      {
        q: "Do you offer trade pricing?",
        a: "Pricing for trade partners reflects their relationship with us rather than a published discount schedule. Partners with established track records and consistent volume will typically access inventory at prices that reflect that relationship. This is discussed individually and is not formularised.",
      },
    ],
  },
  {
    id: "terms",
    label: "Payment & Terms",
    shortLabel: "Payment",
    faqs: [
      {
        q: "What payment terms do you offer?",
        a: "Terms are agreed individually based on the nature of the engagement and the relationship. For new clients, we typically require a deposit before work commences and the balance before the stone is returned. For established trade partners, we can discuss credit terms appropriate to the relationship and volume.",
      },
      {
        q: "In which currency do you invoice?",
        a: "We invoice in Australian Dollars (AUD) as the default. Arrangements in USD are possible for established international trade partners. We do not invoice in cryptocurrencies or other non-fiat instruments.",
      },
      {
        q: "Who is responsible for the stone during transit and conversion?",
        a: "We ask clients to use insured, traceable shipping methods for stone delivery. Once the stone is in our possession, it is covered under our care, custody, and control. We can advise on appropriate transit arrangements for stones being sent internationally. Insurance against loss or damage during the conversion process is discussed and documented before work commences.",
      },
      {
        q: "What documentation do you provide at completion?",
        a: "At completion of a conversion engagement, you receive: the stone with the new GIA FL certificate, a written record of the conversion assessment, documentation of the process performed, and our invoice. For supply purchases, you receive the stone, the original GIA certificate, and an invoice with provenance documentation.",
      },
    ],
  },
  {
    id: "confidentiality",
    label: "Confidentiality",
    shortLabel: "Discretion",
    faqs: [
      {
        q: "Do you discuss client relationships publicly?",
        a: "No. We do not identify clients publicly, discuss specific transactions, or share any information about stones we have handled or assessed outside of the engagement. This extends to informal conversations. The diamond trade operates on discretion, and we treat that as a non-negotiable standard.",
      },
      {
        q: "Do you require an NDA before discussing a potential engagement?",
        a: "For general enquiries, we do not require a formal NDA. We operate under implied confidentiality. For trade partnerships and advisory engagements where sensitive sourcing strategy or pricing information is involved, we will propose a mutual NDA as a matter of course.",
      },
      {
        q: "Will you recommend us to other buyers?",
        a: "We do not discuss one client's engagement with another. We may, with permission, provide a reference contact for buyers seeking third-party validation, but only with the explicit consent of the reference party, and we tell you it is happening.",
      },
      {
        q: "How do you handle enquiries that do not proceed to an engagement?",
        a: "All information shared during an assessment or commercial discussion is treated as confidential regardless of whether the engagement proceeds. We do not retain or use information shared in confidence for any purpose other than the evaluation we were asked to perform.",
      },
    ],
  },
];

function FAQItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b" style={{ borderColor: "rgba(2,39,74,0.08)" }}>
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
        data-testid={`faq-toggle-${q.slice(0, 20).replace(/\s+/g, "-").toLowerCase()}`}
      >
        <span className="font-serif text-sm md:text-base text-[#02274A] leading-snug group-hover:text-[#1CA9C9] transition-colors" style={{ flex: 1 }}>
          {q}
        </span>
        <span className="shrink-0 mt-1" style={{ color: "#1CA9C9" }}>
          {isOpen ? <Minus size={15} /> : <Plus size={15} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1, transition: { duration: 0.35, ease: EASE } }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.25 } }}
            style={{ overflow: "hidden" }}
          >
            <p className="pb-5 text-sm leading-relaxed" style={{ color: "rgba(2,39,74,0.5)" }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface SanityFAQCategory {
  _id: string;
  label: string;
  shortLabel: string;
  order: number;
  faqs: { q: string; a: string }[];
}

export default function FAQ() {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("process");

  const { data: sanityCategories } = useSanityQuery<SanityFAQCategory[]>(["faq-categories"], FAQ_CATEGORIES_QUERY);
  const { data: fp } = useSanityQuery<{ heroTagline?: string; heroHeading?: string; heroSubtext?: string; closingTagline?: string; closingHeading?: string; closingBody?: string }>(["faq-page"], FAQ_PAGE_QUERY);
  const fpc = isSanityConfigured ? fp : null;

  const categories = isSanityConfigured && sanityCategories && sanityCategories.length > 0
    ? sanityCategories.map((c) => ({
        id: c._id,
        label: c.label,
        shortLabel: c.shortLabel,
        faqs: c.faqs,
      }))
    : FAQ_CATEGORIES;

  const resolvedCategory = categories.find(c => c.id === activeCategory)
    ? activeCategory
    : (categories[0]?.id ?? "process");

  const toggle = (key: string) => setOpenItem(prev => prev === key ? null : key);

  return (
    <>
      <SeoHead
        metaTitle="FAQ | FLX Diamonds — IF→FL Conversion, GIA Certification & Trade Questions"
        metaDescription="Common questions about the IF→FL conversion process, GIA re-certification, diamond pricing, and trade access. Answered by FLX Diamonds specialists."
        metaKeywords="IF FL conversion FAQ, GIA recertification questions, diamond trade FAQ, FLX Diamonds questions"
        structuredDataType="FAQPage"
        siteName="FLX Diamonds"
      />
    <div className="" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Hero ── */}
      <section className="pt-28 md:pt-40 pb-20 md:pb-28 px-8 md:px-14 lg:px-20" style={{ background: "#02274A" }}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-end"
        >
          <div className="space-y-5 md:space-y-6">
            <motion.p variants={up} className="text-[10px] uppercase tracking-[0.45em] font-medium" style={{ color: "#1CA9C9" }}>
              {fpc?.heroTagline || "Trade Partner FAQ"}
            </motion.p>
            <motion.h1 variants={up} className="font-serif text-4xl md:text-6xl lg:text-7xl text-white leading-tight">
              {fpc?.heroHeading ? fpc.heroHeading : (<>Common<br /><span style={{ color: "rgba(255,255,255,0.3)" }}>Questions.</span></>)}
            </motion.h1>
            <motion.span variants={up} className="block w-10 h-px" style={{ background: "#1CA9C9" }} />
          </div>
          <motion.p variants={up} className="text-white/40 text-sm md:text-base leading-relaxed md:pb-3">
            {fpc?.heroSubtext || "These are the questions serious buyers ask before they commit to an engagement. We have answered them directly so you can qualify us without needing a call first."}
          </motion.p>
        </motion.div>
      </section>

      {/* ── Category tabs — scrollable on mobile ── */}
      <div
        className="sticky top-20 z-30 border-b"
        style={{
          background: "rgba(2,39,74,0.97)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderColor: "rgba(28,169,201,0.1)",
        }}
      >
        <div className="overflow-x-auto scrollbar-hide">
          <div className="max-w-7xl mx-auto px-6 py-3 flex gap-1 min-w-max md:min-w-0 md:flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                data-testid={`faq-cat-${cat.id}`}
                className="text-[9px] uppercase tracking-[0.28em] px-3 md:px-4 py-2 transition-all whitespace-nowrap"
                style={{
                  color: activeCategory === cat.id ? "#1CA9C9" : "rgba(255,255,255,0.35)",
                  borderBottom: activeCategory === cat.id ? "1px solid #1CA9C9" : "1px solid transparent",
                }}
              >
                {/* Shorter label on mobile */}
                <span className="md:hidden">{cat.shortLabel}</span>
                <span className="hidden md:inline">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ content ── */}
      <section className="py-20 md:py-28 px-6" style={{ background: "#F4F8FC" }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-10 lg:gap-16">

          {/* Sidebar — hidden on mobile/tablet, visible on lg+ */}
          <div className="hidden lg:block space-y-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="w-full text-left text-[10px] uppercase tracking-[0.3em] py-3 border-l-2 pl-4 transition-all"
                style={{
                  borderColor: activeCategory === cat.id ? "#1CA9C9" : "transparent",
                  color: activeCategory === cat.id ? "#1CA9C9" : "rgba(2,39,74,0.35)",
                }}
              >
                {cat.label}
              </button>
            ))}

            <div className="pt-10 space-y-3 border-t" style={{ borderColor: "rgba(2,39,74,0.08)" }}>
              <p className="text-[9px] uppercase tracking-widest" style={{ color: "rgba(2,39,74,0.3)" }}>Still have questions?</p>
              <Link href="/contact">
                <Button
                  className="w-full rounded-none text-[10px] uppercase tracking-[0.2em] text-white hover:opacity-90"
                  style={{ background: "#1CA9C9", height: "42px" }}
                  data-testid="btn-faq-sidebar-contact"
                >
                  Ask Directly
                </Button>
              </Link>
            </div>
          </div>

          {/* FAQ items */}
          <div className="lg:col-span-3">
            {categories.map((cat) =>
              cat.id === resolvedCategory ? (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.35 } }}
                  className="space-y-0"
                >
                  <p className="text-[10px] uppercase tracking-[0.4em] font-medium mb-6 md:mb-8" style={{ color: "#1CA9C9" }}>
                    {cat.label}
                  </p>
                  {cat.faqs.map((faq) => {
                    const key = `${cat.id}-${faq.q}`;
                    return (
                      <FAQItem
                        key={key}
                        q={faq.q}
                        a={faq.a}
                        isOpen={openItem === key}
                        onToggle={() => toggle(key)}
                      />
                    );
                  })}

                  {/* Mobile CTA — shown below FAQ list on small screens */}
                  <div className="pt-10 lg:hidden">
                    <Link href="/contact" className="block">
                      <Button
                        className="w-full rounded-none text-[10px] uppercase tracking-[0.2em] text-white hover:opacity-90"
                        style={{ background: "#1CA9C9", height: "48px", padding: "0 2rem" }}
                        data-testid="btn-faq-mobile-contact"
                      >
                        Ask Directly
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ) : null
            )}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="py-20 md:py-28 px-6" style={{ background: "#02274A" }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center"
        >
          <div className="space-y-4">
            <motion.p variants={up} className="text-[10px] uppercase tracking-[0.4em]" style={{ color: "#1CA9C9" }}>
              {fpc?.closingTagline || "Ready to proceed?"}
            </motion.p>
            <motion.h2 variants={up} className="font-serif text-3xl md:text-4xl text-white leading-tight">
              {fpc?.closingHeading ? fpc.closingHeading : (<>If your question is not here,<br /><span style={{ color: "rgba(255,255,255,0.3)" }}>ask it directly.</span></>)}
            </motion.h2>
            <motion.p variants={up} className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
              {fpc?.closingBody || "All enquiries are handled personally and under commercial confidence. There is no sales team, just a direct conversation with people who know the subject."}
            </motion.p>
          </div>
          <motion.div variants={up} className="flex flex-col sm:flex-row gap-4">
            <Link href="/contact">
              <Button
                className="w-full sm:w-auto rounded-none text-[10px] uppercase tracking-[0.25em] text-white hover:opacity-90"
                style={{ background: "#1CA9C9", height: "48px", padding: "0 2rem" }}
                data-testid="btn-faq-contact"
              >
                Contact Us
              </Button>
            </Link>
            <Link href="/services">
              <Button
                variant="outline"
                className="w-full sm:w-auto rounded-none text-[10px] uppercase tracking-[0.25em] hover:text-[#02274A] transition-colors"
                style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.55)", height: "48px", padding: "0 2rem" }}
                data-testid="btn-faq-services"
              >
                View Services
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

    </div>
    </>
  );
}
