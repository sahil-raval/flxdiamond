import { useEffect } from "react";

export interface SeoProps {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImageUrl?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  structuredDataType?: string;
  additionalJsonLd?: string;
  /* convenience: default JSON-LD generated from these */
  jsonLdOverride?: object;
  siteName?: string;
}

function setMetaByName(name: string, content: string) {
  if (!content) return;
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setMetaByProperty(property: string, content: string) {
  if (!content) return;
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setOrRemoveJsonLd(json: object | null) {
  let el = document.querySelector<HTMLScriptElement>('script[data-flx="jsonld"]');
  if (!json) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("script");
    el.setAttribute("type", "application/ld+json");
    el.setAttribute("data-flx", "jsonld");
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(json);
}

function setCanonical(url: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
}

function buildAutoJsonLd(
  type: string | undefined,
  title: string | undefined,
  description: string | undefined,
  url: string | undefined,
  imageUrl: string | undefined,
  siteName: string | undefined,
): object | null {
  if (!type || type === "none") return null;
  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": type,
    name: title ?? siteName ?? "FLX Diamonds",
    description: description,
    url: url ?? typeof window !== "undefined" ? window.location.href : undefined,
    image: imageUrl,
  };
  if (type === "Organization" || type === "LocalBusiness") {
    base.address = {
      "@type": "PostalAddress",
      addressLocality: "Geelong",
      addressRegion: "VIC",
      addressCountry: "AU",
    };
  }
  if (type === "WebPage") {
    base.isPartOf = { "@type": "WebSite", name: siteName ?? "FLX Diamonds" };
  }
  return base;
}

export default function SeoHead({
  metaTitle,
  metaDescription,
  metaKeywords,
  ogTitle,
  ogDescription,
  ogImageUrl,
  twitterCard,
  twitterTitle,
  twitterDescription,
  twitterImageUrl,
  canonicalUrl,
  noIndex,
  structuredDataType,
  additionalJsonLd,
  jsonLdOverride,
  siteName,
}: SeoProps) {
  useEffect(() => {
    /* ── Title ── */
    if (metaTitle) {
      document.title = metaTitle;
    }

    /* ── Standard meta ── */
    if (metaDescription) setMetaByName("description", metaDescription);
    if (metaKeywords) setMetaByName("keywords", metaKeywords);

    /* ── Robots ── */
    setMetaByName("robots", noIndex ? "noindex, nofollow" : "index, follow");

    /* ── Open Graph ── */
    const resolvedOgTitle = ogTitle || metaTitle;
    const resolvedOgDesc = ogDescription || metaDescription;
    const resolvedOgImg = ogImageUrl;
    if (resolvedOgTitle) setMetaByProperty("og:title", resolvedOgTitle);
    if (resolvedOgDesc) setMetaByProperty("og:description", resolvedOgDesc);
    if (resolvedOgImg) setMetaByProperty("og:image", resolvedOgImg);
    setMetaByProperty("og:type", "website");
    if (siteName) setMetaByProperty("og:site_name", siteName);

    /* ── Twitter Card ── */
    const resolvedTwCard = twitterCard || "summary_large_image";
    const resolvedTwTitle = twitterTitle || resolvedOgTitle;
    const resolvedTwDesc = twitterDescription || resolvedOgDesc;
    const resolvedTwImg = twitterImageUrl || resolvedOgImg;
    setMetaByName("twitter:card", resolvedTwCard);
    if (resolvedTwTitle) setMetaByName("twitter:title", resolvedTwTitle);
    if (resolvedTwDesc) setMetaByName("twitter:description", resolvedTwDesc);
    if (resolvedTwImg) setMetaByName("twitter:image", resolvedTwImg);

    /* ── Canonical ── */
    if (canonicalUrl) setCanonical(canonicalUrl);

    /* ── JSON-LD ── */
    let jsonLd: object | null = null;
    if (jsonLdOverride) {
      jsonLd = jsonLdOverride;
    } else if (additionalJsonLd) {
      try { jsonLd = JSON.parse(additionalJsonLd); } catch { /* ignore invalid JSON */ }
    } else {
      jsonLd = buildAutoJsonLd(
        structuredDataType,
        metaTitle,
        metaDescription,
        canonicalUrl,
        ogImageUrl,
        siteName,
      );
    }
    setOrRemoveJsonLd(jsonLd);
  }, [
    metaTitle, metaDescription, metaKeywords,
    ogTitle, ogDescription, ogImageUrl,
    twitterCard, twitterTitle, twitterDescription, twitterImageUrl,
    canonicalUrl, noIndex, structuredDataType, additionalJsonLd,
    jsonLdOverride, siteName,
  ]);

  return null;
}
