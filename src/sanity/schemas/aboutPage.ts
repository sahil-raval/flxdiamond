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
      title: "Heading — first phrase",
      type: "string",
      description: 'e.g. "A Diamond is" — first half of the heading, same line as the second phrase.',
      group: "hero",
    }),
    defineField({
      name: "heroHeadingBold",
      title: "Heading — second phrase",
      type: "string",
      description: 'e.g. "Never just a Diamond" — second half of the heading, same line as the first phrase.',
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
    defineField({
      name: "heroPhotos",
      title: "Hero photos (exactly 3, in order)",
      type: "array",
      group: "hero",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              description: "Describe the photo for screen readers and SEO.",
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
      description: "Order matters: 1) top-left photo, 2) top-right photo, 3) tall right-column photo.",
      validation: (Rule) => Rule.max(3),
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
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Describe the photo for screen readers and SEO.",
          validation: (Rule) => Rule.required(),
        }),
      ],
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
      name: "craftsmanHeadingLead",
      title: "Heading — first phrase",
      type: "string",
      initialValue: "The Craftsman",
      description: 'The craftsman\'s name (below) fills in as the second phrase automatically.',
      group: "craftsman",
    }),
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
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              description: "Describe the image for screen readers and SEO.",
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
        defineField({ name: "bio", title: "Biography", type: "text", rows: 6 }),
      ],
    }),

    // ── The Stone Number ─────────────────────────────────────────────
    defineField({
      name: "stoneHeadingLead",
      title: "Heading — first phrase",
      type: "string",
      initialValue: "The Stone Number tells you what it is",
      group: "stone",
    }),
    defineField({
      name: "stoneHeadingBold",
      title: "Heading — second phrase",
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
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Describe the image for screen readers and SEO.",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "stoneVideo",
      title: "Video file (upload)",
      type: "file",
      options: { accept: "video/*" },
      description:
        "Upload the video directly (MP4 recommended). If set, this is used instead of the Video URL below — the poster becomes a play button that plays this video inline.",
      group: "stone",
    }),
    defineField({
      name: "stoneVideoUrl",
      title: "Video URL (fallback)",
      type: "url",
      description:
        "Only used if no video file is uploaded above. Must be a direct link to a video file (e.g. ending in .mp4) — not a YouTube/Vimeo watch-page link, since it plays inline rather than as an embed.",
      group: "stone",
    }),

    // ── The Journey ──────────────────────────────────────────────────
    defineField({
      name: "journeyHeadingLead",
      title: "Heading — first phrase",
      type: "string",
      initialValue: "The Journey",
      group: "journey",
    }),
    defineField({
      name: "journeyHeadingBold",
      title: "Heading — second phrase",
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
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              description: "Describe the photo for screen readers and SEO. Leave blank for a purely decorative duplicate photo.",
            }),
          ],
        }),
      ],
      validation: (Rule) => Rule.max(3),
    }),

    // ── Trusted by ───────────────────────────────────────────────────
    defineField({
      name: "trustedHeadingLead",
      title: "Heading — first phrase",
      type: "string",
      initialValue: "Trusted by names that",
      group: "trusted",
    }),
    defineField({
      name: "trustedHeadingBold",
      title: "Heading — second phrase",
      type: "string",
      initialValue: "hold their own standard.",
      group: "trusted",
    }),
    defineField({
      name: "trustedCountries",
      title: "Trusted-by countries (map pins)",
      type: "array",
      group: "trusted",
      description:
        "Pick which countries get a pin on the world map. Only countries in this list have a pre-computed map position — ask your developer to add one if you need a country that isn't here.",
      of: [
        defineArrayMember({
          type: "object",
          name: "trustedCountry",
          fields: [
            defineField({
              name: "country",
              title: "Country",
              type: "string",
              validation: (Rule) => Rule.required(),
              options: {
                list: [
                  "Germany",
                  "Australia",
                  "India",
                  "Brazil",
                  "Canada",
                  "United States",
                  "United Kingdom",
                  "United Arab Emirates",
                  "Hong Kong",
                  "Belgium",
                  "Israel",
                  "South Africa",
                  "China",
                  "Japan",
                  "Singapore",
                  "Switzerland",
                  "Italy",
                  "France",
                  "Netherlands",
                  "Russia",
                  "Botswana",
                  "Namibia",
                  "Thailand",
                  "South Korea",
                  "Mexico",
                  "New Zealand",
                  "Spain",
                  "Sweden",
                  "Turkey",
                  "Saudi Arabia",
                  "Egypt",
                  "Indonesia",
                  "Vietnam",
                  "Ireland",
                  "Portugal",
                  "Poland",
                  "Malaysia",
                ],
              },
            }),
            defineField({
              name: "label",
              title: "Display label override",
              type: "string",
              description: 'Optional — overrides the country name shown on the pin badge (e.g. "USA" instead of "United States").',
            }),
            defineField({
              name: "flagEmoji",
              title: "Flag emoji override",
              type: "string",
              description: "Optional — overrides the default flag emoji for this pin.",
            }),
          ],
          preview: {
            select: { title: "country", subtitle: "label" },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "About Page" };
    },
  },
});

/*
INLINE "seo" FIELD — use this instead of `type: "seo"` above if you don't already
have a shared seo object schema registered in your studio:

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
}),
*/