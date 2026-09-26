// Sanity Studio v3 schema for the About page (singleton document, _type: "aboutPage").
// Drop this into your studio's schema folder (e.g. schemas/aboutPage.ts) and register
// it in schemas/index.ts. Every field here maps 1:1 to a field the rewritten About.tsx
// reads — nothing here is decorative, and nothing About.tsx reads is missing here.
//
// The "seo" field below is a fully inline object — it doesn't depend on a shared
// "seo" schema type being registered elsewhere in your Studio. If your project
// DOES already have its own shared "seo" object type used by other page types,
// you can swap this field's `type: "object"` + `fields: [...]` for `type: "seo"`
// instead, so all your page types share one seo schema.

import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  groups: [
    { name: "seo", title: "SEO" },
    { name: "hero", title: "Hero" },
    { name: "beginning", title: "The Beginning" },
    { name: "learning", title: "Learning the Craft" },
    { name: "trust", title: "Character & Trust" },
    { name: "stone", title: "The Next Chapter (video)" },
    { name: "trusted", title: "Trusted By" },
  ],
  fields: [
    // ── SEO ──────────────────────────────────────────────────────────
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      group: "seo",
      fields: [
        defineField({ name: "metaTitle", title: "Meta title", type: "string" }),
        defineField({ name: "metaDescription", title: "Meta description", type: "text", rows: 3 }),
        defineField({ name: "metaKeywords", title: "Meta keywords", type: "string" }),
        defineField({ name: "ogTitle", title: "OG title", type: "string" }),
        defineField({ name: "ogDescription", title: "OG description", type: "text", rows: 3 }),
        defineField({ name: "ogImage", title: "OG image", type: "image" }),
        defineField({ name: "twitterCard", title: "Twitter card type", type: "string" }),
        defineField({ name: "noIndex", title: "No-index this page", type: "boolean" }),
        defineField({ name: "structuredDataType", title: "Structured data type", type: "string" }),
        defineField({ name: "additionalJsonLd", title: "Additional JSON-LD", type: "text", rows: 4 }),
      ],
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

    // ── Learning the Craft ───────────────────────────────────────────
    defineField({
      name: "learningHeadingLead",
      title: "Heading — first phrase (italic)",
      type: "string",
      initialValue: "Learning the craft.",
      group: "learning",
    }),
    defineField({
      name: "learningHeadingBold",
      title: "Heading — second phrase (bold)",
      type: "string",
      initialValue: "Living the craft",
      group: "learning",
    }),
    defineField({
      name: "learningBody",
      title: "Body copy (next to the heading)",
      type: "text",
      rows: 4,
      group: "learning",
    }),
    defineField({
      name: "learningImage",
      title: "Photo — left column",
      type: "image",
      options: { hotspot: true },
      group: "learning",
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
      name: "learningCaption",
      title: "Caption (under the left photo)",
      type: "text",
      rows: 4,
      group: "learning",
    }),
    defineField({
      name: "learningPortrait",
      title: "Photo — right column (under the body copy)",
      type: "image",
      options: { hotspot: true },
      group: "learning",
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

    // ── Character & Trust ────────────────────────────────────────────
    defineField({
      name: "trustHeadingLead",
      title: "Heading — first phrase (italic)",
      type: "string",
      initialValue: "Character earned trust",
      group: "trust",
    }),
    defineField({
      name: "trustHeadingBold",
      title: "Heading — second phrase (bold)",
      type: "string",
      initialValue: "before titles",
      group: "trust",
    }),
    defineField({
      name: "trustSubtext",
      title: "Subtext",
      type: "text",
      rows: 3,
      group: "trust",
    }),
    defineField({
      name: "trustBackgroundImage",
      title: "Section background photo (optional)",
      type: "image",
      options: { hotspot: true },
      description: "Optional full-bleed dark photo behind this section. Leave empty to use the plain navy background.",
      group: "trust",
    }),
    defineField({
      name: "trustPhoto",
      title: "Card photo",
      type: "image",
      options: { hotspot: true },
      group: "trust",
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
      name: "trustCardHeading",
      title: "Card heading",
      type: "string",
      initialValue: "Decades of Expertise",
      group: "trust",
    }),
    defineField({
      name: "trustCardBody",
      title: "Card body copy",
      type: "text",
      rows: 3,
      group: "trust",
    }),

    // ── The Next Chapter (video) ───────────────────────────────────────
    defineField({
      name: "stoneHeadingLead",
      title: "Heading — first phrase (italic)",
      type: "string",
      initialValue: "The next chapter became",
      group: "stone",
    }),
    defineField({
      name: "stoneHeadingBold",
      title: "Heading — second phrase (bold)",
      type: "string",
      initialValue: "FLX.",
      group: "stone",
    }),
    defineField({
      name: "stoneSubtext",
      title: "Subtext (under the heading, above the video)",
      type: "text",
      rows: 3,
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
    defineField({
      name: "stoneFeatures",
      title: "Feature grid (under the video)",
      type: "array",
      group: "stone",
      of: [
        defineArrayMember({
          type: "object",
          name: "stoneFeature",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", description: 'e.g. "Natural Diamonds"' }),
            defineField({ name: "description", title: "Description", type: "string" }),
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        }),
      ],
      description: "Typically 4 short items, e.g. Natural Diamonds / Lab-Grown Diamonds / IF→FL Transformation / Investment Diamonds.",
      validation: (Rule) => Rule.max(4),
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