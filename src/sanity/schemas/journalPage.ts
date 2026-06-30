import { defineType, defineField } from "sanity";

export default defineType({
  name: "journalPage",
  title: "Journal Page",
  type: "document",
  fields: [
    defineField({ name: "seo", title: "SEO", type: "seoObject" }),
    defineField({ name: "heroTagline", title: "Hero Tagline", type: "string", initialValue: "Knowledge & Insight" }),
    defineField({ name: "heroHeading", title: "Hero Heading", type: "string", initialValue: "Journal & Insights." }),
    defineField({ name: "heroSubtext", title: "Hero Subtext", type: "text", rows: 3 }),
    defineField({
      name: "featureVideo",
      title: "Traceability Feature Video",
      type: "file",
      options: { accept: "video/*" },
      description: "Scroll-driven diamond traceability video shown on the Journal page.",
    }),
  ],
  preview: { prepare: () => ({ title: "Journal Page" }) },
});
