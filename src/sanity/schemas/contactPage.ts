import { defineType, defineField } from "sanity";

export default defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  fields: [
    defineField({ name: "seo", title: "SEO", type: "seoObject" }),
    defineField({
      name: "heroTagline",
      title: "Hero Tagline (overline)",
      type: "string",
      initialValue: "Get in Touch",
    }),
    defineField({
      name: "heroHeading",
      title: "Hero Heading",
      type: "string",
      initialValue: "Begin the Conversation.",
    }),
    defineField({
      name: "heroSubtext",
      title: "Hero Subtext",
      type: "text",
      rows: 2,
      initialValue: "We respond to every enquiry personally. Trade partners, investors, and jewellers — all communications are treated as commercially confidential.",
    }),
    defineField({
      name: "formTagline",
      title: "Form Tagline",
      type: "string",
      initialValue: "Send a Message",
    }),
    defineField({
      name: "formHeading",
      title: "Form Heading",
      type: "string",
      initialValue: "We will get back to you within 24 hours.",
    }),
    defineField({
      name: "responsePromise",
      title: "Response Promise",
      type: "string",
      initialValue: "We respond to every serious enquiry within 24 hours.",
    }),
    defineField({
      name: "directContactTagline",
      title: "Direct Contact Tagline",
      type: "string",
      initialValue: "Direct Contact",
    }),
    defineField({
      name: "directContactHeading",
      title: "Direct Contact Heading",
      type: "string",
      initialValue: "Reach us directly.",
    }),
    defineField({
      name: "email",
      title: "Email Address",
      type: "string",
      initialValue: "help@flxdiamond.com",
    }),
    defineField({
      name: "phones",
      title: "Phone Numbers",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "label", type: "string", title: "Label (e.g. Australia)" },
          { name: "value", type: "string", title: "Number" },
          { name: "subtext", type: "string", title: "Subtext (e.g. Mon–Fri 9am–5pm AEST)" },
        ],
        preview: { select: { title: "label", subtitle: "value" } },
      }],
      initialValue: [
        { label: "Australia", value: "0474 817 548", subtext: "Mon–Fri 9am–5pm AEST" },
        { label: "India", value: "+91 99982 17496", subtext: "Available for international enquiries" },
      ],
    }),
    defineField({
      name: "address",
      title: "Business Address",
      type: "string",
      initialValue: "Geelong, Victoria, Australia",
    }),
    defineField({
      name: "abn",
      title: "ABN",
      type: "string",
      initialValue: "43 665 467 274",
    }),
    defineField({
      name: "privacyNote",
      title: "Privacy Note",
      type: "string",
      initialValue: "All enquiries are treated as commercially confidential. No information is shared with third parties.",
    }),
  ],
  preview: { prepare: () => ({ title: "Contact Page" }) },
});
