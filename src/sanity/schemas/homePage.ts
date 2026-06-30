import { defineType, defineField } from "sanity";

export default defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    /* ── SEO ── */
    defineField({ name: "seo", title: "SEO", type: "seoObject" }),

    /* ── Hero ── */
    defineField({ name: "heroOverline", title: "Hero Overline", type: "string",
      initialValue: "Geelong, Victoria, Australia · Est. 1978" }),
    defineField({ name: "heroHeading", title: "Hero Heading", type: "string",
      initialValue: "The Stone Begins Here." }),
    defineField({ name: "heroSubtext", title: "Hero Subtext", type: "text", rows: 2,
      initialValue: "B2B diamond sourcing & IF→FL precision conversion. Natural, lab-grown, and custom — every stone GIA-certified." }),
    defineField({ name: "heroCta", title: "Hero CTA Label", type: "string", initialValue: "Source Diamonds" }),
    defineField({ name: "heroSecondaryCta", title: "Hero Secondary CTA Label", type: "string", initialValue: "IF→FL Conversion" }),
    defineField({ name: "heroVideo", title: "Hero Video", type: "file",
      description: "Upload hero video (MP4). Falls back to /hero-ocean.mp4 if blank.",
      options: { accept: "video/mp4" } }),

    /* ── Marquee ── */
    defineField({
      name: "marqueeItems", title: "Marquee Trust Items", type: "array", of: [{ type: "string" }],
      initialValue: ["GIA Certified","IF → FL Conversion","Natural & Lab Grown","Trade Only","47 Years Mastery","Geelong, Australia","Discreet & Confidential","Precision Regrinding"],
    }),

    /* ── Qualifier section ── */
    defineField({ name: "qualifierTagline", title: "Qualifier Tagline", type: "string", initialValue: "Find Your Answer" }),
    defineField({ name: "qualifierHeading", title: "Qualifier Heading", type: "string", initialValue: "What brings you here today?" }),
    defineField({ name: "qualifierSubtext", title: "Qualifier Subtext", type: "string",
      initialValue: "Select the situation that matches yours. We'll give you the exact answer." }),

    /* ── Manufacturing story ── */
    defineField({ name: "manufacturingTagline", title: "Manufacturing Tagline", type: "string", initialValue: "Our Process" }),
    defineField({ name: "manufacturingHeading", title: "Manufacturing Heading", type: "string",
      initialValue: "We make them. We don't just sell them." }),
    defineField({ name: "manufacturingBody", title: "Manufacturing Body", type: "text", rows: 3,
      initialValue: "Most diamond businesses source from wholesalers. We cut and polish in our own manufacturing lab. That's why we can stand behind every stone we sell — and offer services no retailer can." }),
    defineField({ name: "manufacturingCta", title: "Manufacturing CTA", type: "string", initialValue: "About Our Lab →" }),
    defineField({ name: "manufacturingVideo", title: "Manufacturing Lab Video", type: "file",
      description: "Optional video for the manufacturing story section.",
      options: { accept: "video/mp4" } }),
    defineField({ name: "manufacturingImage", title: "Manufacturing Lab Image", type: "image",
      description: "Fallback image if no video.",
      options: { hotspot: true } }),

    /* ── IF→FL 50/50 callout ── */
    defineField({ name: "profitSplitHeading", title: "50/50 Split Callout Heading", type: "string",
      initialValue: "We only earn when you earn — 50/50 profit split." }),
    defineField({ name: "profitSplitBody", title: "50/50 Split Callout Body", type: "text", rows: 3,
      initialValue: "No upfront cost. No conversion fee. We calculate the IF value, the projected FL value, document it in writing, then share the profit we create together. If we can't do it, we'll tell you that before touching the stone." }),

    /* ── Trade portal section ── */
    defineField({ name: "tradePortalTagline", title: "Trade Portal Tagline", type: "string", initialValue: "Trade Portal" }),
    defineField({ name: "tradePortalHeading", title: "Trade Portal Heading", type: "string", initialValue: "Built for the trade." }),
    defineField({ name: "tradePortalJewellersHeading", title: "Trade Portal — Jewellers Heading", type: "string",
      initialValue: "Jewellers and designers" }),
    defineField({ name: "tradePortalJewellersBody", title: "Trade Portal — Jewellers Body", type: "text", rows: 3,
      initialValue: "Melee sourcing, matched parcels, and memo requests. Register with your ABN — pricing always comes back to you personally by email. No retail pricing, no margins on top of margins." }),
    defineField({ name: "tradePortalHowHeading", title: "Trade Portal — How We Work Heading", type: "string",
      initialValue: "How we work with jewellers" }),
    defineField({ name: "tradePortalHowBody", title: "Trade Portal — How We Work Body", type: "text", rows: 3,
      initialValue: "If a retail customer mentions they're working with a jeweller, we loop that jeweller in rather than transact directly. Our customers without a jeweller stay ours to refer — once they have one, that relationship is theirs." }),

    /* ── Investment section ── */
    defineField({ name: "investmentTagline", title: "Investment Section Tagline", type: "string", initialValue: "Investment" }),
    defineField({ name: "investmentHeading", title: "Investment Section Heading", type: "string",
      initialValue: "Natural FL diamonds as a long-term asset." }),
    defineField({ name: "investmentBody", title: "Investment Section Body", type: "text", rows: 3,
      initialValue: "Natural diamonds — particularly FL clarity in desirable cuts — have held and appreciated in value over time. We work with buyers who want a portable, certifiable hard asset outside the share market. Same honest conversation, no hype." }),
    defineField({ name: "investmentCta", title: "Investment CTA", type: "string", initialValue: "Book a Consultation →" }),
    defineField({ name: "investmentPoints", title: "Investment Numbered Points", type: "array", of: [{ type: "string" }],
      initialValue: [
        "FL and IF in D–F colour represent the top 1% of all GIA-graded stones globally.",
        "Tangible, portable, stateless — independent of any bank or financial system.",
        "The IF→FL conversion creates a new GIA certificate with fully documented and verifiable uplift.",
        "We advise on stone selection, market timing, and verified re-sale pathways. No salesmanship.",
      ],
    }),

    /* ── No pitch section ── */
    defineField({ name: "noPitchHeading", title: '"No Pitch" Section Heading', type: "string",
      initialValue: "No pitch. Just a conversation." }),
    defineField({ name: "noPitchBody", title: '"No Pitch" Section Body', type: "text", rows: 2,
      initialValue: "Buying, upgrading, investing, or sourcing for trade — we're straightforward people. Start here." }),

    /* ── Featured inventory ── */
    defineField({ name: "featuredInventoryTagline", title: "Featured Inventory Tagline", type: "string", initialValue: "By Application Only" }),
    defineField({ name: "featuredInventoryHeading", title: "Featured Inventory Heading", type: "string", initialValue: "Featured Inventory" }),
    defineField({ name: "featuredInventoryNote", title: "Featured Inventory Footer Note", type: "string",
      initialValue: "Trade pricing disclosed by secure email · ABN verification required · All stones GIA-certified" }),

    /* ── Why FLX section ── */
    defineField({ name: "whyTagline", title: "Why FLX Tagline", type: "string", initialValue: "Our Difference" }),
    defineField({ name: "whyHeading", title: "Why FLX Heading", type: "string", initialValue: "Why FLXDIAMONDS." }),

    /* ── Testimonials ── */
    defineField({ name: "testimonialsTagline", title: "Testimonials Tagline", type: "string", initialValue: "From Our Partners" }),
    defineField({ name: "testimonialsHeading", title: "Testimonials Heading", type: "string", initialValue: "What the trade says." }),
    defineField({
      name: "testimonials", title: "Testimonials", type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "quote", type: "text", title: "Quote", rows: 3 },
          { name: "author", type: "string", title: "Author (anonymised, e.g. Senior Buyer, Dubai)" },
          { name: "region", type: "string", title: "Region" },
        ],
        preview: { select: { title: "author", subtitle: "region" } },
      }],
    }),

    /* ── Closing CTA ── */
    defineField({ name: "closingTagline", title: "Closing Tagline", type: "string", initialValue: "Precision. Trust. Excellence." }),
    defineField({ name: "closingQuote", title: "Closing Quote", type: "text", rows: 2,
      initialValue: '"The finest diamonds are not found. They are understood."' }),
    defineField({ name: "closingCta", title: "Closing CTA Label", type: "string", initialValue: "Begin the Conversation →" }),
    defineField({ name: "closingImage", title: "Closing Background Image", type: "image",
      description: "Ocean/landscape image behind the closing quote.",
      options: { hotspot: true } }),

    /* ── FAQs ── */
    defineField({
      name: "faqs", title: "Home Page FAQs", type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "q", type: "string", title: "Question" },
          { name: "a", type: "text", title: "Answer", rows: 4 },
        ],
        preview: { select: { title: "q" } },
      }],
    }),
  ],
  preview: { prepare: () => ({ title: "Home Page" }) },
});
