import { defineType, defineField } from "sanity";

export default defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Controls the order services appear on the page (1, 2, 3, 4 ...).",
    }),
    defineField({
      name: "number",
      title: "Number Badge",
      type: "string",
      description: 'Shown as the big index, e.g. "01".',
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: 'Short label, e.g. "Natural Diamonds".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "text",
      rows: 2,
      description: "Large heading. Use a line break to control wrapping.",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "body",
      title: "Body Paragraphs",
      type: "array",
      of: [{ type: "text" }],
      description: "One entry per paragraph.",
    }),
    defineField({
      name: "qualifies",
      title: "Who This Is For",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "delivers",
      title: "What We Deliver",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "turnaround",
      title: "Turnaround",
      type: "string",
    }),
    defineField({
      name: "dark",
      title: "Dark Background",
      type: "boolean",
      description: "Use the dark (navy) background for this service block.",
      initialValue: false,
    }),
    defineField({
      name: "signature",
      title: "House Signature",
      type: "boolean",
      description: "Mark as the featured / signature service (e.g. IF → FL).",
      initialValue: false,
    }),
    defineField({ name: "seo", title: "SEO", type: "seoObject" }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "label", subtitle: "number" },
  },
});