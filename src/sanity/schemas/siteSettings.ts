import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "brand",      title: "Brand & Identity",      default: true },
    { name: "seo",        title: "🔍 SEO Defaults"                      },
    { name: "local",      title: "📍 LocalBusiness Schema"              },
    { name: "contact",    title: "📞 Contact & Social"                  },
    { name: "technical",  title: "⚙️  Technical"                        },
  ],
  fields: [

    // ─── BRAND ───────────────────────────────────────────────────────────
    defineField({
      name: "siteName",
      title: "Site Name",
      type: "string",
      group: "brand",
      initialValue: "FLX Diamonds",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "brand",
      initialValue: "Precision Sourcing & IF→FL Conversion",
    }),
    defineField({
      name: "logo",
      title: "Site Logo",
      type: "image",
      group: "brand",
      description: "Used in structured data and email templates.",
      options: { hotspot: false },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string", initialValue: "FLX Diamonds" }),
      ],
    }),

    // ─── SEO DEFAULTS ────────────────────────────────────────────────────
    defineField({
      name: "titleTemplate",
      title: "Title Template",
      type: "string",
      group: "seo",
      description: "Use {title} as a placeholder. e.g. '{title} | FLX Diamonds'",
      initialValue: "{title} | FLX Diamonds",
    }),
    defineField({
      name: "seoDescription",
      title: "Default Meta Description",
      type: "text",
      rows: 3,
      group: "seo",
      description: "Fallback used on any page with no meta description. Keep under 160 characters.",
      initialValue:
        "FLX Diamonds specialises in GIA-certified diamond sourcing and precision IF→FL conversion. Trade-only. Based in Geelong, Australia.",
      validation: (R) =>
        R.max(160).warning("Meta descriptions over 160 characters are truncated by Google."),
    }),
    defineField({
      name: "ogImage",
      title: "Default OG / Social Share Image",
      type: "image",
      group: "seo",
      description: "Fallback image when a page has no OG image set. Recommended: 1200×630px.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          initialValue: "FLX Diamonds — GIA-Certified Diamond Sourcing, Geelong Australia",
        }),
      ],
    }),
    defineField({
      name: "siteUrl",
      title: "Production Site URL",
      type: "url",
      group: "seo",
      description: "No trailing slash. e.g. https://flxdiamond.com.au",
      initialValue: "https://flxdiamond.com.au",
    }),
    defineField({
      name: "twitterHandle",
      title: "Twitter / X Handle",
      type: "string",
      group: "seo",
      description: "Without the @. Used for Twitter Card meta tags.",
    }),

    // ─── LOCALBUSINESS SCHEMA ────────────────────────────────────────────
    defineField({
      name: "businessName",
      title: "Legal / Trading Business Name",
      type: "string",
      group: "local",
      description: "Full name as registered. Used in schema.org structured data.",
      initialValue: "FLX Diamonds",
    }),
    defineField({
      name: "abn",
      title: "ABN",
      type: "string",
      group: "local",
      description: "Australian Business Number. Included in LocalBusiness structured data.",
    }),
    defineField({
      name: "businessType",
      title: "Business Type",
      type: "string",
      group: "local",
      description: "schema.org business type. Controls how Google categorises the listing.",
      options: {
        list: [
          { title: "Jewelry Store",        value: "JewelryStore"        },
          { title: "Local Business",       value: "LocalBusiness"       },
          { title: "Professional Service", value: "ProfessionalService" },
        ],
        layout: "radio",
      },
      initialValue: "JewelryStore",
    }),
    defineField({ name: "foundingYear",   title: "Founding Year",    type: "number", group: "local", initialValue: 1978 }),
    defineField({ name: "streetAddress",  title: "Street Address",   type: "string", group: "local" }),
    defineField({ name: "suburb",         title: "Suburb / City",    type: "string", group: "local", initialValue: "Geelong"  }),
    defineField({ name: "state",          title: "State",            type: "string", group: "local", initialValue: "Victoria" }),
    defineField({ name: "postcode",       title: "Postcode",         type: "string", group: "local" }),
    defineField({ name: "country",        title: "Country Code",     type: "string", group: "local", description: "Two-letter ISO code. e.g. AU", initialValue: "AU" }),
    defineField({ name: "latitude",       title: "Latitude",         type: "number", group: "local", description: "GPS coordinates for schema.org/GeoCoordinates." }),
    defineField({ name: "longitude",      title: "Longitude",        type: "number", group: "local" }),
    defineField({
      name: "openingHours",
      title: "Opening Hours",
      type: "array",
      group: "local",
      description: "Format: 'Mo-Fr 09:00-17:00'. Add one entry per time slot.",
      of: [{ type: "string" }],
      initialValue: ["Mo-Fr 09:00-17:00"],
    }),
    defineField({
      name: "priceRange",
      title: "Price Range Indicator",
      type: "string",
      group: "local",
      description: "schema.org priceRange. Used in local search results.",
      options: { list: ["$", "$$", "$$$", "$$$$"], layout: "radio" },
      initialValue: "$$$$",
    }),

    // ─── CONTACT & SOCIAL ────────────────────────────────────────────────
    defineField({
      name: "email",
      title: "Email Address",
      type: "string",
      group: "contact",
      initialValue: "info@flxdiamond.com",
    }),
    defineField({
      name: "phones",
      title: "Phone Numbers",
      type: "array",
      group: "contact",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Label (e.g. Australia)" },
            { name: "value", type: "string", title: "Number" },
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        },
      ],
      initialValue: [
        { label: "Australia", value: "0474 817 548"    },
        { label: "India",     value: "+91 99982 17496" },
      ],
    }),
    defineField({
      name: "address",
      title: "Display Address",
      type: "string",
      group: "contact",
      description: "Shown on the Contact page. e.g. 'Geelong, VIC, Australia'",
      initialValue: "Geelong, VIC, Australia",
    }),
    defineField({ name: "googleMapsUrl", title: "Google Maps URL", type: "url", group: "contact" }),
    defineField({
      name: "socialProfiles",
      title: "Social Media Profiles",
      type: "array",
      group: "contact",
      description: "Added to schema.org sameAs — helps Google link your social accounts to the business listing.",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "platform",
              type: "string",
              title: "Platform",
              options: { list: ["Instagram", "LinkedIn", "Facebook", "YouTube", "Twitter/X", "Pinterest"] },
            },
            { name: "url", type: "url", title: "Profile URL" },
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        },
      ],
    }),

    // ─── TECHNICAL ───────────────────────────────────────────────────────
    defineField({
      name: "googleSiteVerification",
      title: "Google Search Console Verification Code",
      type: "string",
      group: "technical",
      description: "Paste only the content value from the verification meta tag — not the full tag.",
    }),
    defineField({
      name: "maintenanceMode",
      title: "Maintenance Mode",
      type: "boolean",
      group: "technical",
      description: "Enable to show a maintenance page to all visitors.",
      initialValue: false,
    }),
  ],

  preview: {
    select: { title: "siteName", subtitle: "tagline" },
  },
});
