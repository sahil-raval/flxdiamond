import { defineType, defineField } from "sanity";

const API_VERSION = "2024-01-01";

export const SHAPES = [
  "Round", "Oval", "Princess", "Cushion", "Emerald",
  "Pear", "Marquise", "Radiant", "Asscher", "Heart", "Triangle",
];
export const COLORS = ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
export const CLARITIES = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1", "I2", "I3"];
export const CUTS = ["Ideal", "Excellent", "Very Good", "Good", "Fair"];
export const FINISH_GRADES = ["Excellent", "Very Good", "Good", "Fair"];
export const FLUORESCENCE = ["None", "Faint", "Medium", "Strong", "Very Strong", "BGM"];

export default defineType({
  name: "diamond",
  title: "Diamond",
  type: "document",
  groups: [
    { name: "trade", title: "Trade Data" },
    { name: "internal", title: "Internal" },
  ],
  fields: [
    defineField({
      name: "stockId",
      title: "Stock ID",
      type: "string",
      description: "Must be unique. The CSV importer uses this to match and update existing stones.",
      validation: (Rule) =>
        Rule.required().custom(async (value, context) => {
          if (!value) return true;
          const id = (context.document?._id ?? "").replace(/^drafts\./, "");
          const client = context.getClient({ apiVersion: API_VERSION });
          const count = await client.fetch<number>(
            `count(*[_type == "diamond" && stockId == $stockId && !(_id in [$id, $draftId])])`,
            { stockId: value.trim(), id, draftId: `drafts.${id}` },
          );
          return count === 0 || "Another diamond already uses this Stock ID";
        }),
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
      options: { list: SHAPES },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "carat",
      title: "Carat Weight",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "color",
      title: "Colour Grade",
      type: "string",
      options: { list: COLORS },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "clarity",
      title: "Clarity Grade",
      type: "string",
      options: { list: CLARITIES },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "cut", title: "Cut Grade", type: "string", options: { list: CUTS } }),
    defineField({ name: "polish", title: "Polish", type: "string", options: { list: FINISH_GRADES } }),
    defineField({ name: "symmetry", title: "Symmetry", type: "string", options: { list: FINISH_GRADES } }),
    defineField({ name: "fluorescence", title: "Fluorescence", type: "string", options: { list: FLUORESCENCE } }),
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
      initialValue: "None",
    }),
    defineField({ name: "certificateNumber", title: "Certificate Number", type: "string" }),

    /* ── Trade Data ── */
    defineField({ name: "tablePercent", title: "Table %", type: "number", group: "trade" }),
    defineField({ name: "depthPercent", title: "Depth %", type: "number", group: "trade" }),
    defineField({ name: "crownAngle", title: "Crown Angle (°)", type: "number", group: "trade" }),
    defineField({ name: "pavilionAngle", title: "Pavilion Angle (°)", type: "number", group: "trade" }),
    defineField({ name: "lengthWidthRatio", title: "Length/Width Ratio", type: "number", group: "trade" }),
    defineField({
      name: "origin",
      title: "Origin",
      type: "string",
      description: "e.g. Botswana, India, Lab (IGI)",
      group: "trade",
    }),
    defineField({
      name: "heartsAndArrows",
      title: "Hearts & Arrows",
      type: "string",
      options: { list: [{ title: "Yes", value: "Y" }, { title: "No", value: "N" }], layout: "radio" },
      group: "trade",
    }),
    defineField({
      name: "shade",
      title: "Shade",
      type: "string",
      description: "e.g. Brownish, Greenish — leave blank if none",
      group: "trade",
    }),
    defineField({
      name: "location",
      title: "Stone Location",
      type: "string",
      description: "Physical location, e.g. Mumbai, Antwerp",
      group: "trade",
    }),

    /* ── Media ── */
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
      description: "Extra angles, inclusion close-ups, etc.",
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
      description: "Short MP4 loop of the stone. Shown in the quick-view panel.",
      options: { accept: "video/mp4,video/webm" },
    }),
    defineField({
      name: "giaReportUrl",
      title: "GIA Report URL",
      type: "url",
      description: "e.g. https://www.gia.edu/report-check?reportno=123456789",
    }),
    defineField({
      name: "giaReportPdf",
      title: "GIA Report PDF",
      type: "file",
      options: { accept: "application/pdf" },
    }),

    /* ── Internal ── */
    defineField({
      name: "notes",
      title: "Internal Notes",
      type: "text",
      rows: 3,
      group: "internal",
      description:
        "Not displayed on the website. If the dataset is public, this text can still be read through the Sanity API.",
    }),
    defineField({
      name: "available",
      title: "Available for Enquiry",
      type: "boolean",
      description: "Turn off to hide this stone from the website.",
      initialValue: true,
    }),
    defineField({
      name: "featured",
      title: "Feature on Home Page",
      type: "boolean",
      description: "Featured stones are also listed first on the Diamonds page.",
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
      shape: "shape",
      carat: "carat",
      clarity: "clarity",
      color: "color",
      media: "image",
      featured: "featured",
      available: "available",
    },
    prepare({ title, shape, carat, clarity, color, media, featured, available }) {
      const parts = [
        shape || "No shape",
        typeof carat === "number" ? `${carat}ct` : "No carat",
        [color, clarity].filter(Boolean).join(" ") || "Ungraded",
      ];
      if (featured) parts.push("Featured on Home");
      if (available === false) parts.push("Hidden");
      return {
        title: `${featured ? "⭐ " : ""}${title || "Untitled diamond"}`,
        subtitle: parts.join(" · "),
        media,
      };
    },
  },
});