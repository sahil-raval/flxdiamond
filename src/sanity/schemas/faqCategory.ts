import { defineType, defineField } from "sanity";

export default defineType({
  name: "faqCategory",
  title: "FAQ Category",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Category Label (Full)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortLabel",
      title: "Short Label (for tabs)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first",
      initialValue: 10,
    }),
    defineField({
      name: "faqs",
      title: "Questions & Answers",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "q", type: "string", title: "Question", validation: (Rule) => Rule.required() },
            { name: "a", type: "text", title: "Answer", rows: 5, validation: (Rule) => Rule.required() },
          ],
          preview: { select: { title: "q" } },
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "seo",
      title: "SEO (for FAQ page)",
      type: "object",
      fields: [
        { name: "title", type: "string", title: "Page Title" },
        { name: "description", type: "text", title: "Meta Description", rows: 3 },
      ],
    }),
  ],
  orderings: [
    { title: "Display Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "label", count: "faqs" },
    prepare({ title, count }) {
      return { title, subtitle: `${Array.isArray(count) ? count.length : 0} questions` };
    },
  },
});
