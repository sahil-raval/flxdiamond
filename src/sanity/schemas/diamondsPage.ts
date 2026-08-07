import { defineType, defineField } from "sanity";

export default defineType({
  name: "diamondsPage",
  title: "Diamonds Page",
  type: "document",
  fields: [
    defineField({ name: "seo", title: "SEO", type: "seoObject" }),
    defineField({ name: "heroTagline", title: "Hero Tagline", type: "string", initialValue: "GIA-Certified Trade Inventory" }),
    defineField({ name: "heroHeading", title: "Hero Heading", type: "string", initialValue: "Diamond Collection" }),
    defineField({
      name: "heroSubtext",
      title: "Hero Subtext",
      type: "text",
      rows: 2,
      initialValue: "Natural and lab-grown diamonds at verified trade pricing. Every stone GIA-certified. IF→FL conversion assessments available at no cost.",
    }),
    defineField({ name: "tabLabelNatural", title: "Tab Label — Natural", type: "string", initialValue: "Natural Diamonds" }),
    defineField({ name: "tabLabelLab", title: "Tab Label — Lab Grown", type: "string", initialValue: "Lab-Grown Diamonds" }),
    defineField({ name: "tabLabelLoose", title: "Tab Label — Loose", type: "string", initialValue: "Loose Diamonds" }),
    defineField({ name: "tabLabelCustom", title: "Tab Label — Customised", type: "string", initialValue: "Customised" }),
    defineField({
      name: "trustStripItems",
      title: "Trust Strip — Natural / Lab tabs",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "icon", type: "string", title: "Icon glyph (◈ ⬡ ◎ ✦) — leave blank on the first item to use the GIA logo instead" },
          { name: "label", type: "string", title: "Label" },
          { name: "sub", type: "string", title: "Subtext" },
        ],
        preview: { select: { title: "label", subtitle: "sub" } },
      }],
      initialValue: [
        { icon: "", label: "GIA Certified", sub: "Every stone independently graded" },
        { icon: "◈", label: "Trade Pricing", sub: "No retail margin, direct to trade" },
        { icon: "⬡", label: "IF→FL Conversion", sub: "Free viability assessment" },
        { icon: "◎", label: "Discretion", sub: "White-label sourcing available" },
      ],
    }),
    defineField({
      name: "looseTrustStripItems",
      title: "Trust Strip — Loose tab",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "icon", type: "string", title: "Icon glyph" },
          { name: "label", type: "string", title: "Label" },
          { name: "sub", type: "string", title: "Subtext" },
        ],
        preview: { select: { title: "label", subtitle: "sub" } },
      }],
      initialValue: [
        { icon: "◈", label: "Trade Pricing", sub: "No retail margin, direct to trade" },
        { icon: "⬡", label: "In-House Assessment", sub: "All grades verified by our gemologists" },
        { icon: "◎", label: "Cert on Request", sub: "GIA/IGI grading available pre-purchase" },
        { icon: "✦", label: "Up to 20ct", sub: "Large & parcel lots available" },
      ],
    }),
    defineField({
      name: "looseBannerHeading",
      title: "Loose Diamonds Banner Heading",
      type: "string",
      initialValue: "Loose Diamonds — Sold Without Grading Reports",
    }),
    defineField({
      name: "looseBannerBody",
      title: "Loose Diamonds Banner Body",
      type: "text",
      rows: 3,
      initialValue: "These stones are available to the trade as uncertified inventory. Weights and grades are assessed in-house. Independent GIA or IGI certification can be arranged prior to purchase on request. Stones range from sub-carat melee to exceptional large specimens up to 20ct.",
    }),
    defineField({ name: "customTagline", title: "Customised Tab Tagline", type: "string", initialValue: "Bespoke Sourcing" }),
    defineField({ name: "customHeading", title: "Customised Tab Heading", type: "string", initialValue: "Describe exactly what you need." }),
    defineField({
      name: "customBody",
      title: "Customised Tab Body",
      type: "text",
      rows: 3,
      initialValue: "We source to specification — carat, shape, colour, clarity, origin. Natural and lab-grown. Every brief is handled personally and confidentially.",
    }),
    defineField({ name: "customCtaPrimary", title: "Customised Tab Primary CTA", type: "string", initialValue: "Submit a Brief" }),
    defineField({ name: "customCtaSecondary", title: "Customised Tab Secondary CTA", type: "string", initialValue: "View Our Services" }),
  ],
  preview: { prepare: () => ({ title: "Diamonds Page" }) },
});