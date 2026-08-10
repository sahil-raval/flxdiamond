/**
 * FLX Diamonds — Safe page-content seed.
 *
 * Fills the page singletons (homePage, aboutPage, investmentPage, tradePage)
 * with the default website copy using `setIfMissing`, so:
 *   - it ONLY fills fields that are currently empty,
 *   - it NEVER overwrites content you've already edited in Studio,
 *   - it NEVER touches diamonds, journal articles, services, faqs or collections.
 *
 * UPDATED: now also seeds the array/card sections that were previously only
 * hardcoded as frontend fallbacks (Home.tsx `*_FALLBACK` constants) and were
 * never pushed into Sanity: whyCards, processBadges, signalStripItems,
 * clientLogos, fourCs, services, faqs, qualifierCards.
 * Once these exist in Sanity, Home.tsx will render from Sanity instead of
 * silently falling back to hardcoded copy — meaning Studio edits will
 * finally show up on the live site for these sections.
 *
 * Run from project root:  yarn ts-node scripts/seed-pages.ts   (or: npx tsx scripts/seed-pages.ts)
 *
 * Requires a write-enabled token in .env:
 *   VITE_SANITY_PROJECT_ID, VITE_SANITY_DATASET, VITE_SANITY_API_TOKEN (or SANITY_WRITE_TOKEN)
 */
import { createClient } from "@sanity/client";
import { config as dotenv } from "dotenv";
import { resolve } from "path";

dotenv({ path: resolve(process.cwd(), ".env") });

const projectId = process.env.VITE_SANITY_PROJECT_ID;
const dataset = process.env.VITE_SANITY_DATASET || "production";
const token =
  process.env.SANITY_WRITE_TOKEN ||
  process.env.VITE_SANITY_API_TOKEN ||
  process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error("✖ Missing VITE_SANITY_PROJECT_ID or a write token in .env");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", token, useCdn: false });

/** Sanity array items need a stable `_key`. Small helper to attach one. */
function withKeys<T extends object>(items: T[], prefix: string): (T & { _key: string })[] {
  return items.map((item, i) => ({ _key: `${prefix}${i + 1}`, ...item }));
}

const homePage = {
  heroOverline: "Geelong, Victoria, Australia · Est. 1978",
  heroCta: "Source Diamonds",
  heroSecondaryCta: "IF→FL Conversion",
  qualifierTagline: "Find Your Answer",
  qualifierHeading: "What brings you here today?",
  qualifierSubtext: "Select the situation that matches yours. We'll give you the exact answer.",

  // ── Qualifier cards (buyer types) ──
  qualifierCards: withKeys(
    [
      {
        id: "upgrade",
        num: "01",
        headline: "I want to upgrade my IF stone to FL",
        subtext: "You hold an Internally Flawless stone and want to know if it can be converted to Flawless.",
        answerTitle: "We assess your stone's conversion potential, free of charge.",
        answerPoints: [
          "Send us your GIA certificate number for a free viability assessment.",
          "We map the exact inclusion against sub-0.01mm regrind tolerances.",
          "If viable, we quote cost and timeline before touching the stone.",
          "50/50 profit split on the value created — no upfront cost.",
        ],
        answerCta: "Submit a GIA Certificate",
        answerHref: "/if-to-fl",
      },
      {
        id: "buy",
        num: "02",
        headline: "I want to buy or source diamonds",
        subtext: "You're looking for GIA-certified natural or lab-grown stones at trade pricing.",
        answerTitle: "We supply direct from our own manufacturing lab.",
        answerPoints: [
          "Natural and lab-grown diamonds, any shape, any size, any spec.",
          "Trade pricing only — ABN verification required.",
          "Factory direct with no middlemen markups.",
          "Every stone GIA or IGI certified.",
        ],
        answerCta: "View Diamond Inventory",
        answerHref: "/diamonds",
      },
      {
        id: "invest",
        num: "03",
        headline: "I'm considering diamonds as an investment",
        subtext: "You want a portable, certifiable hard asset outside the share market.",
        answerTitle: "FL diamonds have historically held and appreciated in value.",
        answerPoints: [
          "FL and IF in D–F colour represent the top 1% of GIA-graded stones.",
          "Tangible, portable, and independent of any bank or financial system.",
          "We advise on stone selection, timing, and verified re-sale pathways.",
          "No salesmanship — an honest conversation about the asset case.",
        ],
        answerCta: "Book a Consultation",
        answerHref: "/if-to-fl",
      },
      {
        id: "partner",
        num: "04",
        headline: "I want a B2B partnership",
        subtext: "We operate as the quiet expert behind serious businesses, offering white-label sourcing with guaranteed discretion.",
        answerTitle: "We are the specialist behind your sourcing.",
        answerPoints: [
          "White-label sourcing: we find and verify, you present to your clients.",
          "IF→FL conversion offered on your client's existing stones.",
          "Trusted by KGK Diamond, Venus Jewellery, and Excell Overseas.",
          "All agreements under NDA by default. Discretion is not negotiable.",
        ],
        answerCta: "Discuss a Partnership",
        answerHref: "/talk-to-us",
      },
    ],
    "qc"
  ),

  manufacturingTagline: "Our Process",
  manufacturingHeading: "We make them. We don't just sell them.",
  manufacturingBody:
    "Most diamond businesses source from wholesalers. We cut and polish in our own manufacturing lab. That's why we can stand behind every stone we sell — and offer services no retailer can.",
  profitSplitHeading: "We only earn when you earn — 50/50 profit split.",
  profitSplitBody:
    "No upfront cost. No conversion fee. We calculate the IF value, the projected FL value, document it in writing, then share the profit we create together. If we can't do it, we'll tell you that before touching the stone.",
  featuredInventoryTagline: "By Application Only",
  featuredInventoryHeading: "Featured Inventory",
  featuredInventoryNote:
    "Trade pricing disclosed by secure email · ABN verification required · All stones GIA-certified",

  // ── The 4 C's ──
  fourCs: withKeys(
    [
      { n: "01", iconKey: "scale", title: "Carat", desc: "The measure of a diamond's weight — 1 carat equals 0.2 grams. FLX supplies from 0.30ct melee through 10ct+ statement stones, sourced to exact brief." },
      { n: "02", iconKey: "palette", title: "Color", desc: "Graded D (colorless) through Z. We source primarily D–J range through 47 years of trusted cutter relationships in Antwerp, Mumbai and Surat." },
      { n: "03", iconKey: "eye", title: "Clarity", desc: "FL and IF represent the pinnacle. Our proprietary IF→FL regrinding technique moves stones up this scale — documented by a new GIA Flawless certificate." },
      { n: "04", iconKey: "gem", title: "Cut", desc: "Determines brilliance, fire and scintillation. Excellent and Ideal cut grades are our benchmark — every stone assessed for maximum light performance." },
    ],
    "fourc"
  ),

  iftflTagline: "IF→FL Conversion",
  iftflBody:
    "When a GIA certificate notes specific surface characteristics on an Internally Flawless stone, there is often a viable path to Flawless grade — without leaving the same carat weight bracket.",
  iftflCtaPrimary: "How It Works",
  iftflCtaSecondary: "Submit a GIA Cert →",

  // ── Services cards ──
  services: withKeys(
    [
      { num: "01", title: "Diamond Sourcing", body: "GIA-certified natural and lab-grown stones at trade pricing. Any shape, any size, any spec. No retail. Minimum order requirements apply.", tags: ["Natural", "Lab-Grown", "Melee"], link: "/diamonds", linkText: "View Diamond Inventory" },
      { num: "02", title: "IF→FL Conversion", body: "Send any IF stone's GIA cert number. We analyse the comments, assess viability at no cost, and if the stone qualifies, execute the precision regrind. New GIA FL certificate issued.", tags: ["Assessment", "Regrinding", "New Certificate"], link: "/if-to-fl", linkText: "Learn About Conversion" },
      { num: "03", title: "B2B Advisory", body: "White-label sourcing. Investment stone advisory. Custom specification briefs. Partnership structures for retailers, jewellers, private clients, and institutional buyers.", tags: ["White-Label", "Investment", "Bespoke"], link: "/trade", linkText: "Explore Partnership" },
    ],
    "svc"
  ),

  // ── Process badges (3 tiles) ──
  processBadges: withKeys(
    [
      { label: "Factory direct", sub: "No middlemen" },
      { label: "GIA / IGI", sub: "Every stone certified" },
      { label: "Aus-wide", sub: "Insured & tracked" },
    ],
    "pb"
  ),
  processCta: "About Our Lab →",

  whyTagline: "Our Difference",
  whyHeading: "Why FLXDIAMONDS.",

  // ── Why cards ──
  whyCards: withKeys(
    [
      { iconKey: "award", title: "Expertise", body: "47 years of diamond craftsmanship, from Surat to Geelong. Babu Vekariya's precision regrinding technique is the result of a lifetime dedicated to a single discipline.", tag: "Est. 1978" },
      { iconKey: "shield", title: "Discretion", body: "Every engagement is commercially confidential by default. NDAs available on request. Your clients, your stones, and your pricing structures remain yours alone.", tag: "NDA as standard" },
      { iconKey: "sliders", title: "Custom Solutions", body: "No off-the-shelf briefs. Every sourcing mandate is built to your exact specification — shape, carat, colour, clarity, and budget. No two engagements are the same.", tag: "Built to your brief" },
      { iconKey: "cpu", title: "AI Precision", body: "Diamond grading analysis supported by AI-powered assessment tools. Human judgment refined over 47 years, combined with data-driven precision at every step.", tag: "Human + AI" },
    ],
    "why"
  ),

  // ── Signal strip (trust marquee) ──
  signalStripItems: withKeys(
    [
      { text: "47 Years of Combined Expertise" },
      { text: "GIA-Certified on Every Stone", logoUrl: "https://flxdiamond.com/gia-logo.png" },
      { text: "B2B Trade Partners Only" },
      { text: "Geelong, Victoria, Australia" },
      { text: "IF→FL Precision Conversion" },
      { text: "Natural & Lab-Grown Diamonds" },
    ],
    "sig"
  ),

  // ── Client logos ──
  clientLogos: withKeys(
    [
      { name: "KGK Diamond", sub: "Jaipur · Dubai · Hong Kong" },
      { name: "Venus Jewellery", sub: "Mumbai · Antwerp" },
      { name: "Excell Overseas", sub: "Surat · Singapore" },
    ],
    "cl"
  ),

  tradePortalTagline: "Trade Portal",
  tradePortalHeading: "Built for the trade.",
  tradePortalJewellersHeading: "Jewellers and designers",
  tradePortalJewellersBody:
    "Melee sourcing, matched parcels, and memo requests. Register with your ABN — pricing always comes back to you personally by email. No retail pricing, no margins on top of margins.",
  tradePortalHowHeading: "How we work with jewellers",
  tradePortalHowBody:
    "If a retail customer mentions they're working with a jeweller, we loop that jeweller in rather than transact directly. Our customers without a jeweller stay ours to refer — once they have one, that relationship is theirs.",

  investmentTagline: "Investment",
  investmentHeading: "Natural FL diamonds as a long-term asset.",
  investmentBody:
    "Natural diamonds — particularly FL clarity in desirable cuts — have held and appreciated in value over time. We work with buyers who want a portable, certifiable hard asset outside the share market. Same honest conversation, no hype.",
  investmentCta: "Book a Consultation →",
  investmentPoints: [
    "FL and IF in D–F colour represent the top 1% of all GIA-graded stones globally.",
    "Tangible, portable, stateless — independent of any bank or financial system.",
    "The IF→FL conversion creates a new GIA certificate with fully documented and verifiable uplift.",
    "We advise on stone selection, market timing, and verified re-sale pathways. No salesmanship.",
  ],

  noPitchHeading: "No pitch. Just a conversation.",
  noPitchBody:
    "Buying, upgrading, investing, or sourcing for trade — we're straightforward people. Start here.",

  testimonialsTagline: "From Our Partners",
  testimonialsHeading: "What the trade says.",
  testimonials: withKeys(
    [
      { quote: "Unlocked significant value from a 2.4ct IF stone we'd held for two years. The GIA FL certificate came back within the same carat bracket. Remarkable.", author: "Senior Diamond Buyer", region: "Dubai" },
      { quote: "We've used FLXDIAMONDS for white-label sourcing across three collections. Their discretion is absolute. Our clients never know the source, and the quality speaks for itself.", author: "Head of Procurement", region: "Mumbai" },
      { quote: "The assessment was free, the process was explained clearly, and the result exceeded expectations. For anyone holding IF stones, the conversation costs nothing.", author: "Private Investor", region: "Singapore" },
      { quote: "What impressed us most was the transparency — a clear yes or no on viability, no sales pressure, and a result that genuinely moved the value of our inventory.", author: "Jewellery Retailer", region: "Melbourne" },
    ],
    "t"
  ),
  testimonialsNote: "All testimonials are anonymised by request. Full references available to verified trade partners.",

  // ── Homepage inline FAQs ──
  faqs: withKeys(
    [
      { q: "Do you work with lab-grown diamonds?", a: "Yes. We supply both natural and lab-grown diamonds (CVD and HPHT) at competitive trade pricing. Lab-grown stones go through the same GIA grading process and are presented with full certification." },
      { q: "Is the IF→FL conversion process confidential?", a: "Absolutely. Every engagement is treated as commercially confidential by default. We do not disclose client details, stone specifications, or transaction structures to any third party. NDAs are available on request." },
      { q: "What carat sizes can you work with?", a: "We work primarily with stones from 0.50ct upward for IF→FL conversion. For diamond sourcing, we supply from 0.30ct melee through 10ct+ exceptional stones. Custom briefs welcome." },
      { q: "How long does the IF→FL conversion take?", a: "The free assessment typically takes 2–3 business days after receipt of the GIA certificate number. If the stone qualifies, the regrinding process itself takes 1–3 weeks depending on the stone's characteristics. A new GIA certificate is then issued, which takes an additional 2–4 weeks." },
      { q: "Do you work with retailers and jewellers directly?", a: "Yes, we operate as the quiet specialist behind serious businesses. We offer white-label sourcing and IF→FL conversion for retailers and jewellers who present our work under their own brand. Discretion is guaranteed." },
    ],
    "faq"
  ),

  closingTagline: "Precision. Trust. Excellence.",
  closingQuote: '"The finest diamonds are not found. They are understood."',
  closingCta: "Begin the Conversation →",
};

const aboutPage = {
  techniqueTagline: "The Technique",
  techniqueHeading: "What the conversion actually requires.",
  techniqueIntro: [
    "GIA grades Internally Flawless (IF) stones based on the absence of internal inclusions, but allows for minor surface blemishes such as naturals, extra facets, or surface graining. FL grade requires that neither internal nor external characteristics are present under 10× magnification by a trained grader.",
    "When the only barrier to FL is a surface-level characteristic, a precision micro-regrind of the affected facet can eliminate it entirely. The operation is measured in hundredths of a millimetre, typically under 0.01mm of material removal. Executed correctly, carat weight is preserved within GIA rounding thresholds and the stone re-grades as FL.",
  ],
  techniqueSteps: [
    { _key: "s1", step: "01", title: "Certificate Assessment", body: "The GIA report is read as a technical document, not a grade. Inclusion type, facet location, and depth are mapped against the stone." },
    { _key: "s2", step: "02", title: "Physical Examination", body: "The stone is examined under 10× loupe and microscopy. The surface characteristic is identified, measured, and assessed for removability." },
    { _key: "s3", step: "03", title: "Micro-Regrind", body: "A precision regrind of the affected facet removes the characteristic within sub-0.01mm tolerance. Polish is restored to GIA standard." },
    { _key: "s4", step: "04", title: "GIA Re-submission", body: "The stone is submitted to GIA for re-grading. A new FL certificate is issued. The conversion is documented and verifiable." },
  ],
  "craftsman.name": "Babu",
  "craftsman.beganCutting": "1978, Age 12",
  "craftsman.yearsMastery": "47 Years",
  "craftsman.primaryCraft": "IF → FL Conversion",
  "craftsman.basedIn": "Geelong, VIC",
  "craftsman.biography": [
    "Babu began cutting diamonds in 1978, aged 12, apprenticed to craftsmen in the diamond ateliers of Surat. The work in those ateliers was exacting: every error came out of the stone's value, which meant every error came out of his reputation.",
    "By his late 20s he had developed what most craftsmen in the industry never acquire: the ability to read a GIA report not as a grade, but as a map. He could identify which surface inclusions were responsible for holding a stone at IF grade, and could determine, often by examination alone, whether those characteristics sat within reach of a micro-regrind.",
    "The IF→FL conversion is not taught formally. It is developed over a career of failed attempts, successful recoveries, and accumulated judgment. Of the craftsmen who attempt it with regularity, only a handful can execute consistently at commercial scale without meaningful carat loss. Babu is among them.",
  ],
};

const investmentPage = {
  assetClassTagline: "The Asset Case",
  assetClassHeading: "Why FL diamonds hold their value.",
  ctaHeading: "Ready to explore diamond as an asset?",
  ctaBody:
    "We work with a limited number of private buyers and family offices. All enquiries are handled directly and under strict commercial confidence.",
};

const tradePage = {
  partnerTypesHeading: "Who We Work With",
  accessHeading: "What Trade Partners Access",
  jewellersHeading: "IF → FL Conversion for Trade Partners",
  jewellersBody:
    "The FL grade carries a material premium over IF that justifies conversion cost many times over at commercial scale. We assess stones, execute precision micro-regrind, and manage the GIA re-submission — delivering a certified Flawless diamond.",
  ctaHeading: "Speak with the team directly.",
};

const servicesPage = {
  heroTagline: "What We Do",
  heroHeading: "Four services. One standard.",
  heroSubtext:
    "Every service we offer is built around a single principle: the buyer should know exactly what they are getting before they commit. We describe our work with precision because imprecision in this industry costs people money.",
  closingTagline: "All Enquiries",
  closingHeading: "We handle all enquiries directly and under strict commercial confidence.",
  closingBody: "There is no sales process, only an honest conversation about whether we are the right fit.",
};

const faqPage = {
  heroTagline: "Trade Partner FAQ",
  heroHeading: "Common Questions.",
  heroSubtext:
    "These are the questions serious buyers ask before they commit to an engagement. We have answered them directly so you can qualify us without needing a call first.",
  closingTagline: "Ready to proceed?",
  closingHeading: "If your question is not here, ask it directly.",
  closingBody:
    "All enquiries are handled personally and under commercial confidence. There is no sales team, just a direct conversation with people who know the subject.",
};

const jewelleryPage = {
  heroHeading: "High Jewellery Collections",
  heroSubtext:
    "Exclusive ready-to-wear pieces and bespoke commissions for private clients and retail partners. Crafted to exacting standards, featuring the finest GIA certified stones from our inventory.",
};

const journalPage = {
  heroTagline: "Knowledge & Insight",
  heroHeading: "Journal & Insights.",
  heroSubtext:
    "Perspectives on diamond grading, investment-grade stones, and the IF→FL conversion process, written for trade professionals who already understand the fundamentals.",
};

const siteSettingsFooter = {
  footerTagline: "Every FL certificate begins with a practiced eye and 47 years of accumulated judgment.",
  footerNote:
    "B2B diamond sourcing and precision IF→FL conversion. Serving diamond traders, jewellers, and investors globally from Geelong, Victoria, Australia.",
};

async function run() {
  console.log("Seeding page copy (setIfMissing — existing content is preserved)…");
  await client.patch("homePage").setIfMissing(homePage).commit();
  console.log("  ✓ homePage (incl. whyCards, processBadges, signalStripItems, clientLogos, fourCs, services, faqs, qualifierCards)");
  await client.patch("aboutPage").setIfMissing(aboutPage).commit();
  console.log("  ✓ aboutPage");
  await client.patch("investmentPage").setIfMissing(investmentPage).commit();
  console.log("  ✓ investmentPage");
  await client.patch("tradePage").setIfMissing(tradePage).commit();
  console.log("  ✓ tradePage");
  await client.createIfNotExists({ _id: "servicesPage", _type: "servicesPage", ...servicesPage });
  console.log("  ✓ servicesPage");
  await client.createIfNotExists({ _id: "faqPage", _type: "faqPage", ...faqPage });
  console.log("  ✓ faqPage");
  await client.createIfNotExists({ _id: "jewelleryPage", _type: "jewelleryPage", ...jewelleryPage });
  console.log("  ✓ jewelleryPage");
  await client.createIfNotExists({ _id: "journalPage", _type: "journalPage", ...journalPage });
  console.log("  ✓ journalPage");
  await client.patch("siteSettings").setIfMissing(siteSettingsFooter).commit();
  console.log("  ✓ siteSettings (footer)");
  console.log("Done. Re-run any time — setIfMissing never overwrites content you've already edited in Studio.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});