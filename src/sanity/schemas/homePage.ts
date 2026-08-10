import { defineType, defineField } from "sanity";

/**
 * FLX Home Page — full editable schema.
 *
 * Every editable string, paragraph and array on the Home page is
 * represented here. Fields are grouped for easier navigation in the
 * Studio. Every field is optional at edit-time; the frontend supplies
 * a safe fallback so nothing breaks if a value is missing.
 */
const stringItem = { name: "value", type: "string", title: "Text" };

export default defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  groups: [
    { name: "seo", title: "SEO" },
    { name: "hero", title: "Hero" },
    { name: "strip", title: "Signal Strip" },
    { name: "clients", title: "Client Logos" },
    { name: "qualifier", title: "Qualifier Cards" },

    { name: "featured", title: "Featured Inventory" },
    { name: "traceability", title: "Traceability" },
    { name: "fourCs", title: "4 C's" },
    { name: "iftfl", title: "IF→FL" },
    { name: "services", title: "Services" },
    { name: "process", title: "Process" },
    { name: "why", title: "Why FLX" },
    { name: "trade", title: "Trade Portal" },
    { name: "investment", title: "Investment" },
    { name: "testimonials", title: "Testimonials" },
    { name: "faqs", title: "FAQs" },
    { name: "closing", title: "Closing / CTA" },
  ],
  fields: [
    /* ── SEO ─────────────────────────────────────── */
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      group: "seo",
      fields: [
        { name: "metaTitle", type: "string", title: "Meta Title" },
        { name: "metaDescription", type: "text", rows: 3, title: "Meta Description" },
        { name: "metaKeywords", type: "string", title: "Meta Keywords" },
        { name: "ogTitle", type: "string", title: "OG Title" },
        { name: "ogDescription", type: "text", rows: 2, title: "OG Description" },
        { name: "ogImageUrl", type: "url", title: "OG Image URL" },
        { name: "twitterCard", type: "string", title: "Twitter Card", options: { list: ["summary", "summary_large_image"] } },
        { name: "noIndex", type: "boolean", title: "No-index this page" },
        { name: "structuredDataType", type: "string", title: "JSON-LD Type", initialValue: "Organization" },
        { name: "additionalJsonLd", type: "text", rows: 4, title: "Extra JSON-LD (raw JSON)" },
      ],
    }),

    /* ── HERO ────────────────────────────────────── */
    defineField({ name: "heroOverline", type: "string", title: "Hero Overline", group: "hero" }),
    defineField({ name: "heroHeading", type: "string", title: "Hero Heading", group: "hero" }),
    defineField({ name: "heroSubtext", type: "text", rows: 3, title: "Hero Subtext", group: "hero" }),
    defineField({ name: "heroCta", type: "string", title: "Hero Primary CTA", group: "hero" }),
    defineField({ name: "heroSecondaryCta", type: "string", title: "Hero Secondary CTA", group: "hero" }),
    defineField({ name: "heroVideoUrl", type: "url", title: "Hero Video URL", group: "hero" }),

    /* ── SIGNAL STRIP (marquee) ──────────────────── */
    defineField({
      name: "marqueeItems",
      title: "Top Marquee Items",
      type: "array",
      of: [{ type: "string" }],
      group: "strip",
    }),
    defineField({
      name: "signalStripItems",
      title: "Signal Strip Items",
      type: "array",
      group: "strip",
      of: [
        {
          type: "object",
          fields: [
            { name: "text", type: "string", title: "Text" },
            { name: "logoUrl", type: "url", title: "Logo URL (optional)" },
          ],
        },
      ],
    }),

    /* ── CLIENT LOGOS ────────────────────────────── */
    defineField({
      name: "clientLogos",
      title: "Client Logos",
      type: "array",
      group: "clients",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", type: "string", title: "Client Name" },
            { name: "sub", type: "string", title: "Sub-line (locations)" },
            { name: "logoUrl", type: "url", title: "Logo URL (optional)" },
          ],
        },
      ],
    }),

    /* ── QUALIFIER ───────────────────────────────── */
    defineField({ name: "qualifierTagline", type: "string", title: "Qualifier Tagline", group: "qualifier" }),
    defineField({ name: "qualifierHeading", type: "string", title: "Qualifier Heading", group: "qualifier" }),
    defineField({ name: "qualifierSubtext", type: "text", rows: 2, title: "Qualifier Subtext", group: "qualifier" }),
    defineField({
      name: "qualifierCards",
      title: "Qualifier Cards (buyer types)",
      type: "array",
      group: "qualifier",
      of: [
        {
          type: "object",
          fields: [
            { name: "id", type: "string", title: "Slug ID", validation: (r) => r.required() },
            { name: "num", type: "string", title: "Number (e.g. 01)" },
            { name: "headline", type: "string", title: "Card Headline" },
            { name: "subtext", type: "text", rows: 3, title: "Card Subtext" },
            { name: "answerTitle", type: "string", title: "Answer Title" },
            { name: "answerPoints", type: "array", of: [{ type: "string" }], title: "Answer Bullet Points" },
            { name: "answerCta", type: "string", title: "Answer CTA Label" },
            { name: "answerHref", type: "string", title: "Answer CTA Link (e.g. /talk-to-us)" },
          ],
        },
      ],
    }),
    defineField({ name: "qualifierAnswerLabel", type: "string", title: "Answer Panel Label", group: "qualifier" }),
defineField({ name: "qualifierAnswerQuote", type: "string", title: "Answer Panel Quote", group: "qualifier" }),

    /* ── FEATURED INVENTORY ──────────────────────── */
    defineField({ name: "featuredInventoryTagline", type: "string", title: "Tagline", group: "featured" }),
    defineField({ name: "featuredInventoryHeading", type: "string", title: "Heading", group: "featured" }),
    defineField({ name: "featuredInventoryNote", type: "string", title: "Bottom Note", group: "featured" }),
    defineField({ name: "viewAllStonesText", type: "string", title: "'View All Stones' Link Text", group: "featured" }),

    /* ── TRACEABILITY (feature video) ────────────── */
    defineField({ name: "featureVideoUrl", type: "url", title: "Traceability Video URL", group: "traceability" }),

    /* ── 4 C's ───────────────────────────────────── */
    defineField({
      name: "fourCs",
      title: "The 4 C's",
      type: "array",
      group: "fourCs",
      of: [
        {
          type: "object",
          fields: [
            { name: "n", type: "string", title: "Number" },
            { name: "iconKey", type: "string", title: "Icon Key", options: { list: ["scale", "palette", "eye", "gem"] } },
            { name: "title", type: "string", title: "Title" },
            { name: "desc", type: "text", rows: 3, title: "Description" },
          ],
        },
      ],
    }),

    /* ── IF→FL ───────────────────────────────────── */
    defineField({ name: "iftflTagline", type: "string", title: "Tagline", group: "iftfl" }),
    defineField({ name: "iftflHeading", type: "string", title: "Heading", group: "iftfl" }),
    defineField({ name: "iftflBody", type: "text", rows: 4, title: "Body", group: "iftfl" }),
    defineField({ name: "iftflCtaPrimary", type: "string", title: "Primary CTA Label", group: "iftfl" }),
    defineField({ name: "iftflCtaSecondary", type: "string", title: "Secondary CTA Label", group: "iftfl" }),

    /* ── SERVICES ────────────────────────────────── */
    defineField({ name: "manufacturingTagline", type: "string", title: "Section Tagline", group: "services" }),
    defineField({ name: "manufacturingHeading", type: "string", title: "Section Heading", group: "services" }),
    defineField({ name: "manufacturingBody", type: "text", rows: 4, title: "Section Body", group: "services" }),
    defineField({
      name: "services",
      title: "Services Cards",
      type: "array",
      group: "services",
      of: [
        {
          type: "object",
          fields: [
            { name: "num", type: "string", title: "Number" },
            { name: "title", type: "string", title: "Title" },
            { name: "body", type: "text", rows: 3, title: "Body" },
            { name: "tags", type: "array", of: [{ type: "string" }], title: "Tags" },
            { name: "link", type: "string", title: "Link (e.g. /diamonds)" },
            { name: "linkText", type: "string", title: "Link Text" },
          ],
        },
      ],
    }),

    /* ── PROCESS BADGES ──────────────────────────── */
    defineField({
      name: "processBadges",
      title: "Process Badges (3 tiles)",
      type: "array",
      group: "process",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Label" },
            { name: "sub", type: "string", title: "Sub-line" },
          ],
        },
      ],
    }),
    defineField({ name: "processCta", type: "string", title: "Process CTA Label", group: "process" }),

    /* ── WHY FLXDIAMONDS ─────────────────────────── */
    defineField({ name: "whyTagline", type: "string", title: "Section Tagline", group: "why" }),
    defineField({ name: "whyHeading", type: "string", title: "Section Heading", group: "why" }),
    defineField({
      name: "whyCards",
      title: "Why Cards",
      type: "array",
      group: "why",
      of: [
        {
          type: "object",
          fields: [
            { name: "iconKey", type: "string", title: "Icon Key", options: { list: ["award", "shield", "sliders", "cpu"] } },
            { name: "title", type: "string", title: "Title" },
            { name: "body", type: "text", rows: 3, title: "Body" },
            { name: "tag", type: "string", title: "Tag Label" },
          ],
        },
      ],
    }),

/* ── TRADE PORTAL ────────────────────────────── */
defineField({ name: "tradePortalTagline", type: "string", title: "Tagline", group: "trade" }),
defineField({ name: "tradePortalHeading", type: "string", title: "Heading", group: "trade" }),
defineField({ name: "tradePortalJewellersHeading", type: "string", title: "Jewellers Heading", group: "trade" }),
defineField({ name: "tradePortalJewellersBody", type: "text", rows: 3, title: "Jewellers Body", group: "trade" }),
defineField({ name: "tradePortalJewellersCta", type: "string", title: "Jewellers CTA Label", group: "trade" }),
defineField({ name: "tradePortalHowHeading", type: "string", title: "How-we-work Heading", group: "trade" }),
defineField({ name: "tradePortalHowBody", type: "text", rows: 3, title: "How-we-work Body", group: "trade" }),
defineField({ name: "tradePortalHowCta", type: "string", title: "How-we-work CTA Label", group: "trade" }),

    /* ── INVESTMENT ──────────────────────────────── */
    defineField({ name: "investmentTagline", type: "string", title: "Tagline", group: "investment" }),
    defineField({ name: "investmentHeading", type: "string", title: "Heading", group: "investment" }),
    defineField({ name: "investmentBody", type: "text", rows: 4, title: "Body", group: "investment" }),
    defineField({ name: "investmentCta", type: "string", title: "CTA Label", group: "investment" }),
    defineField({
      name: "investmentPoints",
      title: "Investment Points",
      type: "array",
      of: [{ type: "string" }],
      group: "investment",
    }),

    /* ── TESTIMONIALS ────────────────────────────── */
    defineField({ name: "testimonialsTagline", type: "string", title: "Tagline", group: "testimonials" }),
    defineField({ name: "testimonialsHeading", type: "string", title: "Heading", group: "testimonials" }),
    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      group: "testimonials",
      of: [
        {
          type: "object",
          fields: [
            { name: "quote", type: "text", rows: 3, title: "Quote" },
            { name: "author", type: "string", title: "Role / Author" },
            { name: "region", type: "string", title: "Region / Location" },
          ],
        },
      ],
    }),
    defineField({ name: "testimonialsNote", type: "string", title: "Bottom Note", group: "testimonials" }),
    defineField({ name: "faqSectionTagline", type: "string", title: "Section Tagline", group: "faqs" }),
defineField({ name: "faqSectionHeading", type: "string", title: "Section Heading", group: "faqs" }),
defineField({ name: "faqClosingCta", type: "string", title: "Closing CTA Label", group: "faqs" }),

    /* ── FAQ ─────────────────────────────────────── */
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      group: "faqs",
      of: [
        {
          type: "object",
          fields: [
            { name: "q", type: "string", title: "Question" },
            { name: "a", type: "text", rows: 4, title: "Answer" },
          ],
        },
      ],
    }),

    /* ── CLOSING / CTA ───────────────────────────── */
    defineField({ name: "noPitchHeading", type: "string", title: "'No pitch' Heading", group: "closing" }),
    defineField({ name: "noPitchBody", type: "text", rows: 3, title: "'No pitch' Body", group: "closing" }),
    defineField({ name: "ctaSectionHeading", type: "string", title: "Closing Heading", group: "closing" }),
    defineField({ name: "ctaSectionBody", type: "text", rows: 3, title: "Closing Body", group: "closing" }),
    defineField({
  name: "noPitchButtons",
  title: "'No Pitch' Buttons (4)",
  type: "array",
  group: "closing",
  of: [
    {
      type: "object",
      fields: [
        { name: "label", type: "string", title: "Label" },
        { name: "href", type: "string", title: "Link (e.g. /diamonds)" },
      ],
    },
  ],
}),
  ],
  preview: {
    prepare() {
      return { title: "Home Page" };
    },
  },
});

export const _placeholder = stringItem; // keep tsc happy (unused const)