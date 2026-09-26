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
  "logoAlt": logo.alt,
  titleTemplate,
  siteUrl,
  twitterHandle,
  googleSiteVerification



  footerTagline,
  footerNote,
  seoDescription,
  email,
  phones,
  address,
  googleMapsUrl,
  socialProfiles[]{ platform, url }
}`;

/* ─────────────────────────────────────────
   Home Page
   ───────────────────────────────────────── */
export const HOME_PAGE_QUERY = `*[_type == "homePage"][0]{
  seo {
    metaTitle, metaDescription, metaKeywords,
    ogTitle, ogDescription, ogImageUrl,
    twitterCard, noIndex, structuredDataType, additionalJsonLd
  },
  heroOverline,
  heroHeading,
  heroSubtext,
  heroCta,
  heroSecondaryCta,
  heroVideoUrl,
  marqueeItems,
  signalStripItems,
  clientLogos,
  qualifierTagline,
  qualifierHeading,
  qualifierSubtext,
  qualifierCards,
  qualifierAnswerLabel,
  qualifierAnswerQuote,
  featuredInventoryTagline,
  featuredInventoryHeading,
  featuredInventoryNote,
  viewAllStonesText,
  services,
  manufacturingTagline,
  manufacturingHeading,
  manufacturingBody,

  processBadges,
  processCta,
  fourCs,
  featureVideoUrl,
  iftflTagline,
  iftflHeading,
  iftflBody,
  iftflCtaPrimary,
  iftflCtaSecondary,
  whyTagline,
  whyHeading,
  whyCards,
  tradePortalTagline,
  tradePortalHeading,
  tradePortalJewellersHeading,
  tradePortalJewellersBody,
  tradePortalJewellersCta,
  tradePortalHowHeading,
  tradePortalHowBody,
  tradePortalHowCta,
  investmentTagline,
  investmentHeading,
  investmentBody,
  investmentCta,
  investmentPoints,
  testimonialsTagline,
  testimonialsHeading,
  testimonials,
  testimonialsNote,
  faqs,
  faqSectionTagline,
  faqSectionHeading,
  faqClosingCta,
  noPitchHeading,
  noPitchBody,
  noPitchButtons,
  ctaSectionHeading,
  ctaSectionBody
}`;

/* ─────────────────────────────────────────
   About Page
   ───────────────────────────────────────── */
// Replace the existing ABOUT_PAGE_QUERY export in your lib/sanity-queries.ts with
// this one. It projects every field the rewritten About.tsx reads. Every image
// field is projected as a nested { url, alt } object so alt text is genuinely
// editable content from Sanity, not hardcoded in the component.
//
// If your project's SEO fields are on a shared object type, this assumes the
// projection shape (metaTitle, metaDescription, ogImage.asset->url, etc.) already
// matches what the rest of your site queries — adjust the `seo{...}` block below
// if yours differs.

export const ABOUT_PAGE_QUERY = `*[_type == "aboutPage"][0]{
  seo{
    metaTitle,
    metaDescription,
    metaKeywords,
    ogTitle,
    ogDescription,
    "ogImageUrl": ogImage.asset->url,
    twitterCard,
    noIndex,
    structuredDataType,
    additionalJsonLd
  },

  heroHeadingLead,
  heroHeadingBold,
  heroSubtextLines,
  "heroPhotos": heroPhotos[]{
    "url": asset->url,
    alt
  },

  beginningEyebrow,
  beginningHeading,
  beginningBody,
  "beginningImage": {
    "url": beginningImage.asset->url,
    "alt": beginningImage.alt
  },
  originStats[]{
    value,
    label
  },

  learningHeadingLead,
  learningHeadingBold,
  learningBody,
  "learningImage": {
    "url": learningImage.asset->url,
    "alt": learningImage.alt
  },
  learningCaption,
  "learningPortrait": {
    "url": learningPortrait.asset->url,
    "alt": learningPortrait.alt
  },

  trustHeadingLead,
  trustHeadingBold,
  trustSubtext,
  "trustBackgroundImage": {
    "url": trustBackgroundImage.asset->url
  },
  "trustPhoto": {
    "url": trustPhoto.asset->url,
    "alt": trustPhoto.alt
  },
  trustCardHeading,
  trustCardBody,

  stoneHeadingLead,
  stoneHeadingBold,
  stoneSubtext,
  "stoneVideoPoster": {
    "url": stoneVideoPoster.asset->url,
    "alt": stoneVideoPoster.alt
  },
  "stoneVideo": {
    "url": stoneVideo.asset->url
  },
  stoneVideoUrl,
  stoneFeatures[]{
    title,
    description
  },

  trustedHeadingLead,
  trustedHeadingBold,
  trustedCountries[]{
    country,
    label,
    flagEmoji
  }
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
  opportunityTagline,
  opportunityHeading,
  opportunityBody1,
  opportunityBody2,
  opportunityStats,
  opportunityDisclaimer,
  pillars, 
  ctaButtonPrimary,
  ctaButtonSecondary,
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
  processTagline,
  processHeading,
  processSteps,
  jewellersHeading,
  jewellersBody,
  ctaHeading,
  ctaBody,
  ctaBody
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
  featured,
  "rap": rapPrice,
  "listedDisc": discountPercent,
  "listedPrCt": pricePerCarat,
  "listedAmt": totalPrice,
  "tableP": tablePercent,
  "depth": depthPercent,
  "ca": crownAngle,
  "pa": pavilionAngle,
  "ratio": lengthWidthRatio,
  origin,
  "ha": heartsAndArrows,
  shade,
  "loc": location
}`;
export const DIAMONDS_PAGE_QUERY = `*[_type == "diamondsPage"][0]{
  ${SEO_PROJECTION},
  heroTagline,
  heroHeading,
  heroSubtext,
  tabLabelNatural,
  tabLabelLab,
  tabLabelLoose,
  tabLabelCustom,
  trustStripItems,
  looseTrustStripItems,
  looseBannerHeading,
  looseBannerBody,
  customTagline,
  customHeading,
  customBody,
  customCtaPrimary,
  customCtaSecondary
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
  closingBody,
  ctaButtonPrimary,
  ctaButtonSecondary,
  trustTags
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