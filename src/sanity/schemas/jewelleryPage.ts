import { defineType, defineField } from "sanity";

export default defineType({
  name: "jewelleryPage",
  title: "Jewellery Page",
  type: "document",
  fields: [
    defineField({ name: "seo", title: "SEO", type: "seoObject" }),
    defineField({ name: "heroTagline", title: "Hero Tagline", type: "string" }),
    defineField({ name: "heroHeading", title: "Hero Heading", type: "string", initialValue: "High Jewellery Collections" }),
    defineField({ name: "heroSubtext", title: "Hero Subtext", type: "text", rows: 3 }),
  ],
  preview: { prepare: () => ({ title: "Jewellery Page" }) },
});
