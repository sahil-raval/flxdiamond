import { defineType, defineField } from "sanity";

export default defineType({
  name: "servicesPage",
  title: "Services Page",
  type: "document",
  fields: [
    defineField({ name: "seo", title: "SEO", type: "seoObject" }),
    defineField({ name: "heroTagline", title: "Hero Tagline", type: "string", initialValue: "What We Do" }),
    defineField({ name: "heroHeading", title: "Hero Heading", type: "string", initialValue: "Four services. One standard." }),
    defineField({ name: "heroSubtext", title: "Hero Subtext", type: "text", rows: 3 }),
    defineField({ name: "closingTagline", title: "Closing Tagline", type: "string", initialValue: "All Enquiries" }),
    defineField({ name: "closingHeading", title: "Closing Heading", type: "string" }),
    defineField({ name: "closingBody", title: "Closing Body", type: "text", rows: 2 }),
    defineField({
      name: "ctaButtonPrimary",
      title: "Closing CTA — Primary Button",
      type: "string",
      initialValue: "Begin the Conversation",
    }),
    defineField({
      name: "ctaButtonSecondary",
      title: "Closing CTA — Secondary Button",
      type: "string",
      initialValue: "Common Questions",
    }),
    defineField({
      name: "trustTags",
      title: "Trust Tag Row",
      description: "Short badges shown under the closing CTA buttons, e.g. 'GIA Certified'.",
      type: "array",
      of: [{ type: "string" }],
      initialValue: ["B2B Only", "47 Years Mastery", "GIA Certified", "Commercial Confidence"],
    }),
  ],
  preview: { prepare: () => ({ title: "Services Page" }) },
});