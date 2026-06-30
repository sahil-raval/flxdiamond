import { defineType, defineField } from "sanity";

const stoneStateFields = (prefix: string) => [
  { name: "grade", type: "string" as const, title: `${prefix} Grade` },
  { name: "label", type: "string" as const, title: `${prefix} Grade Label` },
  { name: "comment", type: "string" as const, title: `${prefix} GIA Comment` },
  { name: "value", type: "string" as const, title: `${prefix} Appraised Value` },
  { name: "note", type: "text" as const, title: `${prefix} Note`, rows: 3 },
  { name: "video", type: "file" as const, title: `${prefix} Video`, options: { accept: "video/*" } },
];

export default defineType({
  name: "conversionStone",
  title: "IF→FL Case Study",
  type: "document",
  fields: [
    defineField({ name: "stoneId", title: "Stone ID", type: "string", description: 'e.g. "FLX–001"' }),
    defineField({ name: "carat", title: "Carat", type: "string", description: 'e.g. "1.52 ct"' }),
    defineField({ name: "colour", title: "Colour Grade", type: "string" }),
    defineField({ name: "cut", title: "Cut", type: "string" }),
    defineField({ name: "shape", title: "Shape", type: "string" }),
    defineField({
      name: "before",
      title: "Before Conversion",
      type: "object",
      fields: stoneStateFields("Before"),
    }),
    defineField({
      name: "after",
      title: "After Conversion",
      type: "object",
      fields: stoneStateFields("After"),
    }),
    defineField({ name: "uplift", title: "Value Uplift", type: "string", description: 'e.g. "+37.5%"' }),
    defineField({ name: "weeks", title: "Turnaround", type: "string", description: 'e.g. "6 weeks"' }),
    defineField({ name: "removed", title: "Characteristic Removed", type: "string" }),
    defineField({ name: "order", title: "Display Order", type: "number", initialValue: 10 }),
  ],
  orderings: [
    { title: "Display Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "stoneId", subtitle: "uplift" },
    prepare({ title, subtitle }) {
      return { title: title || "Unnamed Stone", subtitle: `Uplift: ${subtitle}` };
    },
  },
});
