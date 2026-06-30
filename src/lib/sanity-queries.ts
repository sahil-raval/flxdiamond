/* ─────────────────────────────────────────
   Shared SEO projection
   ───────────────────────────────────────── */
const SEO_PROJECTION = `
  seo {
    metaTitle,
    metaDescription,
    metaKeywords,
    ogTitle,
    ogDescription,
    "ogImageUrl": ogImage.asset->url,
    twitterCard,
    twitterTitle,
    twitterDescription,
    "twitterImageUrl": twitterImage.asset->url,
    canonicalUrl,
    noIndex,
    structuredDataType,
    additionalJsonLd
  }
`;

/* ─────────────────────────────────────────
   Site Settings
   ───────────────────────────────────────── */
export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  siteName,
  tagline,
  "logoUrl": logo.asset->url,
  logoAlt,
  globalSeo {
    defaultTitle,
    titleSeparator,
    defaultDescription,
    "defaultOgImageUrl": defaultOgImage.asset->url,
    twitterHandle,
    googleSiteVerification,
    bingVerification
  },
  organizationSchema {
    legalName,
    abn,
    foundingYear,
    logoUrl,
    sameAs
  },
  contact {
    email,
    phoneAU,
    phoneIN,
    address,
    googleMapsUrl
  },
  social {
    instagram,
    linkedin,
    facebook,
    twitter,
    youtube
  },
  footerTagline,
  footerNote,
  seoDescription,
  email,
  phones,
  address,
  googleMapsUrl
}`;

/* ─────────────────────────────────────────
   Home Page
   ───────────────────────────────────────── */
export const HOME_PAGE_QUERY = `*[_type == "homePage"][0]{
  ${SEO_PROJECTION},
  heroOverline,
  heroHeading,
  heroSubtext,
  heroCta,
  heroSecondaryCta,
  "heroVideoUrl": heroVideo.asset->url,
  marqueeItems,
  qualifierTagline,
  qualifierHeading,
  qualifierSubtext,
  manufacturingTagline,
  manufacturingHeading,
  manufacturingBody,
  manufacturingCta,
  "manufacturingVideoUrl": manufacturingVideo.asset->url,
  "manufacturingImageUrl": manufacturingImage.asset->url,
  profitSplitHeading,
  profitSplitBody,
  tradePortalTagline,
  tradePortalHeading,
  tradePortalJewellersHeading,
  tradePortalJewellersBody,
  tradePortalHowHeading,
  tradePortalHowBody,
  investmentTagline,
  investmentHeading,
  investmentBody,
  investmentCta,
  investmentPoints,
  noPitchHeading,
  noPitchBody,
  featuredInventoryTagline,
  featuredInventoryHeading,
  featuredInventoryNote,
  whyTagline,
  whyHeading,
  testimonialsTagline,
  testimonialsHeading,
  testimonials,
  closingTagline,
  closingQuote,
  closingCta,
  "closingImageUrl": closingImage.asset->url,
  faqs,
  ctaSectionHeading,
  ctaSectionBody,
  featuredDiamondsSectionHeading,
  featuredDiamondsSectionTagline,
  featuredDiamondsSubtext
}`;

/* ─────────────────────────────────────────
   About Page
   ───────────────────────────────────────── */
export const ABOUT_PAGE_QUERY = `*[_type == "aboutPage"][0]{
  ${SEO_PROJECTION},
  heroTagline,
  heroHeading,
  heroSubtext,
  "craftsman": craftsman {
    name, beganCutting, yearsMastery, primaryCraft, basedIn, biography,
    "photoUrl": photo.asset->url
  },
  techniqueTagline,
  techniqueHeading,
  techniqueIntro,
  techniqueSteps,
  partnerships,
  pillars,
  ctaHeading,
  ctaBody
}`;

/* ─────────────────────────────────────────
   Investment Page
   ───────────────────────────────────────── */
export const INVESTMENT_PAGE_QUERY = `*[_type == "investmentPage"][0]{
  ${SEO_PROJECTION},
  heroTagline,
  heroHeading,
  heroSubtext,
  heroCta,
  heroSecondaryCta,
  "heroImageUrl": heroImage.asset->url,
  assetClassTagline,
  assetClassHeading,
  assetClassPoints,
  rarityTagline,
  rarityHeading,
  rarityBody,
  conversionTagline,
  conversionHeading,
  conversionSteps,
  profitSplitHeading,
  profitSplitBody,
  ctaHeading,
  ctaBody,
  pillars,
  processTagline,
  processHeading,
  processSteps,
  casestudiesTagline,
  casestudiesHeading,
  casestudiesSubtext,
  "galleryImageUrls": galleryImages[].asset->url,
  conversionPanels[]{
    type,
    step,
    tag,
    title,
    body,
    imgAlt,
    "imgUrl": image.asset->url
  }
}`;

export const INVESTMENT_PANELS_QUERY = `*[_type == "investmentPage"][0]{
  "conversionPanels": conversionPanels[]{
    type,
    step,
    tag,
    title,
    body,
    imgAlt,
    "imgUrl": image.asset->url
  }
}`;

/* ─────────────────────────────────────────
   Trade Page
   ───────────────────────────────────────── */
export const TRADE_PAGE_QUERY = `*[_type == "tradePage"][0]{
  ${SEO_PROJECTION},
  heroTagline,
  heroHeading,
  heroSubtext,
  heroCta,
  heroSecondaryCta,
  "heroVideoUrl": heroVideo.asset->url,
  "heroImageUrl": heroImage.asset->url,
  partnerTypesTagline,
  partnerTypesHeading,
  partnerTypes,
  accessTagline,
  accessHeading,
  accessFeatures,
  jewellersHeading,
  jewellersBody,
  ctaHeading,
  ctaBody,
  "galleryImageUrls": galleryImages[].asset->url
}`;

/* ─────────────────────────────────────────
   Contact Page
   ───────────────────────────────────────── */
export const CONTACT_PAGE_QUERY = `*[_type == "contactPage"][0]{
  ${SEO_PROJECTION},
  heroTagline,
  heroHeading,
  heroSubtext,
  formTagline,
  formHeading,
  responsePromise,
  directContactTagline,
  directContactHeading,
  email,
  phones,
  address,
  abn,
  privacyNote
}`;

/* ─────────────────────────────────────────
   Diamonds
   ───────────────────────────────────────── */
export const DIAMONDS_QUERY = `*[_type == "diamond" && available != false] | order(carat desc){
  _id,
  stockId,
  type,
  shape,
  carat,
  color,
  clarity,
  cut,
  polish,
  symmetry,
  fluorescence,
  measurements,
  certification,
  certificateNumber,
  "imageUrl": image.asset->url,
  "images": images[].asset->url,
  "videoUrl": video.asset->url,
  giaReportUrl,
  "giaReportPdfUrl": giaReportPdf.asset->url,
  featured
}`;

export const FEATURED_DIAMONDS_QUERY = `*[_type == "diamond" && featured == true && available != false][0...6] | order(carat desc){
  _id,
  stockId,
  type,
  shape,
  carat,
  color,
  clarity,
  cut,
  polish,
  symmetry,
  fluorescence,
  measurements,
  "imageUrl": image.asset->url,
  certification
}`;

/* ─────────────────────────────────────────
   Journal
   ───────────────────────────────────────── */
export const JOURNAL_ARTICLES_QUERY = `*[_type == "journalArticle"] | order(publishedAt desc){
  _id,
  title,
  slug,
  publishedAt,
  category,
  excerpt,
  "coverImageUrl": coverImage.asset->url,
  featured
}`;

export const JOURNAL_PAGE_QUERY = `*[_type == "journalPage"][0]{
  ${SEO_PROJECTION},
  heroTagline,
  heroHeading,
  heroSubtext,
  "featureVideoUrl": featureVideo.asset->url
}`;

export const FEATURED_ARTICLE_QUERY = `*[_type == "journalArticle" && featured == true] | order(publishedAt desc)[0]{
  _id,
  title,
  slug,
  publishedAt,
  category,
  excerpt,
  "coverImageUrl": coverImage.asset->url,
  body
}`;

export const ARTICLE_BY_SLUG_QUERY = `*[_type == "journalArticle" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  publishedAt,
  category,
  excerpt,
  body,
  "coverImageUrl": coverImage.asset->url,
  ${SEO_PROJECTION}
}`;

/* ─────────────────────────────────────────
   FAQ Categories
   ───────────────────────────────────────── */
export const FAQ_CATEGORIES_QUERY = `*[_type == "faqCategory"] | order(order asc){
  _id,
  label,
  shortLabel,
  order,
  faqs
}`;

/* ─────────────────────────────────────────
   Services
   ───────────────────────────────────────── */
export const SERVICES_QUERY = `*[_type == "service"] | order(order asc){
  _id,
  number,
  label,
  title,
  tagline,
  body,
  qualifies,
  delivers,
  turnaround,
  dark,
  signature
}`;

/* ─────────────────────────────────────────
   Jewellery
   ───────────────────────────────────────── */
export const JEWELLERY_QUERY = `*[_type == "jewelleryCollection" && available != false] | order(order asc){
  _id,
  title,
  description,
  "imageUrl": image.asset->url,
  itemCount
}`;

export const SERVICES_PAGE_QUERY = `*[_type == "servicesPage"][0]{
  ${SEO_PROJECTION},
  heroTagline,
  heroHeading,
  heroSubtext,
  closingTagline,
  closingHeading,
  closingBody
}`;

export const FAQ_PAGE_QUERY = `*[_type == "faqPage"][0]{
  ${SEO_PROJECTION},
  heroTagline,
  heroHeading,
  heroSubtext,
  closingTagline,
  closingHeading,
  closingBody
}`;

export const JEWELLERY_PAGE_QUERY = `*[_type == "jewelleryPage"][0]{
  ${SEO_PROJECTION},
  heroTagline,
  heroHeading,
  heroSubtext
}`;

/* ─────────────────────────────────────────
   IF→FL Case Studies
   ───────────────────────────────────────── */
export const CONVERSION_STONES_QUERY = `*[_type == "conversionStone"] | order(order asc){
  _id,
  stoneId,
  carat,
  colour,
  cut,
  shape,
  before{ grade, label, comment, value, note, "videoUrl": video.asset->url },
  after{ grade, label, comment, value, note, "videoUrl": video.asset->url },
  uplift,
  weeks,
  removed
}`;