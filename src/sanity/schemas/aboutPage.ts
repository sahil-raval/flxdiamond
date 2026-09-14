// Sanity Studio v3 schema for the About page (singleton document, _type: "aboutPage").
// Drop this into your studio's schema folder (e.g. schemas/aboutPage.ts) and register
// it in schemas/index.ts. Every field here maps 1:1 to a field the rewritten About.tsx
// reads — nothing here is decorative, and nothing About.tsx reads is missing here.
//
// NOTE: this assumes you already have a shared reusable "seo" object schema (most
// projects with an SeoHead component like yours do — it's referenced by other page
// types too). If you don't, replace the `{ name: "seo", type: "seo" }` field below
// with the inline field set commented at the bottom of this file.

import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  groups: [
    { name: "seo", title: "SEO" },
    { name: "hero", title: "Hero" },
    { name: "beginning", title: "The Beginning" },
    { name: "craftsman", title: "The Craftsman" },
    { name: "stone", title: "The Stone Number" },
    { name: "journey", title: "The Journey" },
    { name: "trusted", title: "Trusted By" },
  ],
  fields: [
    // ── SEO ──────────────────────────────────────────────────────────
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo", // swap for the inline object at the bottom of this file if you don't have a shared "seo" type
      group: "seo",
    }),

    // ── Hero ─────────────────────────────────────────────────────────
    defineField({
      name: "heroHeadingLead",
      title: "Heading — italic lead phrase",
      type: "string",
      description: 'e.g. "A Diamond is" — rendered in italic.',
      group: "hero",
    }),
    defineField({
      name: "heroHeadingBold",
      title: "Heading — bold close",
      type: "string",
      description: 'e.g. "Never just a Diamond" — rendered bold, same line.',
      group: "hero",
    }),
    defineField({
      name: "heroSubtextLines",
      title: "Subtext lines",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: "Each entry renders as its own line under the heading.",
      group: "hero",
    }),

    // ── The Beginning ────────────────────────────────────────────────
    defineField({
      name: "beginningEyebrow",
      title: "Eyebrow",
      type: "string",
      initialValue: "The Beginning",
      group: "beginning",
    }),
    defineField({
      name: "beginningHeading",
      title: "Heading",
      type: "string",
      initialValue: "Before FLX, There was the craft.",
      group: "beginning",
    }),
    defineField({
      name: "beginningBody",
      title: "Body copy",
      type: "text",
      rows: 4,
      group: "beginning",
    }),
    defineField({
      name: "beginningImage",
      title: "Card photo",
      type: "image",
      options: { hotspot: true },
      group: "beginning",
    }),
    defineField({
      name: "originStats",
      title: "Origin stats (1978 / 12 / Surat)",
      type: "array",
      group: "beginning",
      of: [
        defineArrayMember({
          type: "object",
          name: "originStat",
          fields: [
            defineField({ name: "value", title: "Value", type: "string", description: 'e.g. "1978", "12", "Surat"' }),
            defineField({ name: "label", title: "Label", type: "string", description: 'e.g. "The first chapter"' }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
      validation: (Rule) => Rule.max(4),
    }),

    // ── The Craftsman ────────────────────────────────────────────────
    defineField({
      name: "craftsman",
      title: "Craftsman",
      type: "object",
      group: "craftsman",
      fields: [
        defineField({ name: "name", title: "Name", type: "string", initialValue: "Babu Vekariya" }),
        defineField({
          name: "subtext",
          title: "Subtext",
          type: "string",
          initialValue: "47+ Years in the diamond trade — a craft you don't stop learning.",
        }),
        defineField({
          name: "illustration",
          title: "Illustration / portrait",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({ name: "bio", title: "Biography", type: "text", rows: 6 }),
      ],
    }),

    // ── The Stone Number ─────────────────────────────────────────────
    defineField({
      name: "stoneHeadingLead",
      title: "Heading — italic lead phrase",
      type: "string",
      initialValue: "The Stone Number tells you what it is",
      group: "stone",
    }),
    defineField({
      name: "stoneHeadingBold",
      title: "Heading — bold close",
      type: "string",
      initialValue: "The story tells you more.",
      group: "stone",
    }),
    defineField({
      name: "stoneCaption",
      title: "Caption paragraph(s)",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 3 })],
      group: "stone",
    }),
    defineField({
      name: "stoneVideoPoster",
      title: "Video poster image",
      type: "image",
      options: { hotspot: true },
      group: "stone",
    }),
    defineField({
      name: "stoneVideoUrl",
      title: "Video URL",
      type: "url",
      description: "Optional — if set, the poster becomes a play button linking here.",
      group: "stone",
    }),

    // ── The Journey ──────────────────────────────────────────────────
    defineField({
      name: "journeyHeadingLead",
      title: "Heading — italic lead phrase",
      type: "string",
      initialValue: "The Journey",
      group: "journey",
    }),
    defineField({
      name: "journeyHeadingBold",
      title: "Heading — bold close",
      type: "string",
      initialValue: "The Years Changed. The Curiosity didn't.",
      group: "journey",
    }),
    defineField({
      name: "journeySteps",
      title: "Timeline steps",
      type: "array",
      group: "journey",
      of: [
        defineArrayMember({
          type: "object",
          name: "journeyStep",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", description: 'e.g. "Apprentice"' }),
            defineField({ name: "body", title: "Body", type: "text", rows: 2 }),
          ],
          preview: { select: { title: "title", subtitle: "body" } },
        }),
      ],
      description: "Rendered top to bottom; the first step is shown highlighted, the rest dimmed.",
    }),
    defineField({
      name: "journeyPhotos",
      title: "Photo stack (up to 3)",
      type: "array",
      group: "journey",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
      validation: (Rule) => Rule.max(3),
    }),

    // ── Trusted by ───────────────────────────────────────────────────
    defineField({
      name: "trustedHeadingLead",
      title: "Heading — italic lead phrase",
      type: "string",
      initialValue: "Trusted by names that",
      group: "trusted",
    }),
    defineField({
      name: "trustedHeadingBold",
      title: "Heading — bold close",
      type: "string",
      initialValue: "hold their own standard.",
      group: "trusted",
    }),
  ],
  preview: {
    prepare() {
      return { title: "About Page" };
    },
  },
});



defineField({
  name: "seo",
  title: "SEO",
  type: "object",
  group: "seo",
  fields: [
    defineField({ name: "metaTitle", type: "string" }),
    defineField({ name: "metaDescription", type: "text", rows: 3 }),
    defineField({ name: "metaKeywords", type: "string" }),
    defineField({ name: "ogTitle", type: "string" }),
    defineField({ name: "ogDescription", type: "text", rows: 3 }),
    defineField({ name: "ogImage", type: "image" }),
    defineField({ name: "twitterCard", type: "string" }),
    defineField({ name: "noIndex", type: "boolean" }),
    defineField({ name: "structuredDataType", type: "string" }),
    defineField({ name: "additionalJsonLd", type: "text", rows: 4 }),
  ],
})
