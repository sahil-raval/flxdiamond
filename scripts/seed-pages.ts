/**
 * FLX Diamonds — Safe page-content seed.
 *
 * Fills the page singletons (homePage, aboutPage, investmentPage, tradePage)
 * with the default website copy using `setIfMissing`, so:
 *   - it ONLY fills fields that are currently empty,
 *   - it NEVER overwrites content you've already edited in Studio,
 *   - it NEVER touches diamonds, journal articles, services, faqs or collections.
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

const homePage = {
  heroOverline: "Geelong, Victoria, Australia · Est. 1978",
  heroCta: "Source Diamonds",
  heroSecondaryCta: "IF→FL Conversion",
  qualifierTagline: "Find Your Answer",
  qualifierHeading: "What brings you here today?",
  qualifierSubtext: "Select the situation that matches yours. We'll give you the exact answer.",
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
  whyTagline: "Our Difference",
  whyHeading: "Why FLXDIAMONDS.",
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
  testimonials: [
    { _key: "t1", quote: "Unlocked significant value from a 2.4ct IF stone we'd held for two years. The GIA FL certificate came back within the same carat bracket. Remarkable.", author: "Senior Diamond Buyer", region: "Dubai" },
    { _key: "t2", quote: "We've used FLXDIAMONDS for white-label sourcing across three collections. Their discretion is absolute. Our clients never know the source, and the quality speaks for itself.", author: "Head of Procurement", region: "Mumbai" },
    { _key: "t3", quote: "The assessment was free, the process was explained clearly, and the result exceeded expectations. For anyone holding IF stones, the conversation costs nothing.", author: "Private Investor", region: "Singapore" },
    { _key: "t4", quote: "What impressed us most was the transparency — a clear yes or no on viability, no sales pressure, and a result that genuinely moved the value of our inventory.", author: "Jewellery Retailer", region: "Melbourne" },
  ],
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
  console.log("  ✓ homePage");
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
  console.log("Done.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
