// import { useEffect } from "react";

// export type SEOData = {
//   title?: string;
//   description?: string;
//   ogImage?: string;
//   ogType?: string;
//   canonical?: string;
//   jsonLd?: Record<string, unknown> | Record<string, unknown>[];
//   /** Robots directive override, e.g. "noindex, nofollow" */
//   robots?: string;
// };

// const DEFAULTS = {
//   title: "FLX Diamonds — Precision Sourcing & IF→FL Conversion",
//   description:
//     "FLX Diamonds specialises in GIA-certified diamond sourcing and precision IF→FL conversion. Trade-only. Based in Geelong, Australia.",
//   ogImage: "/opengraph.jpg",
//   ogType: "website",
//   robots: "index, follow",
// };

// function upsertMeta(attr: "name" | "property", key: string, value: string) {
//   let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
//   if (!el) {
//     el = document.createElement("meta");
//     el.setAttribute(attr, key);
//     document.head.appendChild(el);
//   }
//   el.setAttribute("content", value);
// }

// function upsertLink(rel: string, href: string) {
//   let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
//   if (!el) {
//     el = document.createElement("link");
//     el.setAttribute("rel", rel);
//     document.head.appendChild(el);
//   }
//   el.setAttribute("href", href);
// }

// const JSONLD_ID = "flx-jsonld";

// export function useSEO(seo?: SEOData | null) {
//   useEffect(() => {
//     const title = seo?.title || DEFAULTS.title;
//     const description = seo?.description || DEFAULTS.description;
//     const ogImage = seo?.ogImage || DEFAULTS.ogImage;
//     const ogType = seo?.ogType || DEFAULTS.ogType;
//     const robots = seo?.robots || DEFAULTS.robots;

//     document.title = title;
//     upsertMeta("name", "description", description);
//     upsertMeta("name", "robots", robots);

//     upsertMeta("property", "og:title", title);
//     upsertMeta("property", "og:description", description);
//     upsertMeta("property", "og:image", ogImage);
//     upsertMeta("property", "og:type", ogType);
//     upsertMeta("property", "og:site_name", "FLX Diamonds");

//     upsertMeta("name", "twitter:card", "summary_large_image");
//     upsertMeta("name", "twitter:title", title);
//     upsertMeta("name", "twitter:description", description);
//     upsertMeta("name", "twitter:image", ogImage);

//     const canonical =
//       seo?.canonical ||
//       (typeof window !== "undefined" ? window.location.href.split("?")[0] : "");
//     if (canonical) {
//       upsertLink("canonical", canonical);
//       upsertMeta("property", "og:url", canonical);
//     }

//     // JSON-LD structured data
//     const existing = document.getElementById(JSONLD_ID);
//     if (existing) existing.remove();
//     if (seo?.jsonLd) {
//       const script = document.createElement("script");
//       script.id = JSONLD_ID;
//       script.type = "application/ld+json";
//       script.text = JSON.stringify(seo.jsonLd);
//       document.head.appendChild(script);
//     }
//   }, [
//     seo?.title,
//     seo?.description,
//     seo?.ogImage,
//     seo?.ogType,
//     seo?.canonical,
//     seo?.robots,
//     JSON.stringify(seo?.jsonLd ?? null),
//   ]);
// }

// /** Build an Organization JSON-LD object using site settings. */
// export function organizationJsonLd(settings?: {
//   siteName?: string;
//   seoDescription?: string;
//   email?: string;
//   phones?: { label: string; value: string }[];
//   address?: string;
//   googleMapsUrl?: string;
// }) {
//   return {
//     "@context": "https://schema.org",
//     "@type": "Organization",
//     name: settings?.siteName || "FLX Diamonds",
//     description:
//       settings?.seoDescription ||
//       "GIA-certified diamond sourcing and IF→FL precision conversion.",
//     email: settings?.email,
//     telephone: settings?.phones?.[0]?.value,
//     address: settings?.address
//       ? { "@type": "PostalAddress", streetAddress: settings.address }
//       : undefined,
//     url: typeof window !== "undefined" ? window.location.origin : undefined,
//     sameAs: settings?.googleMapsUrl ? [settings.googleMapsUrl] : undefined,
//   };
// }

// /** Build a Product JSON-LD object for a diamond listing. */
// export function diamondJsonLd(d: {
//   stockId?: string;
//   shape?: string;
//   carat?: number;
//   color?: string;
//   clarity?: string;
//   cut?: string;
//   certification?: string;
//   imageUrl?: string;
// }) {
//   return {
//     "@context": "https://schema.org",
//     "@type": "Product",
//     name: `${d.shape} ${d.carat}ct ${d.color} ${d.clarity}`,
//     sku: d.stockId,
//     image: d.imageUrl,
//     description: `${d.certification || "GIA"}-graded ${d.shape} cut diamond, ${d.carat}ct, color ${d.color}, clarity ${d.clarity}, cut ${d.cut || ""}.`,
//     brand: { "@type": "Brand", name: "FLX Diamonds" },
//   };
// }
