import { defineType, defineField } from "sanity";

export default defineType({
  name: "jewelleryCollection",
  title: "Jewellery Collection",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Collection Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "image", title: "Collection Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "itemCount", title: "Item Count Label", type: "string", description: 'e.g. "12 Pieces"' }),
    defineField({ name: "available", title: "Available for Enquiry", type: "boolean", initialValue: true }),
    defineField({ name: "order", title: "Display Order", type: "number", initialValue: 10 }),
    defineField({
      name: "seo",
      title: "SEO",
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
    select: { title: "title", subtitle: "itemCount", media: "image" },
  },
});
