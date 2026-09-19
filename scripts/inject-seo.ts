/**
 * FLX Diamonds — Post-build SEO Injection
 *
 * Runs after `vite build`. For each known route, fetches the page's
 * `seo` object (or falls back to siteSettings defaults), clones the
 * built dist/index.html, rewrites <head>, and writes it to
 * dist/<route>/index.html so crawlers and social unfurlers (which
 * don't execute JS) see the real per-page tags in View Source.
 *
 * Run from project root (this happens automatically via the
 * `postbuild` npm script — see package.json):
 *   yarn build
 *
 * Required env vars (same as scripts/seed.ts):
 *   VITE_SANITY_PROJECT_ID
 *   VITE_SANITY_DATASET
 */
import { createClient } from "@sanity/client";
import { config as dotenv } from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { resolve } from "path";

dotenv({ path: resolve(process.cwd(), ".env") });

const projectId = process.env.VITE_SANITY_PROJECT_ID;
const dataset = process.env.VITE_SANITY_DATASET || "production";

if (!projectId) {
  console.error("✖ Missing VITE_SANITY_PROJECT_ID — skipping SEO injection (dist/index.html left as-is).");
  process.exit(0); // don't fail the build if Sanity isn't configured yet
}

const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", useCdn: true });

const DIST_DIR = path.resolve(process.cwd(), "dist");
const TEMPLATE_PATH = path.join(DIST_DIR, "index.html");

/* ── Routes with a real singleton SEO doc in Sanity today ── */
const PAGE_ROUTES: Array<{ path: string; type: string }> = [
  { path: "/", type: "homePage" },
  { path: "/about", type: "aboutPage" },
  { path: "/investment", type: "investmentPage" },
  { path: "/trade", type: "tradePage" },
  { path: "/contact", type: "contactPage" },
];

/* ── Routes with NO seo doc yet — same list as api/sitemap.ts.
   These get siteSettings-level defaults injected (still correct
   and non-generic per-URL canonical/robots) until page-level SEO
   docs are added for them. ── */
const DEFAULT_ROUTES = ["/diamonds", "/jewellery", "/services", "/faq", "/journal", "/privacy", "/terms"];

const SEO_FIELDS = `
  seo {
    metaTitle, metaDescription, metaKeywords,
    ogTitle, ogDescription, "ogImageUrl": coalesce(ogImage.asset->url, ogImageUrl),
    twitterCard, twitterTitle, twitterDescription,
    "twitterImageUrl": twitterImage.asset->url,
    canonicalUrl, noIndex, structuredDataType, additionalJsonLd
  }
`;

async function fetchSiteSettings() {
  return client.fetch(`*[_type == "siteSettings"][0]{
    siteName, tagline, "logoUrl": logo.asset->url,
    titleTemplate, seoDescription, "ogImageUrl": ogImage.asset->url,
    siteUrl, twitterHandle,
    businessName, abn, businessType, foundingYear,
    streetAddress, suburb, state, postcode, country,
    latitude, longitude, openingHours, priceRange,
    email, phones, address, googleMapsUrl,
    socialProfiles, googleSiteVerification
  }`);
}

async function fetchPageSeo(type: string) {
  return client.fetch(`*[_type == $type][0]{ ${SEO_FIELDS} }`, { type });
}

async function fetchJournalRoutes() {
  const articles = await client.fetch(
    `*[_type == "journalArticle" && defined(slug.current)]{
      "path": "/journal/" + slug.current,
      title, excerpt, "coverImageUrl": coverImage.asset->url
    }`
  );
  return (articles || []).map((a: any) => ({
    path: a.path,
    seo: { metaTitle: a.title, metaDescription: a.excerpt, ogImageUrl: a.coverImageUrl },
  }));
}

function escapeHtml(str = "") {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildOrgSchema(s: any) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": s?.businessType || "JewelryStore",
    name: s?.businessName || s?.siteName || "FLX Diamonds",
    url: s?.siteUrl,
  };
  if (s?.logoUrl) schema.logo = s.logoUrl;
  if (s?.email) schema.email = s.email;
  if (s?.phones?.[0]?.value) schema.telephone = s.phones[0].value;
  if (s?.streetAddress || s?.suburb) {
    schema.address = {
      "@type": "PostalAddress",
      streetAddress: s.streetAddress,
      addressLocality: s.suburb,
      addressRegion: s.state,
      postalCode: s.postcode,
      addressCountry: s.country || "AU",
    };
  }
  if (s?.latitude && s?.longitude) {
    schema.geo = { "@type": "GeoCoordinates", latitude: s.latitude, longitude: s.longitude };
  }
  if (s?.openingHours?.length) schema.openingHours = s.openingHours;
  if (s?.priceRange) schema.priceRange = s.priceRange;
  if (s?.foundingYear) schema.foundingDate = String(s.foundingYear);
  const sameAs = (s?.socialProfiles || []).map((p: any) => p.url).filter(Boolean);
  if (sameAs.length) schema.sameAs = sameAs;
  return schema;
}

function buildHead(opts: { html: string; site: any; seo: any; fallbackTitle?: string; routePath: string }) {
  const { html, site, seo, fallbackTitle, routePath } = opts;
  const siteBase = (site?.siteUrl || "").replace(/\/$/, "");

  const rawTitle = seo?.metaTitle || fallbackTitle || site?.siteName || "FLX Diamonds";
  const title = site?.titleTemplate?.includes("{title}")
    ? site.titleTemplate.replace("{title}", rawTitle)
    : rawTitle;
  const description = seo?.metaDescription || site?.seoDescription || "";
  const ogTitle = seo?.ogTitle || rawTitle;
  const ogDescription = seo?.ogDescription || description;
  const ogImage = seo?.ogImageUrl || site?.ogImageUrl || "";
  const twitterTitle = seo?.twitterTitle || ogTitle;
  const twitterDescription = seo?.twitterDescription || ogDescription;
  const twitterImage = seo?.twitterImageUrl || ogImage;
  const canonicalUrl = seo?.canonicalUrl || `${siteBase}${routePath === "/" ? "" : routePath}`;
  const robots = seo?.noIndex ? "noindex, nofollow" : "index, follow";

  let extraSchema = "";
  if (seo?.additionalJsonLd) {
    try {
      JSON.parse(seo.additionalJsonLd);
      extraSchema = `<script type="application/ld+json">${seo.additionalJsonLd}</script>`;
    } catch {
      console.warn(`  ⚠ invalid additionalJsonLd for ${routePath}, skipping`);
    }
  }

  let out = html;
  out = out.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(title)}</title>`);
  out = out.replace(/<meta name="description" content=".*?"\s*\/>/s, `<meta name="description" content="${escapeHtml(description)}" />`);
  out = out.replace(/<meta name="robots" content=".*?"\s*\/>/s, `<meta name="robots" content="${robots}" />`);
  out = out.replace(/<meta property="og:title" content=".*?"\s*\/>/s, `<meta property="og:title" content="${escapeHtml(ogTitle)}" />`);
  out = out.replace(/<meta property="og:description" content=".*?"\s*\/>/s, `<meta property="og:description" content="${escapeHtml(ogDescription)}" />`);
  out = out.replace(/<meta property="og:image" content=".*?"\s*\/>/s, `<meta property="og:image" content="${escapeHtml(ogImage)}" />`);
  out = out.replace(/<meta name="twitter:title" content=".*?"\s*\/>/s, `<meta name="twitter:title" content="${escapeHtml(twitterTitle)}" />`);
  out = out.replace(/<meta name="twitter:description" content=".*?"\s*\/>/s, `<meta name="twitter:description" content="${escapeHtml(twitterDescription)}" />`);
  out = out.replace(/<meta name="twitter:image" content=".*?"\s*\/>/s, `<meta name="twitter:image" content="${escapeHtml(twitterImage)}" />`);

  const inject = `
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
    ${site?.googleSiteVerification ? `<meta name="google-site-verification" content="${escapeHtml(site.googleSiteVerification)}" />` : ""}
    ${site?.twitterHandle ? `<meta name="twitter:site" content="@${escapeHtml(site.twitterHandle)}" />` : ""}
    <script type="application/ld+json">${JSON.stringify(buildOrgSchema(site))}</script>
    ${extraSchema}
  </head>`;
  out = out.replace(/<\/head>/, inject);

  return out;
}

function writeRoute(routePath: string, html: string) {
  const dir = routePath === "/" ? DIST_DIR : path.join(DIST_DIR, routePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html, "utf8");
  console.log(`  ✓ ${routePath === "/" ? "/" : routePath + "/"}`);
}

async function run() {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error("dist/index.html not found — run `vite build` first.");
    process.exit(1);
  }
  const template = fs.readFileSync(TEMPLATE_PATH, "utf8");
  const site = await fetchSiteSettings();

  console.log("Injecting per-route SEO...");

  for (const route of PAGE_ROUTES) {
    const doc = await fetchPageSeo(route.type);
    writeRoute(route.path, buildHead({ html: template, site, seo: doc?.seo, routePath: route.path }));
  }

  for (const routePath of DEFAULT_ROUTES) {
    writeRoute(routePath, buildHead({ html: template, site, seo: null, routePath }));
  }

  const journalRoutes = await fetchJournalRoutes();
  for (const route of journalRoutes) {
    writeRoute(route.path, buildHead({ html: template, site, seo: route.seo, routePath: route.path }));
  }

  console.log(`Done — ${PAGE_ROUTES.length + DEFAULT_ROUTES.length + journalRoutes.length} routes injected.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});