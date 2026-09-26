import { useState } from "react";
import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";
import { useSanityQuery } from "@/lib/useSanityData";
import { isSanityConfigured } from "@/lib/sanity";
import { ABOUT_PAGE_QUERY } from "@/lib/sanity-queries";
import SeoHead from "@/components/SeoHead";
import {
  MAP_WIDTH,
  MAP_HEIGHT,
  MAP_GRAY_DOTS,
  MAP_ACCENT_DOTS,
  COUNTRY_LOOKUP,
  DEFAULT_TRUSTED_COUNTRIES,
} from "@/lib/worldMapDots";

// Served straight from /public — no bundler import needed, just the root-relative path.
const DEFAULT_HERO_PHOTOS = [
  { url: "/hero-jig-v2.jpg", alt: "Craftsman fitting a rough diamond into a cutting jig" },
  { url: "/hero-loupe-v2.jpg", alt: "Evaluating a polished diamond with tweezers and a loupe" },
  { url: "/hero-diamonds-gradient.jpg", alt: "Loose polished diamonds scattered across a dark studio backdrop" },
];
const DEFAULT_BEGINNING_IMAGE = { url: "/beginning-craft.jpg", alt: "Precision diamond regrinding equipment" };
const DEFAULT_STONE_VIDEO_POSTER = { url: "/stone-video-poster.jpg", alt: "Precision diamond regrinding in progress" };
// Placeholders reuse existing site photography until the two new "Learning
// the Craft" photos and the trust-card portrait are uploaded in Sanity.
const DEFAULT_LEARNING_IMAGE = { url: "/hero-loupe.jpg", alt: "Loose diamonds being examined with tweezers" };
const DEFAULT_LEARNING_PORTRAIT = { url: "/craftsman-illustration.jpg", alt: "Babu Vekariya at his desk" };
const DEFAULT_TRUST_PHOTO = { url: "/craftsman-illustration.jpg", alt: "Babu Vekariya" };

const up = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.14 } },
};

// Brand palette used across this page.
const NAVY = "#02274A"; // primary brand navy (nav / footer)
const NAVY_DEEP = "#00315D"; // the slightly lighter navy used behind the About page's dark cards/sections
const TEAL = "#1CA9C9";
const ICE = "#DEF3F8"; // light cyan wash used behind the hero + the closing map section

// A faint grid-line texture, used to echo the graph-paper backdrop behind the hero and the dark sections.
const gridTexture = (lineColor: string) => ({
  backgroundImage: `linear-gradient(${lineColor} 1px, transparent 1px), linear-gradient(90deg, ${lineColor} 1px, transparent 1px)`,
  backgroundSize: "56px 56px",
});

// Headline treatment used throughout this page: a lead phrase followed by a
// close, e.g. "The House of / Exceptional Diamonds" — both set in the site's
// own heading font (font-serif), same normal weight, no italics, so this page
// reads identically to the rest of flxdiamond.com. Sizing is fluid (clamp) so
// headings scale smoothly at every viewport width instead of jumping at
// Tailwind's breakpoints.
function SplitHeading({
  lead,
  bold,
  leadClassName = "",
  boldClassName = "",
  as: Tag = "h2",
  size = "section",
}: {
  lead: string;
  bold: string;
  leadClassName?: string;
  boldClassName?: string;
  as?: "h1" | "h2";
  size?: "hero" | "section";
}) {
  const fontSize = size === "hero" ? "clamp(2.1rem, 5.5vw, 4.25rem)" : "clamp(1.65rem, 4vw, 2.75rem)";
  return (
    <Tag className="font-serif font-normal leading-[1.15]" style={{ fontSize }}>
      <span className={leadClassName}>{lead} </span>
      <span className={boldClassName}>{bold}</span>
    </Tag>
  );
}

interface SanityImage {
  url: string;
  alt?: string;
}

interface SanityAboutPage {
  seo?: {
    metaTitle?: string; metaDescription?: string; metaKeywords?: string;
    ogTitle?: string; ogDescription?: string; ogImageUrl?: string;
    twitterCard?: string; noIndex?: boolean;
    structuredDataType?: string; additionalJsonLd?: string;
  };

  // Hero
  heroHeadingLead?: string;
  heroHeadingBold?: string;
  heroSubtextLines?: string[];

  // Hero photography (top two-photo row + tall right-hand photo, in that order)
  heroPhotos?: SanityImage[];

  // The Beginning (origin story card + stats)
  beginningEyebrow?: string;
  beginningHeading?: string;
  beginningBody?: string;
  beginningImage?: SanityImage;
  originStats?: { value: string; label: string }[];

  // Learning the Craft
  learningHeadingLead?: string;
  learningHeadingBold?: string;
  learningBody?: string;
  learningImage?: SanityImage;
  learningCaption?: string;
  learningPortrait?: SanityImage;

  // Character & Trust
  trustHeadingLead?: string;
  trustHeadingBold?: string;
  trustSubtext?: string;
  trustBackgroundImage?: SanityImage;
  trustPhoto?: SanityImage;
  trustCardHeading?: string;
  trustCardBody?: string;

  // The Next Chapter (technique / video)
  stoneHeadingLead?: string;
  stoneHeadingBold?: string;
  stoneSubtext?: string;
  stoneVideoPoster?: SanityImage;
  // Preferred: a video file uploaded directly in Sanity. Falls back to
  // stoneVideoUrl (a direct link to a video file hosted elsewhere) if set
  // instead. Both are played inline with a native <video> element, so
  // neither should be a YouTube/Vimeo watch-page link — a direct .mp4 (or
  // similar) URL only.
  stoneVideo?: { url: string };
  stoneVideoUrl?: string;
  stoneFeatures?: { title: string; description: string }[];

  // Trusted by / global reach
  trustedHeadingLead?: string;
  trustedHeadingBold?: string;
  // Pick from the countries pre-computed in lib/worldMapDots.ts (COUNTRY_LOOKUP).
  // label/flagEmoji optionally override that country's default display name/flag.
  trustedCountries?: { country: string; label?: string; flagEmoji?: string }[];
}

const ORIGIN_STATS_DEFAULT = [
  { value: "1978", label: "The first chapter" },
  { value: "12", label: "The age it began" },
  { value: "Surat", label: "Where the craft was learned" },
];

const LEARNING_BODY_DEFAULT =
  "The early years were anything but easy. With little money and nowhere else to stay, there were times when the diamond factory became home. Every day demanded sacrifice, discipline and an unwavering commitment to keep learning.";

const LEARNING_CAPTION_DEFAULT =
  "Compared with others, he wasn't the fastest at the polishing wheel. But speed was never his ambition. While others learned how to polish diamonds, he wanted to understand them from rough crystal to the finished stone, from light performance to proportions, from natural formation to modern manufacturing.";

const TRUST_SUBTEXT_DEFAULT =
  "Years of dedication shaped more than technical skill. They shaped his reputation. Known for his discipline, humility and unwavering work ethic, Babu became someone others trusted with their most important work.";

const TRUST_CARD_BODY_DEFAULT =
  "Decades of industry experience and trusted global relationships give FLX direct access to carefully sourced diamonds and leading trade partners.";

const STONE_SUBTEXT_DEFAULT =
  "FLX wasn't created to tell one man's story. It was created to carry his life's work forward. Today, every part of FLX reflects a chapter of that journey.";

const STONE_FEATURES_DEFAULT = [
  { title: "Natural Diamonds", description: "Shaped by decades of manufacturing knowledge" },
  { title: "Lab-Grown Diamonds", description: "Selected with the same standards of judgement" },
  { title: "IF→FL Transformation", description: "Refined through years of precision craftsmanship" },
  { title: "Investment Diamonds", description: "Chosen for rarity, quality and long-term significance" },
];

export default function About() {
  const { data: sanityAbout } = useSanityQuery<SanityAboutPage>(["about-page"], ABOUT_PAGE_QUERY);
  const [isStoneVideoPlaying, setIsStoneVideoPlaying] = useState(false);

  const cms = isSanityConfigured ? sanityAbout : null;

  const originStats = cms?.originStats?.length ? cms.originStats : ORIGIN_STATS_DEFAULT;
  const learningBody = cms?.learningBody || LEARNING_BODY_DEFAULT;
  const learningCaption = cms?.learningCaption || LEARNING_CAPTION_DEFAULT;
  const trustSubtext = cms?.trustSubtext || TRUST_SUBTEXT_DEFAULT;
  const trustCardBody = cms?.trustCardBody || TRUST_CARD_BODY_DEFAULT;
  const stoneSubtext = cms?.stoneSubtext || STONE_SUBTEXT_DEFAULT;
  const stoneFeatures = cms?.stoneFeatures?.length ? cms.stoneFeatures : STONE_FEATURES_DEFAULT;

  // heroPhotos is fixed order: [0] top-left, [1] top-right, [2] tall right-column photo.
  const heroPhotos = cms?.heroPhotos?.length ? cms.heroPhotos : DEFAULT_HERO_PHOTOS;
  const beginningImage = cms?.beginningImage || DEFAULT_BEGINNING_IMAGE;
  const learningImage = cms?.learningImage || DEFAULT_LEARNING_IMAGE;
  const learningPortrait = cms?.learningPortrait || DEFAULT_LEARNING_PORTRAIT;
  const trustPhoto = cms?.trustPhoto || DEFAULT_TRUST_PHOTO;
  const stoneVideoPoster = cms?.stoneVideoPoster || DEFAULT_STONE_VIDEO_POSTER;
  // Uploaded Sanity file wins over the external-URL fallback; either way this
  // is a direct, playable video src (see the SanityAboutPage comment above).
  const stoneVideoSrc = cms?.stoneVideo?.url || cms?.stoneVideoUrl || null;

  // World map pins: editors pick countries by name from Sanity (trustedCountries);
  // each name is looked up in the pre-computed COUNTRY_LOOKUP table for its pixel
  // position + default flag, which trustedCountries can override per-entry.
  const trustedCountries: { country: string; label?: string; flagEmoji?: string }[] = cms?.trustedCountries?.length
    ? cms.trustedCountries
    : DEFAULT_TRUSTED_COUNTRIES.map((country) => ({ country }));

  const pins = trustedCountries
    .map((tc) => {
      const geo = COUNTRY_LOOKUP[tc.country];
      if (!geo) return null;
      return {
        name: tc.label || tc.country,
        flagEmoji: tc.flagEmoji || geo.flagEmoji,
        x: geo.x,
        y: geo.y,
      };
    })
    .filter((p): p is { name: string; flagEmoji: string; x: number; y: number } => p !== null);

  const seo = sanityAbout?.seo;

  return (
    <>
      <SeoHead
        metaTitle={seo?.metaTitle || "About | FLX Diamonds — Heritage, Mastery & IF→FL Precision"}
        metaDescription={seo?.metaDescription || "47 years of diamond mastery. Babu Vekariya pioneered the IF→FL conversion technique from Geelong, Australia. GIA-certified sourcing for global trade partners."}
        metaKeywords={seo?.metaKeywords || "FLX Diamonds about, Babu Vekariya, diamond craftsman, IF to FL conversion, diamond sourcing Geelong"}
        ogTitle={seo?.ogTitle}
        ogDescription={seo?.ogDescription}
        ogImageUrl={seo?.ogImageUrl}
        twitterCard={seo?.twitterCard}
        noIndex={seo?.noIndex}
        structuredDataType={seo?.structuredDataType || "WebPage"}
        additionalJsonLd={seo?.additionalJsonLd}
        siteName="FLX Diamonds"
      />
      <div style={{ fontFamily: "'Inter', sans-serif" }}>

        {/* ── Hero + Origin photography ── */}
        <section className="pt-28 md:pt-40 pb-14 md:pb-20 px-6 md:px-14 lg:px-20 relative overflow-hidden" style={{ background: ICE }}>
          <div className="absolute inset-0 opacity-60 pointer-events-none" style={gridTexture("rgba(2,39,74,0.06)")} />

          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="relative max-w-4xl mx-auto text-center space-y-5 md:space-y-6"
          >
            <motion.div variants={up}>
              <SplitHeading
                as="h1"
                size="hero"
                lead={(isSanityConfigured && sanityAbout?.heroHeadingLead) || "The House of"}
                bold={(isSanityConfigured && sanityAbout?.heroHeadingBold) || "Exceptional Diamonds"}
                leadClassName="text-[#02274A]"
                boldClassName="text-[#02274A]"
              />
            </motion.div>
            <motion.div variants={up} className="text-sm sm:text-base leading-relaxed" style={{ color: "rgba(2,39,74,0.6)" }}>
              {((isSanityConfigured && sanityAbout?.heroSubtextLines) || [
                "Every diamond we offer is chosen or transformed to deserve its place.",
                "Our Customers don't leave thinking, \"I bought a diamond.\" They leave thinking, \"I own something with a story worth telling.\"",
              ]).map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </motion.div>
          </motion.div>

          {/* Photo grid + origin card */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="relative max-w-7xl mx-auto mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5"
          >
            {/* Left: two photos + The Beginning card */}
            <div className="lg:col-span-2 flex flex-col gap-4 md:gap-5">
              <div className="grid grid-cols-2 gap-4 md:gap-5">
                {/* aspect-[6/5]: matches the design's close-up crop (~1.15:1) rather
                    than a generic 4:3, so object-cover doesn't over-crop these. */}
                <motion.div variants={up} className="overflow-hidden aspect-[6/5]">
                  <img src={heroPhotos[0]?.url} alt={heroPhotos[0]?.alt || ""} className="w-full h-full object-cover" />
                </motion.div>
                <motion.div variants={up} className="overflow-hidden aspect-[6/5]">
                  <img src={heroPhotos[1]?.url} alt={heroPhotos[1]?.alt || ""} className="w-full h-full object-cover" />
                </motion.div>
              </div>

              <motion.div variants={up} className="grid md:grid-cols-2 flex-1" style={{ background: NAVY_DEEP }}>
                <div className="p-8 md:p-10 flex flex-col justify-center space-y-4">
                  <p className="font-serif text-lg" style={{ color: TEAL }}>
                    {cms?.beginningEyebrow || "The Beginning"}
                  </p>
                  <h3 className="font-serif font-normal text-xl sm:text-2xl text-white">
                    {cms?.beginningHeading || "Before FLX, There was the craft."}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                    {cms?.beginningBody ||
                      "In 1978, Babu Vekariya entered the diamond trade at twelve. There were no shortcuts. He learned by standing close to the work watching craftsmen, understanding the process and slowly discovering how much there was to notice in a single stone. What stayed with him wasn't just the craft. It was the habit of paying attention."}
                  </p>
                </div>
                <div className="overflow-hidden min-h-[200px] md:min-h-0">
                  <img
                    src={beginningImage.url}
                    alt={beginningImage.alt || ""}
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
              </motion.div>
            </div>

            {/* Right: one continuous photo, stats overlaid at the bottom via a
                dark gradient — matches the design (a single tall panel), not
                a photo stacked on top of a separate flat-navy card. */}
            <motion.div variants={up} className="relative overflow-hidden min-h-[420px] md:min-h-0">
              <img
                src={heroPhotos[2]?.url}
                alt={heroPhotos[2]?.alt || ""}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(180deg, rgba(0,49,93,0) 0%, rgba(0,49,93,0.55) 45%, rgba(0,49,93,0.97) 72%)" }}
              />
              <div className="relative h-full flex flex-col justify-end p-8 md:p-10">
                {originStats.map((s, i) => (
                  <div key={i} className={`py-4 ${i > 0 ? "border-t" : ""}`} style={{ borderColor: "rgba(28,169,201,0.2)" }}>
                    <p className="font-serif text-2xl text-white leading-none mb-1">{s.value}</p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ── Learning the Craft ── */}
        <section className="py-20 md:py-28 px-6 md:px-14 lg:px-20" style={{ background: "#FFFFFF" }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-14"
          >
            {/* Left column: photo, then caption below it. aspect-[3/4]: both
                Learning photos are portrait-oriented in the design, not
                landscape — a 4:3 box here would crop out most of the shot. */}
            <div className="flex flex-col gap-6">
              <motion.div variants={up} className="overflow-hidden aspect-[3/4]">
                <img src={learningImage.url} alt={learningImage.alt || ""} className="w-full h-full object-cover" />
              </motion.div>
              <motion.p variants={up} className="text-sm sm:text-base leading-relaxed" style={{ color: "rgba(2,39,74,0.55)" }}>
                {learningCaption}
              </motion.p>
            </div>

            {/* Right column: heading + body, then photo below it */}
            <div className="flex flex-col gap-6">
              <motion.div variants={up} className="space-y-4">
                <SplitHeading
                  lead={cms?.learningHeadingLead || "Learning the craft."}
                  bold={cms?.learningHeadingBold || "Living the craft"}
                  leadClassName="text-[#02274A]"
                  boldClassName="text-[#02274A]"
                />
                <p className="text-sm sm:text-base leading-relaxed" style={{ color: "rgba(2,39,74,0.6)" }}>
                  {learningBody}
                </p>
              </motion.div>
              <motion.div variants={up} className="overflow-hidden aspect-[3/4]">
                <img src={learningPortrait.url} alt={learningPortrait.alt || ""} className="w-full h-full object-cover" />
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ── Character & Trust ── */}
        <section className="py-20 md:py-28 px-6 relative overflow-hidden text-center" style={{ background: NAVY_DEEP }}>
          {cms?.trustBackgroundImage?.url ? (
            <>
              <img
                src={cms.trustBackgroundImage.url}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
              />
              <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(0,49,93,0.75)" }} />
            </>
          ) : (
            <div className="absolute inset-0 opacity-50 pointer-events-none" style={gridTexture("rgba(255,255,255,0.05)")} />
          )}

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="relative max-w-3xl mx-auto space-y-4"
          >
            <motion.div variants={up}>
              <SplitHeading
                lead={cms?.trustHeadingLead || "Character earned trust"}
                bold={cms?.trustHeadingBold || "before titles"}
                leadClassName="text-white"
                boldClassName="text-white"
              />
            </motion.div>
            <motion.p variants={up} className="text-sm sm:text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
              {trustSubtext}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={up}
            className="relative max-w-md mx-auto mt-12 md:mt-16 text-left"
            style={{ background: "#FFFFFF" }}
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img src={trustPhoto.url} alt={trustPhoto.alt || ""} className="w-full h-full object-cover" />
            </div>
            <div className="p-6 md:p-8 space-y-2 text-center">
              <h3 className="font-serif font-normal text-xl" style={{ color: "#02274A" }}>
                {cms?.trustCardHeading || "Decades of Expertise"}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(2,39,74,0.6)" }}>
                {trustCardBody}
              </p>
            </div>
          </motion.div>
        </section>

        {/* ── The Next Chapter (technique + video) ── */}
        {/* Outer wrapper is max-w-6xl (matching the Learning section's width)
            so the video and feature grid can run wide, as in the design —
            only the heading/subtext block below is narrowed and centered. */}
        <section className="py-20 md:py-28 px-6" style={{ background: "#FFFFFF" }}>
          <div className="max-w-6xl mx-auto space-y-8 md:space-y-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={up}
              className="max-w-2xl mx-auto text-center"
            >
              <SplitHeading
                lead={cms?.stoneHeadingLead || "The next chapter became"}
                bold={cms?.stoneHeadingBold || "FLX."}
                leadClassName="text-[#02274A]"
                boldClassName="text-[#02274A]"
              />
              <p className="mt-3 text-sm sm:text-base leading-relaxed" style={{ color: "rgba(2,39,74,0.6)" }}>
                {stoneSubtext}
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={up}
              className="relative aspect-video overflow-hidden group"
            >
              {isStoneVideoPlaying && stoneVideoSrc ? (
                <video
                  src={stoneVideoSrc}
                  poster={stoneVideoPoster.url}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                  data-testid="video-about-stone"
                />
              ) : (
                <>
                  <img src={stoneVideoPoster.url} alt={stoneVideoPoster.alt || ""} className="w-full h-full object-cover" />
                  {stoneVideoSrc ? (
                    <button
                      type="button"
                      onClick={() => setIsStoneVideoPlaying(true)}
                      className="absolute inset-0 flex items-center justify-center w-full"
                      aria-label="Play video"
                      data-testid="button-about-stone-video"
                    >
                      <span className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                        <svg width="20" height="24" viewBox="0 0 20 24" fill="white"><path d="M0 0L20 12L0 24V0Z" /></svg>
                      </span>
                    </button>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center bg-white/10 backdrop-blur-sm">
                        <svg width="20" height="24" viewBox="0 0 20 24" fill="white"><path d="M0 0L20 12L0 24V0Z" /></svg>
                      </span>
                    </div>
                  )}
                </>
              )}
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 md:gap-x-8 text-left pt-2"
            >
              {stoneFeatures.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  variants={up}
                  className={i > 0 ? "md:border-l md:pl-6 lg:pl-8" : ""}
                  style={{ borderColor: "rgba(2,39,74,0.15)" }}
                >
                  <h4 className="font-serif font-normal text-lg sm:text-xl mb-1" style={{ color: "#02274A" }}>
                    {feature.title}
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(2,39,74,0.6)" }}>
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Trusted globally (world map) ── */}
        <section
          className="pt-20 md:pt-28 pb-0 px-6 relative overflow-hidden"
          style={{ background: `linear-gradient(180deg, #FFFFFF 0%, ${ICE} 100%)` }}
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-2xl mx-auto text-center space-y-4 relative z-10"
          >
            <motion.div variants={up}>
              <SplitHeading
                lead={cms?.trustedHeadingLead || "Trusted by names that"}
                bold={cms?.trustedHeadingBold || "hold their own standard."}
                leadClassName="text-[#02274A]"
                boldClassName="text-[#02274A]"
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={up}
            className="relative max-w-5xl mx-auto mt-10 md:mt-14"
          >
            <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} className="w-full h-auto" role="img" aria-label="World map highlighting FLX Diamonds trade partner countries">
              {MAP_GRAY_DOTS.map(([x, y], i) => (
                <circle key={`g${i}`} cx={x} cy={y} r={2.1} fill="rgba(2,39,74,0.14)" />
              ))}
              {MAP_ACCENT_DOTS.map(([x, y], i) => (
                <circle key={`a${i}`} cx={x} cy={y} r={2.6} fill={TEAL} />
              ))}
              {pins.map((pin) => (
                <circle key={`p-${pin.name}`} cx={pin.x} cy={pin.y} r={2.8} fill={TEAL} />
              ))}
            </svg>

            {pins.map((pin) => (
              <div
                key={pin.name}
                className="absolute -translate-x-1/2 -translate-y-full flex flex-col items-center"
                style={{ left: `${(pin.x / MAP_WIDTH) * 100}%`, top: `${(pin.y / MAP_HEIGHT) * 100}%` }}
              >
                <span
                  className="flex items-center gap-1 sm:gap-1.5 bg-white shadow-md px-1.5 py-1 sm:px-3 sm:py-1.5 text-[9px] sm:text-xs font-medium whitespace-nowrap"
                  style={{ color: "#02274A" }}
                >
                  <span className="text-xs sm:text-base leading-none">{pin.flagEmoji}</span>
                  {pin.name}
                </span>
                <span className="w-px h-2" style={{ background: TEAL }} />
              </div>
            ))}
          </motion.div>

          <div className="h-14 md:h-20" />
        </section>

      </div>
    </>
  );
}