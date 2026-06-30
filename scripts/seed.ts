/**
 * FLX Diamonds — Sanity Seed Script
 *
 * Pushes all initial site content (page copy, FAQs, services, jewellery,
 * journal articles, conversion case studies, sample diamonds, site settings)
 * to your Sanity project so editors can manage everything from /studio.
 *
 * Run from project root:
 *   yarn seed
 *
 * Required env vars (already set in /app/frontend/.env):
 *   VITE_SANITY_PROJECT_ID
 *   VITE_SANITY_DATASET
 *   SANITY_WRITE_TOKEN   (or VITE_SANITY_API_TOKEN — write-enabled)
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

if (!projectId) {
  console.error("✖ Missing VITE_SANITY_PROJECT_ID in .env");
  process.exit(1);
}
if (!token) {
  console.error("✖ Missing Sanity write token (SANITY_WRITE_TOKEN / VITE_SANITY_API_TOKEN)");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

/* ──────────────────────────────────────────────────────── helpers */
async function upsert(_id: string, _type: string, doc: Record<string, unknown>) {
  const full = { _id, _type, ...doc };
  await client.createOrReplace(full);
  console.log(`  ✓ ${_type}/${_id}`);
}

/* ──────────────────────────────────────────────────────── content */

// ── SITE SETTINGS ────────────────────────────────────────
const siteSettings = {
  siteName: "FLX Diamonds",
  tagline: "Precision Sourcing & IF→FL Conversion",
  seoDescription:
    "FLX Diamonds specialises in GIA-certified diamond sourcing and precision IF→FL conversion. Trade-only. Based in Geelong, Australia.",
  email: "info@flxdiamond.com",
  phones: [
    { _key: "ph-au", label: "Australia", value: "0474 817 548" },
    { _key: "ph-in", label: "India", value: "+91 99982 17496" },
  ],
  address: "Geelong, VIC, Australia",
  googleMapsUrl: "https://maps.google.com/?q=Geelong+VIC+Australia",
};

// ── HOME PAGE ────────────────────────────────────────────
const homePage = {
  seo: {
    title: "FLX Diamonds — Precision Sourcing & IF→FL Conversion",
    description:
      "B2B diamond sourcing & IF→FL precision conversion. GIA-certified natural and lab-grown diamonds. Geelong, Australia.",
  },
  heroHeading: "The Stone Begins Here.",
  heroSubtext:
    "B2B diamond sourcing & IF→FL precision conversion. Natural, lab-grown, and custom — every stone GIA-certified.",
  heroCta: "Source Diamonds",
  heroSecondaryCta: "IF→FL Conversion",
  marqueeItems: [
    "GIA Certified",
    "IF → FL Conversion",
    "Natural & Lab Grown",
    "Trade Only",
    "47 Years Mastery",
    "Geelong, Australia",
    "Discreet & Confidential",
    "Precision Regrinding",
  ],
  featuredDiamondsSectionHeading: "Featured Inventory",
  featuredDiamondsSectionTagline: "By Application Only",
  featuredDiamondsSubtext:
    "A curated selection of GIA-certified natural and lab-grown diamonds. All stones are available for immediate enquiry.",
  faqs: [
    {
      _key: "faq-1",
      q: "Do you work with lab-grown diamonds?",
      a: "Yes. We supply both natural and lab-grown diamonds (CVD and HPHT) at competitive trade pricing. Lab-grown stones go through the same GIA grading process and are presented with full certification.",
    },
    {
      _key: "faq-2",
      q: "Is the IF→FL conversion process confidential?",
      a: "Absolutely. Every engagement is treated as commercially confidential by default. We do not disclose client details, stone specifications, or transaction structures to any third party. NDAs are available on request.",
    },
    {
      _key: "faq-3",
      q: "What carat sizes can you work with?",
      a: "We work primarily with stones from 0.50ct upward for IF→FL conversion. For diamond sourcing, we supply from 0.30ct melee through 10ct+ exceptional stones. Custom briefs welcome.",
    },
    {
      _key: "faq-4",
      q: "How long does the IF→FL conversion take?",
      a: "The free assessment typically takes 2–3 business days after receipt of the GIA certificate number. If the stone qualifies, the regrinding process itself takes 1–3 weeks depending on the stone's characteristics. A new GIA certificate is then issued, which takes an additional 2–4 weeks.",
    },
    {
      _key: "faq-5",
      q: "Do you work with retailers and jewellers directly?",
      a: "Yes, we operate as the quiet specialist behind serious businesses. We offer white-label sourcing and IF→FL conversion for retailers and jewellers who present our work under their own brand. Discretion is guaranteed.",
    },
  ],
  ctaSectionHeading: "Enquiries handled with discretion.",
  ctaSectionBody:
    "We work exclusively with established trade partners — jewellers, retailers, and serious investors. All enquiries are treated as commercially confidential.",
};

// ── ABOUT PAGE ───────────────────────────────────────────
const aboutPage = {
  seo: {
    title: "About FLX Diamonds — 47 Years of Craftsmanship",
    description:
      "Built around master craftsman Babu Vekariya's 47 years of accumulated diamond expertise. Geelong, Australia.",
  },
  heroTagline: "Our Story",
  heroHeading: "Heritage. Mastery. Quiet Confidence.",
  heroSubtext:
    "FLX Diamonds was built around one craftsman's 47 years of accumulated knowledge, knowledge that cannot be certified, cannot be replicated, and cannot be rushed.",
  craftsman: {
    name: "Babu Vekariya",
    beganCutting: "1978, Age 12",
    yearsMastery: "47 Years",
    primaryCraft: "IF → FL Conversion",
    basedIn: "Geelong, VIC",
    biography: [
      "Babu began cutting diamonds in 1978, aged 12, apprenticed to craftsmen in the diamond ateliers of Surat. The work in those ateliers was exacting: every error came out of the stone's value, which meant every error came out of his reputation.",
      "By his late 20s he had developed what most craftsmen in the industry never acquire: the ability to read a GIA report not as a grade, but as a map. He could identify which surface inclusions were responsible for holding a stone at IF grade, and could determine, often by examination alone, whether those characteristics sat within reach of a micro-regrind.",
      "The IF→FL conversion is not taught formally. It is developed over a career of failed attempts, successful recoveries, and accumulated judgment. Of the craftsmen who attempt it with regularity, only a handful can execute consistently at commercial scale without meaningful carat loss. Babu is among them.",
    ],
  },
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
  partnerships: [
    { _key: "p1", name: "KGK Diamond", role: "Sourcing & Conversion Partner", detail: "Supplied precision-cut FL diamonds and specialised regrinding services across multiple production seasons." },
    { _key: "p2", name: "Venus Jewellery", role: "Technical Evaluation Partner", detail: "Provided expert stone assessment and IF→FL conversion for high-value finished jewellery projects." },
    { _key: "p3", name: "Excell Overseas", role: "Long-term Trade Partner", detail: "Ongoing supply relationship spanning loose FL diamonds and GIA-verified conversion parcels." },
  ],
  pillars: [
    { _key: "pl1", label: "Technical Depth", body: "We do not grade by eye alone. Each stone is assessed against its GIA report with full understanding of what the inclusions are, where they sit, and whether removal is viable without carat loss beyond threshold." },
    { _key: "pl2", label: "Commercial Discretion", body: "Every enquiry is handled under strict commercial confidence. We do not discuss client relationships publicly, and we expect the same standard from the partners we choose to work with." },
    { _key: "pl3", label: "Geelong, Australia", body: "Operating from Geelong, Victoria, we serve trade partners globally while maintaining the time-zone availability and regulatory environment of a mature, stable business jurisdiction." },
  ],
  ctaHeading: "Ready to begin a serious conversation?",
  ctaBody: "All enquiries are handled directly and under strict commercial confidence.",
};

// ── INVESTMENT PAGE ──────────────────────────────────────
const investmentPage = {
  seo: {
    title: "Investment-Grade Diamonds — IF→FL Conversion | FLX Diamonds",
    description:
      "GIA Flawless and Internally Flawless diamonds with documented value uplift through precision IF→FL conversion.",
  },
  heroTagline: "IF → FL Conversion",
  heroHeading: "The rarest clarity grade. Achieved, not discovered.",
  heroSubtext:
    "GIA Flawless diamonds are not found — they are made. Our precision IF→FL conversion service transforms internally flawless stones into the most valuable clarity grade GIA certifies.",
  pillars: [
    { _key: "p1", title: "Documented Uplift", body: "Each conversion ships with the original IF certificate and the new FL certificate from GIA — verifiable, permanent, and globally recognised." },
    { _key: "p2", title: "Carat Preserved", body: "Operations measured in hundredths of a millimetre keep carat weight within GIA rounding thresholds. No meaningful weight loss, no compromise on shape." },
    { _key: "p3", title: "Trade-Only Pricing", body: "We work exclusively with the trade. Pricing on application, terms structured for serious volume." },
  ],
  processTagline: "The Process",
  processHeading: "From IF to Flawless.",
  processSteps: [
    { _key: "p1", n: "01", title: "Submit GIA Cert #", body: "Send the GIA certificate number for the IF stone you are considering for conversion.", tag: "No obligation" },
    { _key: "p2", n: "02", title: "Comment Read", body: "We interpret the report comments to identify surface characteristics and assess removability.", tag: "24-hour read" },
    { _key: "p3", n: "?", title: "Qualifies?", body: "Yes/no decision — communicated in writing with the rationale. About 15–20% of IF stones qualify.", tag: "Honest answer" },
    { _key: "p4", n: "03", title: "Precision Regrind", body: "Micro-regrind under 0.01mm executed by Babu Vekariya at his Geelong workshop.", tag: "1–3 weeks" },
    { _key: "p5", n: "FL", title: "New GIA FL Cert", body: "The stone is submitted to GIA for re-grading. A new FL certificate is issued and shipped with the stone.", tag: "2–4 weeks GIA" },
  ],
  casestudiesTagline: "Verified Results",
  casestudiesHeading: "Real stones. Real results.",
  casestudiesSubtext:
    "Each result below represents a completed conversion — IF to FL — with verified GIA certificates at both stages. Carat weight and proportions are unchanged.",
  ctaHeading: "Is your IF stone a candidate?",
  ctaBody:
    "Send us the GIA certificate number. We will assess conversion viability and provide a written report — at no cost and with no obligation to proceed.",
};

// ── TRADE PAGE ───────────────────────────────────────────
const tradePage = {
  seo: {
    title: "Trade Partners — Apply for a Trade Account | FLX Diamonds",
    description:
      "Trade-only diamond sourcing and IF→FL conversion. Apply for a trade account to access trade pricing and full inventory.",
  },
  heroTagline: "Trade Partners",
  heroHeading: "For the trade only.",
  heroSubtext:
    "We work exclusively with established diamond and jewellery trade professionals. Apply for a trade account to access our full inventory, trade pricing, and sourcing services.",
  whoQualifies: [
    { _key: "wq1", title: "Jewellery Retailers", body: "Independent and group retailers with an established business, ABN/equivalent, and demonstrated trading history." },
    { _key: "wq2", title: "Jewellery Designers & Manufacturers", body: "Bespoke designers and finished-piece manufacturers sourcing certified loose stones for client briefs." },
    { _key: "wq3", title: "Diamond Wholesalers", body: "Wholesalers and trade buyers acquiring stones for redistribution or onward grading work." },
    { _key: "wq4", title: "Private Investors", body: "Sophisticated investors building a tangible diamond portfolio, by referral or verified introduction." },
  ],
  whatWeOffer: [
    { _key: "wo1", title: "Trade Pricing", body: "Discounted pricing on our full inventory of GIA-certified natural and lab-grown stones." },
    { _key: "wo2", title: "Custom Sourcing", body: "We source to brief through our network of cutters in Antwerp, Mumbai, and Surat — 47 years of relationships." },
    { _key: "wo3", title: "IF→FL Conversion", body: "Precision IF→FL conversion service offered on your client's stones under your brand if required." },
    { _key: "wo4", title: "White-Label Service", body: "Operate as the quiet specialist behind your offering. Discretion guaranteed; NDAs available." },
  ],
  processTagline: "The Process",
  processHeading: "How to become a trade partner.",
  processSteps: [
    { _key: "ps1", step: "01", title: "Submit Application", body: "Complete the trade application form below with business details and references." },
    { _key: "ps2", step: "02", title: "Verification", body: "We verify business credentials and existing trade relationships within 2 business days." },
    { _key: "ps3", step: "03", title: "Activation", body: "Trade account activated. Pricing, full inventory access, and sourcing channels opened to you." },
  ],
  formHeading: "Apply for a trade account.",
  formSubtext: "All applications are reviewed personally. We will respond within 2 business days.",
};

// ── CONTACT PAGE ─────────────────────────────────────────
const contactPage = {
  seo: {
    title: "Contact FLX Diamonds — Begin the Conversation",
    description:
      "Begin a confidential conversation about diamond sourcing or IF→FL conversion. Geelong, Australia.",
  },
  heroTagline: "Get in Touch",
  heroHeading: "Begin the conversation.",
  heroSubtext:
    "All enquiries are handled personally and under strict commercial confidence. There is no sales team — just a direct conversation with people who know the subject.",
  stats: [
    { _key: "s1", value: "47", label: "Years Experience" },
    { _key: "s2", value: "100%", label: "GIA-Certified Stones" },
    { _key: "s3", value: "24h", label: "Avg Response Time" },
    { _key: "s4", value: "NDA", label: "Available on Request" },
  ],
  enquiryTypes: [
    "Source a Diamond",
    "IF→FL Conversion Assessment",
    "Trade Account Application",
    "Investment Advisory",
    "Other",
  ],
  formConfirmationHeading: "Enquiry received.",
  formConfirmationBody:
    "Thank you for reaching out. We will review your message and respond within 1–2 business days under strict commercial confidence.",
};

// ── FAQ CATEGORIES ───────────────────────────────────────
const faqCategories = [
  {
    _id: "faq-cat-conversion",
    label: "IF → FL Conversion",
    shortLabel: "Conversion",
    order: 1,
    faqs: [
      { _key: "f1", q: "What is IF→FL conversion?", a: "It is the process of taking an Internally Flawless (IF) diamond and elevating it to Flawless (FL) grade by precision-regrinding the surface characteristics that prevented it from achieving FL status on its original GIA grading." },
      { _key: "f2", q: "How long does an assessment take?", a: "We typically return a yes/no verdict within 24 hours of receiving the GIA certificate number, with a written rationale either way." },
      { _key: "f3", q: "What percentage of IF stones qualify?", a: "Roughly 15–20% of IF stones present the right surface profile for safe conversion to FL. Most do not — and we will tell you immediately." },
      { _key: "f4", q: "Is carat weight preserved?", a: "Yes. The micro-regrind operates under 0.01mm. In every successful conversion to date, the stone has re-graded within the same GIA carat-weight rounding bracket." },
    ],
  },
  {
    _id: "faq-cat-sourcing",
    label: "Diamond Sourcing",
    shortLabel: "Sourcing",
    order: 2,
    faqs: [
      { _key: "f1", q: "Do you supply both natural and lab-grown?", a: "Yes. Both at competitive trade pricing, both with full GIA certification." },
      { _key: "f2", q: "What sizes can you source?", a: "Anything from 0.30ct melee through 10ct+ exceptional stones. Custom briefs welcome." },
      { _key: "f3", q: "Where do your stones come from?", a: "Sourced through 47 years of trusted relationships with cutters in Antwerp, Mumbai, and Surat." },
    ],
  },
  {
    _id: "faq-cat-trade",
    label: "Trade & Partnerships",
    shortLabel: "Trade",
    order: 3,
    faqs: [
      { _key: "f1", q: "Are you trade-only?", a: "Yes. We do not sell to retail consumers. Applications must come from established trade professionals." },
      { _key: "f2", q: "Can you white-label?", a: "Yes. We work as the quiet specialist behind serious businesses — our work is presented under your brand. NDAs available." },
      { _key: "f3", q: "How do I apply for a trade account?", a: "Use the application form on the /trade page. Decisions returned within 2 business days." },
    ],
  },
  {
    _id: "faq-cat-shipping",
    label: "Shipping & Insurance",
    shortLabel: "Shipping",
    order: 4,
    faqs: [
      { _key: "f1", q: "How are stones shipped?", a: "Insured courier with end-to-end tracking. All stones are insured at appraised value during transit." },
      { _key: "f2", q: "International shipping?", a: "Yes. We ship internationally to verified trade partners. Customs documentation handled in full." },
    ],
  },
];

// ── SERVICES ─────────────────────────────────────────────
const services = [
  {
    _id: "svc-sourcing",
    number: "01",
    label: "Diamond Sourcing",
    title: "Diamond\nSourcing",
    tagline: "GIA-certified natural and lab-grown stones at trade pricing.",
    body: [
      "We source GIA-certified natural and lab-grown diamonds at trade pricing. Any shape, any size, any spec — sourced to brief through 47 years of trusted cutter relationships.",
      "No retail. No public catalogue. Pricing on application.",
    ],
    qualifies: ["Established trade businesses", "Minimum order thresholds apply", "Verified trade account required"],
    delivers: ["GIA certification on every stone", "Stones from 0.30ct to 10ct+", "Natural and lab-grown options"],
    turnaround: "5–10 business days",
    dark: false,
    signature: false,
    order: 1,
  },
  {
    _id: "svc-conversion",
    number: "02",
    label: "IF → FL Conversion",
    title: "IF → FL\nConversion",
    tagline: "Precision regrinding for documented value uplift.",
    body: [
      "Submit any IF stone's GIA certificate number. We analyse the report comments, assess viability at no cost, and if the stone qualifies, execute the precision regrind.",
      "A new GIA FL certificate is issued. Carat weight is preserved. Value uplift is documented.",
    ],
    qualifies: ["Internally Flawless GIA-graded stones", "0.50ct upward", "Surface characteristics only"],
    delivers: ["Free written assessment", "Precision micro-regrind under 0.01mm", "New GIA FL certificate"],
    turnaround: "4–8 weeks total",
    dark: true,
    signature: true,
    order: 2,
  },
  {
    _id: "svc-advisory",
    number: "03",
    label: "B2B Advisory",
    title: "B2B\nAdvisory",
    tagline: "White-label sourcing, investment advisory, custom briefs.",
    body: [
      "We operate as the quiet specialist behind serious businesses. White-label sourcing for retailers and jewellers. Investment-grade stone advisory for private clients.",
      "Custom specification briefs for designers and manufacturers. Partnership structures for institutional buyers.",
    ],
    qualifies: ["Retailers and jewellers", "Sophisticated private investors", "Institutional buyers"],
    delivers: ["White-label sourcing", "NDAs by default", "Bespoke partnership structures"],
    turnaround: "Engagement-specific",
    dark: false,
    signature: false,
    order: 3,
  },
];

// ── JEWELLERY COLLECTIONS ────────────────────────────────
const jewelleryCollections = [
  { _id: "jc-rings", title: "Engagement Rings", description: "Solitaire, three-stone, and bespoke designs centred on GIA-certified diamonds.", itemCount: "12 Pieces", available: true, order: 1 },
  { _id: "jc-earrings", title: "Diamond Earrings", description: "Matched-pair studs, drops, and chandeliers with calibrated D–F colour stones.", itemCount: "8 Pieces", available: true, order: 2 },
  { _id: "jc-pendants", title: "Pendants & Necklaces", description: "Solitaire pendants, halo settings, and tennis necklaces — each stone hand-selected.", itemCount: "10 Pieces", available: true, order: 3 },
  { _id: "jc-bracelets", title: "Tennis Bracelets", description: "Continuous matched-stone bracelets in white and rose gold, certified end-to-end.", itemCount: "6 Pieces", available: true, order: 4 },
];

// ── JOURNAL ARTICLES ─────────────────────────────────────
const today = new Date().toISOString().split("T")[0];
const journalArticles = [
  {
    _id: "jrn-iftofl",
    title: "Understanding the IF→FL Conversion",
    slug: { current: "understanding-if-to-fl-conversion", _type: "slug" },
    publishedAt: today,
    category: "Expertise",
    excerpt: "A technical primer on what GIA grades actually measure — and why a sub-0.01mm regrind can move a stone from IF to Flawless without losing carat weight.",
    featured: true,
    body: [
      { _key: "b1", _type: "block", style: "normal", children: [{ _key: "c1", _type: "span", text: "GIA's Internally Flawless grade allows for minor surface characteristics that disqualify a stone from Flawless. When those characteristics sit within a removable depth, precision regrinding can convert IF to FL — with documented uplift and preserved carat weight." }] },
    ],
    seo: {
      title: "Understanding the IF→FL Conversion — FLX Diamonds",
      description: "Technical primer on the IF→FL regrind process. How a sub-0.01mm regrind moves a stone from IF to GIA Flawless.",
    },
  },
  {
    _id: "jrn-natural-vs-lab",
    title: "Natural vs Lab-Grown: A Trade Buyer's View",
    slug: { current: "natural-vs-lab-grown-trade-view", _type: "slug" },
    publishedAt: today,
    category: "Education",
    excerpt: "Both natural and lab-grown stones now reach GIA certification standard. We unpack the trade implications for sourcing, pricing, and end-customer positioning.",
    featured: false,
    body: [
      { _key: "b1", _type: "block", style: "normal", children: [{ _key: "c1", _type: "span", text: "GIA grades natural and lab-grown stones to the same 4Cs criteria. The differences are commercial — provenance, pricing, customer perception — not technical." }] },
    ],
  },
  {
    _id: "jrn-market-2026",
    title: "2026 Diamond Market: Tightening Supply, Selective Demand",
    slug: { current: "2026-diamond-market-outlook", _type: "slug" },
    publishedAt: today,
    category: "Market Insights",
    excerpt: "Antwerp inventory levels, lab-grown price compression, and what serious trade buyers should expect from the next 12 months.",
    featured: false,
    body: [
      { _key: "b1", _type: "block", style: "normal", children: [{ _key: "c1", _type: "span", text: "Natural supply continues to tighten while lab-grown prices compress. Trade buyers building inventory should weight selection toward FL/IF clarity in D-F colour ranges for resilience." }] },
    ],
  },
];

// ── CONVERSION CASE STUDIES ──────────────────────────────
const conversionStones = [
  {
    _id: "cs-001",
    stoneId: "FLX-001",
    carat: "2.41 ct", colour: "D", cut: "Excellent", shape: "Round Brilliant",
    before: { grade: "IF", label: "Internally Flawless", comment: "Natural at 11 o'clock crown facet", value: "AUD 64,000", note: "Original GIA report, March 2024" },
    after: { grade: "FL", label: "Flawless", comment: "Clean — no internal or surface characteristics", value: "AUD 88,000", note: "New GIA report, July 2024" },
    uplift: "+37.5%", weeks: "6 weeks", removed: "Crown natural", order: 1,
  },
  {
    _id: "cs-002",
    stoneId: "FLX-002",
    carat: "1.52 ct", colour: "E", cut: "Excellent", shape: "Oval",
    before: { grade: "IF", label: "Internally Flawless", comment: "Extra facet on pavilion", value: "AUD 28,500", note: "Original GIA report, June 2024" },
    after: { grade: "FL", label: "Flawless", comment: "No surface characteristics noted", value: "AUD 39,000", note: "New GIA report, October 2024" },
    uplift: "+36.8%", weeks: "5 weeks", removed: "Pavilion extra facet", order: 2,
  },
  {
    _id: "cs-003",
    stoneId: "FLX-003",
    carat: "3.05 ct", colour: "F", cut: "Excellent", shape: "Emerald",
    before: { grade: "IF", label: "Internally Flawless", comment: "Surface graining, table facet", value: "AUD 95,000", note: "Original GIA report, August 2024" },
    after: { grade: "FL", label: "Flawless", comment: "Clean", value: "AUD 132,000", note: "New GIA report, November 2024" },
    uplift: "+38.9%", weeks: "7 weeks", removed: "Table surface graining", order: 3,
  },
];

// ── SAMPLE DIAMONDS ──────────────────────────────────────
const diamonds = [
  { _id: "diamond-FLX-N-001", stockId: "FLX-N-001", type: "natural", shape: "Round", carat: 2.01, color: "D", clarity: "FL", cut: "Excellent", polish: "Excellent", symmetry: "Excellent", fluorescence: "None", measurements: "8.05x8.07x4.96 mm", certification: "GIA", certificateNumber: "2476853574", available: true, featured: true },
  { _id: "diamond-FLX-N-002", stockId: "FLX-N-002", type: "natural", shape: "Oval", carat: 1.52, color: "E", clarity: "IF", cut: "Excellent", polish: "Excellent", symmetry: "Very Good", fluorescence: "Faint", measurements: "8.45x6.05x3.78 mm", certification: "GIA", certificateNumber: "5468123951", available: true, featured: true },
  { _id: "diamond-FLX-N-003", stockId: "FLX-N-003", type: "natural", shape: "Emerald", carat: 3.15, color: "F", clarity: "IF", cut: "Excellent", polish: "Excellent", symmetry: "Excellent", fluorescence: "None", measurements: "9.78x7.41x4.91 mm", certification: "GIA", certificateNumber: "6391157842", available: true, featured: true },
  { _id: "diamond-FLX-N-004", stockId: "FLX-N-004", type: "natural", shape: "Cushion", carat: 2.51, color: "G", clarity: "VVS1", cut: "Excellent", polish: "Excellent", symmetry: "Excellent", fluorescence: "None", measurements: "8.31x8.18x5.42 mm", certification: "GIA", certificateNumber: "7148526319", available: true, featured: false },
  { _id: "diamond-FLX-L-001", stockId: "FLX-L-001", type: "lab", shape: "Round", carat: 2.18, color: "D", clarity: "FL", cut: "Ideal", polish: "Excellent", symmetry: "Excellent", fluorescence: "None", measurements: "8.32x8.34x5.10 mm", certification: "IGI", certificateNumber: "618493720", available: true, featured: true },
  { _id: "diamond-FLX-L-002", stockId: "FLX-L-002", type: "lab", shape: "Princess", carat: 1.85, color: "E", clarity: "VVS1", cut: "Excellent", polish: "Excellent", symmetry: "Very Good", fluorescence: "None", measurements: "6.95x6.92x4.99 mm", certification: "IGI", certificateNumber: "619478326", available: true, featured: false },
  { _id: "diamond-FLX-N-005", stockId: "FLX-N-005", type: "natural", shape: "Pear", carat: 1.71, color: "F", clarity: "VS1", cut: "Excellent", polish: "Excellent", symmetry: "Excellent", fluorescence: "None", measurements: "9.85x6.05x3.71 mm", certification: "GIA", certificateNumber: "2378945612", available: true, featured: false },
  { _id: "diamond-FLX-N-006", stockId: "FLX-N-006", type: "natural", shape: "Marquise", carat: 2.05, color: "G", clarity: "VS2", cut: "Excellent", polish: "Very Good", symmetry: "Very Good", fluorescence: "Faint", measurements: "12.05x6.18x3.95 mm", certification: "GIA", certificateNumber: "8741256937", available: true, featured: false },
  { _id: "diamond-FLX-N-007", stockId: "FLX-N-007", type: "natural", shape: "Radiant", carat: 1.92, color: "H", clarity: "VS1", cut: "Excellent", polish: "Excellent", symmetry: "Excellent", fluorescence: "None", measurements: "7.45x6.05x4.51 mm", certification: "GIA", certificateNumber: "5128376491", available: true, featured: false },
  { _id: "diamond-FLX-N-008", stockId: "FLX-N-008", type: "natural", shape: "Asscher", carat: 2.32, color: "F", clarity: "VVS2", cut: "Excellent", polish: "Excellent", symmetry: "Excellent", fluorescence: "None", measurements: "7.21x7.18x4.81 mm", certification: "GIA", certificateNumber: "3645928174", available: true, featured: false },
];

/* ──────────────────────────────────────────────────────── run */
async function run() {
  console.log(`\n🔷 Seeding Sanity (${projectId}/${dataset})\n`);

  console.log("→ Site Settings");
  await upsert("siteSettings", "siteSettings", siteSettings);

  console.log("→ Page Singletons");
  await upsert("homePage", "homePage", homePage);
  await upsert("aboutPage", "aboutPage", aboutPage);
  await upsert("investmentPage", "investmentPage", investmentPage);
  await upsert("tradePage", "tradePage", tradePage);
  await upsert("contactPage", "contactPage", contactPage);

  console.log("→ FAQ Categories");
  for (const cat of faqCategories) {
    const { _id, ...rest } = cat;
    await upsert(_id, "faqCategory", rest);
  }

  console.log("→ Services");
  for (const s of services) {
    const { _id, ...rest } = s;
    await upsert(_id, "service", rest);
  }

  console.log("→ Jewellery Collections");
  for (const j of jewelleryCollections) {
    const { _id, ...rest } = j;
    await upsert(_id, "jewelleryCollection", rest);
  }

  console.log("→ Journal Articles");
  for (const a of journalArticles) {
    const { _id, ...rest } = a;
    await upsert(_id, "journalArticle", rest);
  }

  console.log("→ Conversion Case Studies");
  for (const c of conversionStones) {
    const { _id, ...rest } = c;
    await upsert(_id, "conversionStone", rest);
  }

  console.log("→ Sample Diamonds");
  for (const d of diamonds) {
    const { _id, ...rest } = d;
    await upsert(_id, "diamond", rest);
  }

  console.log("\n✅ Seed complete. Visit /studio to manage content.\n");
}

run().catch((e) => {
  console.error("✖ Seed failed:", e?.message || e);
  process.exit(1);
});
