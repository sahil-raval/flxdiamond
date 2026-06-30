import { defineType, defineField } from "sanity";

export default defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({ name: "seo", title: "SEO", type: "seoObject" }),
    defineField({
      name: "heroTagline",
      title: "Hero Tagline",
      type: "string",
      initialValue: "Our Story",
    }),
    defineField({
      name: "heroHeading",
      title: "Hero Heading",
      type: "string",
      initialValue: "Heritage. Mastery. Quiet Confidence.",
    }),
    defineField({
      name: "heroSubtext",
      title: "Hero Subtext",
      type: "text",
      rows: 2,
      initialValue:
        "FLX Diamonds was built around one craftsman's 47 years of accumulated knowledge, knowledge that cannot be certified, cannot be replicated, and cannot be rushed.",
    }),
    defineField({
      name: "craftsman",
      title: "The Craftsman",
      type: "object",
      fields: [
        { name: "name", type: "string", title: "Name", initialValue: "Babu Vekariya" },
        { name: "beganCutting", type: "string", title: "Began Cutting", initialValue: "1978, Age 12" },
        { name: "yearsMastery", type: "string", title: "Years of Mastery", initialValue: "47 Years" },
        { name: "primaryCraft", type: "string", title: "Primary Craft", initialValue: "IF → FL Conversion" },
        { name: "basedIn", type: "string", title: "Based In", initialValue: "Geelong, VIC" },
        {
          name: "biography",
          type: "array",
          title: "Biography Paragraphs",
          of: [{ type: "text" }],
        },
        { name: "photo", type: "image", title: "Portrait Photo", options: { hotspot: true } },
      ],
    }),
    defineField({
      name: "techniqueTagline",
      title: "Technique Section Tagline",
      type: "string",
      initialValue: "The Technique",
    }),
    defineField({
      name: "techniqueHeading",
      title: "Technique Section Heading",
      type: "string",
      initialValue: "What the conversion actually requires.",
    }),
    defineField({
      name: "techniqueIntro",
      title: "Technique Intro Paragraphs",
      type: "array",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "techniqueSteps",
      title: "Technique Steps",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "step", type: "string", title: "Step Number (e.g. 01)" },
            { name: "title", type: "string", title: "Step Title" },
            { name: "body", type: "text", title: "Step Description", rows: 3 },
          ],
          preview: { select: { title: "title", subtitle: "step" } },
        },
      ],
    }),
    defineField({
      name: "partnerships",
      title: "Notable Partnerships",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", type: "string", title: "Company Name" },
            { name: "role", type: "string", title: "Role / Relationship" },
            { name: "detail", type: "text", title: "Details", rows: 3 },
          ],
          preview: { select: { title: "name", subtitle: "role" } },
        },
      ],
    }),
    defineField({
      name: "pillars",
      title: "How We Operate (Pillars)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Pillar Label" },
            { name: "body", type: "text", title: "Pillar Description", rows: 3 },
          ],
          preview: { select: { title: "label" } },
        },
      ],
    }),
    defineField({
      name: "ctaHeading",
      title: "CTA Heading",
      type: "string",
      initialValue: "Ready to begin a serious conversation?",
    }),
    defineField({
      name: "ctaBody",
      title: "CTA Body",
      type: "string",
      initialValue: "All enquiries are handled directly and under strict commercial confidence.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "About Page" }),
  },
});
