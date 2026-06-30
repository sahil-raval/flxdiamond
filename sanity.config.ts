// sanity.config.ts
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemas";
import { csvImportPlugin } from "./src/sanity/plugins/csvImports";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID as string;
const dataset   = (import.meta.env.VITE_SANITY_DATASET as string) || "production";

export default defineConfig({
  projectId: projectId || "placeholder",
  dataset,
  title: "FLX Diamonds CMS",
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("FLX Diamonds")
          .items([

            // ── SETTINGS ───────────────────────────────────────────────────
            S.listItem()
              .title("⚙️  Site Settings & SEO")
              .id("siteSettings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
                  .title("Site Settings")
              ),

            S.divider(),

            // ── PAGES ───────────────────────────────────────────────────────
            S.listItem()
              .title("Pages")
              .child(
                S.list()
                  .title("Pages")
                  .items([
                    S.listItem()
                      .title("🏠  Home Page")
                      .id("homePage")
                      .child(
                        S.document()
                          .schemaType("homePage")
                          .documentId("homePage")
                          .title("Home Page")
                      ),
                    S.listItem()
                      .title("👤  About Page")
                      .id("aboutPage")
                      .child(
                        S.document()
                          .schemaType("aboutPage")
                          .documentId("aboutPage")
                          .title("About Page")
                      ),
                    S.listItem()
                      .title("💎  Investment Page")
                      .id("investmentPage")
                      .child(
                        S.document()
                          .schemaType("investmentPage")
                          .documentId("investmentPage")
                          .title("Investment Page")
                      ),
                    S.listItem()
                      .title("🤝  Trade Page")
                      .id("tradePage")
                      .child(
                        S.document()
                          .schemaType("tradePage")
                          .documentId("tradePage")
                          .title("Trade Page")
                      ),
                    S.listItem()
                      .title("✉️  Contact Page")
                      .id("contactPage")
                      .child(
                        S.document()
                          .schemaType("contactPage")
                          .documentId("contactPage")
                          .title("Contact Page")
                      ),
                    S.listItem()
                      .title("🔧  Services Page")
                      .id("servicesPage")
                      .child(
                        S.document()
                          .schemaType("servicesPage")
                          .documentId("servicesPage")
                          .title("Services Page")
                      ),
                    S.listItem()
                      .title("❓  FAQ Page")
                      .id("faqPage")
                      .child(
                        S.document()
                          .schemaType("faqPage")
                          .documentId("faqPage")
                          .title("FAQ Page")
                      ),
                    S.listItem()
                      .title("💍  Jewellery Page")
                      .id("jewelleryPage")
                      .child(
                        S.document()
                          .schemaType("jewelleryPage")
                          .documentId("jewelleryPage")
                          .title("Jewellery Page")
                      ),
                    S.listItem()
                      .title("📰  Journal Page")
                      .id("journalPage")
                      .child(
                        S.document()
                          .schemaType("journalPage")
                          .documentId("journalPage")
                          .title("Journal Page")
                      ),
                  ])
              ),

            S.divider(),

            // ── CONTENT ─────────────────────────────────────────────────────
            S.documentTypeListItem("diamond")
              .title("💍  Diamonds"),

            S.documentTypeListItem("journalArticle")
              .title("📰  Journal Articles"),

            S.documentTypeListItem("faqCategory")
              .title("❓  FAQ Categories"),

            S.documentTypeListItem("service")
              .title("🔧  Services"),

            S.documentTypeListItem("conversionStone")
              .title("🔬  IF→FL Case Studies"),

            S.documentTypeListItem("jewelleryCollection")
              .title("💍  Jewellery Collections"),
          ]),
    }),

    visionTool(),
    csvImportPlugin(),
  ],

  schema: {
    types: schemaTypes,
  },
});