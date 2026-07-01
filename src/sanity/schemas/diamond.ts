import { defineType, defineField } from "sanity";

export default defineType({
  name: "diamond",
  title: "Diamond",
  type: "document",
  fields: [
    defineField({
      name: "stockId",
      title: "Stock ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "type",
      title: "Diamond Type",
      type: "string",
      options: {
        list: [
          { title: "Natural", value: "natural" },
          { title: "Lab Grown", value: "lab" },
          { title: "Loose (Uncertified)", value: "loose" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shape",
      title: "Shape",
      type: "string",
      options: {
        list: [
          "Round", "Oval", "Princess", "Cushion", "Emerald",
          "Pear", "Marquise", "Radiant", "Asscher", "Heart", "Triangle",
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "carat", title: "Carat Weight", type: "number", validation: (Rule) => Rule.required().min(0) }),
    defineField({
      name: "color",
      title: "Colour Grade",
      type: "string",
      options: { list: ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M"] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "clarity",
      title: "Clarity Grade",
      type: "string",
      options: { list: ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1", "I2", "I3"] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "cut",
      title: "Cut Grade",
      type: "string",
      options: { list: ["Ideal", "Excellent", "Very Good", "Good", "Fair"] },
    }),
    defineField({
      name: "polish",
      title: "Polish",
      type: "string",
      options: { list: ["Excellent", "Very Good", "Good", "Fair"] },
    }),
    defineField({
      name: "symmetry",
      title: "Symmetry",
      type: "string",
      options: { list: ["Excellent", "Very Good", "Good", "Fair"] },
    }),
    defineField({
      name: "fluorescence",
      title: "Fluorescence",
      type: "string",
      options: { list: ["None", "Faint", "Medium", "Strong", "Very Strong", "BGM"] },
    }),
    defineField({
      name: "measurements",
      title: "Measurements",
      type: "string",
      description: "e.g. 7.35×7.38×4.52 mm",
    }),
    defineField({
      name: "certification",
      title: "Certification",
      type: "string",
      options: {
        list: [
          { title: "GIA", value: "GIA" },
          { title: "IGI", value: "IGI" },
          { title: "No Certificate", value: "None" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "certificateNumber",
      title: "Certificate Number",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Diamond Image",
      type: "image",
      options: { hotspot: true },
      description: "Primary stone photo — shown in the inventory grid and quick-view panel.",
    }),
    defineField({
      name: "images",
      title: "Additional Images",
      type: "array",
      description: "Extra angles, inclusions close-ups, etc.",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "alt", type: "string", title: "Alt Text" }],
        },
      ],
    }),
    defineField({
      name: "video",
      title: "360° / Detail Video",
      type: "file",
      description: "Short MP4 video loop showing the stone. Shown in the quick-view panel.",
      options: { accept: "video/mp4,video/webm" },
    }),
    defineField({
      name: "giaReportUrl",
      title: "GIA Report URL",
      type: "url",
      description: "Link to the GIA report page, e.g. https://www.gia.edu/report-check?reportno=123456789",
    }),
    defineField({
      name: "giaReportPdf",
      title: "GIA Report PDF",
      type: "file",
      description: "Upload the GIA report PDF directly.",
      options: { accept: "application/pdf" },
    }),
    defineField({
      name: "tradePrice",
      title: "Trade Price (AUD)",
      type: "number",
      description: "Optional — for internal reference only. Never shown publicly.",
    }),
    defineField({
      name: "notes",
      title: "Internal Notes",
      type: "text",
      rows: 3,
      description: "Private notes about this stone — visible only in the Studio.",
    }),
    defineField({
      name: "available",
      title: "Available for Enquiry",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "featured",
      title: "Feature on Home Page",
      type: "boolean",
      initialValue: false,
    }),
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
    { title: "Featured first", name: "featuredFirst", by: [{ field: "featured", direction: "desc" }, { field: "carat", direction: "desc" }] },
    { title: "Carat (highest first)", name: "caratDesc", by: [{ field: "carat", direction: "desc" }] },
    { title: "Carat (lowest first)", name: "caratAsc", by: [{ field: "carat", direction: "asc" }] },
    { title: "Stock ID", name: "stockId", by: [{ field: "stockId", direction: "asc" }] },
  ],
  preview: {
    select: {
      title: "stockId",
      subtitle: "shape",
      carat: "carat",
      clarity: "clarity",
      color: "color",
      media: "image",
      featured: "featured",
    },
    prepare({ title, subtitle, carat, clarity, color, media, featured }) {
      return {
        title: `${featured ? "⭐ " : ""}${title}`,
        subtitle: `${subtitle} · ${carat}ct · ${color} ${clarity}${featured ? " · Featured on Home" : ""}`,
        media,
      };
    },
  },
});