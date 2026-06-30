import { defineType, defineField } from "sanity";

export default defineType({
  name: "seoObject",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      description: "60–70 characters. Overrides the default site title for this page.",
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
      description: "150–160 characters. Shown in Google search results.",
    }),
    defineField({
      name: "metaKeywords",
      title: "Keywords",
      type: "string",
      description: "Comma-separated. e.g. GIA diamonds, IF to FL conversion, trade diamonds",
    }),
    defineField({
      name: "ogTitle",
      title: "Open Graph Title",
      type: "string",
      description: "Title for Facebook/LinkedIn share. Defaults to Meta Title if blank.",
    }),
    defineField({
      name: "ogDescription",
      title: "Open Graph Description",
      type: "text",
      rows: 2,
      description: "Description for social sharing. Defaults to Meta Description if blank.",
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph Image",
      type: "image",
      description: "1200×630px recommended. Used when sharing on social media.",
      options: { hotspot: true },
    }),
    defineField({
      name: "twitterCard",
      title: "Twitter Card Type",
      type: "string",
      options: {
        list: [
          { title: "Summary with Large Image", value: "summary_large_image" },
          { title: "Summary", value: "summary" },
        ],
        layout: "radio",
      },
      initialValue: "summary_large_image",
    }),
    defineField({
      name: "twitterTitle",
      title: "Twitter Title",
      type: "string",
      description: "Defaults to OG Title or Meta Title if blank.",
    }),
    defineField({
      name: "twitterDescription",
      title: "Twitter Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "twitterImage",
      title: "Twitter Image",
      type: "image",
      description: "Defaults to OG Image if blank.",
      options: { hotspot: true },
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL",
      type: "url",
      description: "Full URL. Only set if this page duplicates content elsewhere.",
    }),
    defineField({
      name: "noIndex",
      title: "Exclude from Search Engines",
      type: "boolean",
      description: "When enabled, adds noindex tag — use for login, thank-you pages etc.",
      initialValue: false,
    }),
    defineField({
      name: "structuredDataType",
      title: "Structured Data Type (JSON-LD)",
      type: "string",
      options: {
        list: [
          { title: "None", value: "none" },
          { title: "Organization", value: "Organization" },
          { title: "WebPage", value: "WebPage" },
          { title: "Product", value: "Product" },
          { title: "Service", value: "Service" },
          { title: "LocalBusiness", value: "LocalBusiness" },
          { title: "Article", value: "Article" },
          { title: "FAQPage", value: "FAQPage" },
        ],
        layout: "dropdown",
      },
      initialValue: "none",
    }),
    defineField({
      name: "additionalJsonLd",
      title: "Custom JSON-LD",
      type: "text",
      rows: 6,
      description: "Raw JSON-LD object. Advanced users only. Must be valid JSON.",
    }),
  ],
});
