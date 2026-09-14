import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";
import { useSanityQuery } from "@/lib/useSanityData";
import { isSanityConfigured } from "@/lib/sanity";
import { ABOUT_PAGE_QUERY } from "@/lib/sanity-queries";
import SeoHead from "@/components/SeoHead";
import { MAP_WIDTH, MAP_HEIGHT, MAP_GRAY_DOTS, MAP_ACCENT_DOTS, MAP_PINS } from "@/lib/worldMapDots";

// Served straight from /public — no bundler import needed, just the root-relative path.
const heroJig = "/hero-jig.jpg";
const heroLoupe = "/hero-loupe.jpg";
const heroGrinding = "/hero-grinding.jpg";
const beginningCraft = "/beginning-craft.jpg";
const stoneVideoPoster = "/stone-video-poster.jpg";
const craftsmanIllustration = "/craftsman-illustration.jpg";
const journeyPhoto1 = "/journey-1.jpg";
const journeyPhoto2 = "/journey-2.jpg";
const journeyPhoto3 = "/journey-3.jpg";

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

// Headline treatment used throughout this page: an italic lead phrase followed
// by a bold close, e.g. "A Diamond is / Never just a Diamond" — both set in the
// site's own heading font (font-serif) so this page reads identically to the
// rest of flxdiamond.com, just toggling italic/weight for the two-tone effect.
// Sizing is fluid (clamp) so headings scale smoothly at every viewport width
// instead of jumping at Tailwind's breakpoints.
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
    <Tag className="font-serif leading-[1.15]" style={{ fontSize }}>
      <span className={`italic ${leadClassName}`}>{lead} </span>
      <span className={`font-serif font-bold not-italic ${boldClassName}`}>{bold}</span>
    </Tag>
  );
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

  // The Beginning (origin story card + stats)
  beginningEyebrow?: string;
  beginningHeading?: string;
  beginningBody?: string;
  beginningImageUrl?: string;
  originStats?: { value: string; label: string }[];

  // The Craftsman
  craftsman?: {
    name?: string;
    subtext?: string;
    illustrationUrl?: string;
    bio?: string;
  };

  // The Stone Number (technique / video)
  stoneHeadingLead?: string;
  stoneHeadingBold?: string;
  stoneCaption?: string[];
  stoneVideoPosterUrl?: string;
  stoneVideoUrl?: string;

  // The Journey (timeline)
  journeyHeadingLead?: string;
  journeyHeadingBold?: string;
  journeySteps?: { title: string; body: string }[];
  journeyPhotos?: string[];

  // Trusted by / global reach
  trustedHeadingLead?: string;
  trustedHeadingBold?: string;
}

const ORIGIN_STATS_DEFAULT = [
  { value: "1978", label: "The first chapter" },
  { value: "12", label: "The age it began" },
  { value: "Surat", label: "Where the craft was learned" },
];

const CRAFTSMAN_BIO_DEFAULT =
  "For Babu, diamonds have never been just a business. His understanding comes from years spent close to the craft learning how stones are cut and polished, understanding what changes their character, and developing an eye that comes from seeing thousands of diamonds over a lifetime. Today, that knowledge continues to shape the way FLX works. “He wasn't the fastest. He kept looking closer.” And he still does.";

const STONE_CAPTION_DEFAULT = [
  "A natural diamond can come with pages of information. Colour. Clarity. Cut. Carat. They tell you the characteristics of the stone. But knowing how those details come together and what they mean for the stone in front of you takes another kind of understanding. That's where experience earns its place.",
];

const JOURNEY_STEPS_DEFAULT = [
  {
    title: "Apprentice",
    body: "Start with the basics. Learning how the work is actually done.",
  },
  {
    title: "Craftsman",
    body: "Learn the details. Understanding what happens between rough and polished.",
  },
];

export default function About() {
  const { data: sanityAbout } = useSanityQuery<SanityAboutPage>(["about-page"], ABOUT_PAGE_QUERY);

  const cms = isSanityConfigured ? sanityAbout : null;

  const originStats = cms?.originStats?.length ? cms.originStats : ORIGIN_STATS_DEFAULT;
  const craftsmanBio = cms?.craftsman?.bio || CRAFTSMAN_BIO_DEFAULT;
  const stoneCaption = cms?.stoneCaption?.length ? cms.stoneCaption : STONE_CAPTION_DEFAULT;
  const journeySteps = cms?.journeySteps?.length ? cms.journeySteps : JOURNEY_STEPS_DEFAULT;

  const journeyPhotos = cms?.journeyPhotos?.length
    ? cms.journeyPhotos
    : [journeyPhoto1, journeyPhoto2, journeyPhoto3];

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
                lead={(isSanityConfigured && sanityAbout?.heroHeadingLead) || "A Diamond is"}
                bold={(isSanityConfigured && sanityAbout?.heroHeadingBold) || "Never just a Diamond"}
                leadClassName="text-[#02274A]"
                boldClassName="text-[#02274A]"
              />
            </motion.div>
            <motion.div variants={up} className="text-sm sm:text-base leading-relaxed" style={{ color: "rgba(2,39,74,0.6)" }}>
              {((isSanityConfigured && sanityAbout?.heroSubtextLines) || [
                "What matters is knowing the difference.",
                "For over four decades, we've learned to see it.",
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
                <motion.div variants={up} className="overflow-hidden aspect-[4/3]">
                  <img src={heroJig} alt="Craftsman examining a rough diamond under a loupe" className="w-full h-full object-cover" />
                </motion.div>
                <motion.div variants={up} className="overflow-hidden aspect-[4/3]">
                  <img src={heroLoupe} alt="Evaluating a polished diamond with tweezers and a loupe" className="w-full h-full object-cover" />
                </motion.div>
              </div>

              <motion.div variants={up} className="grid md:grid-cols-2 flex-1" style={{ background: NAVY_DEEP }}>
                <div className="p-8 md:p-10 flex flex-col justify-center space-y-4">
                  <p className="font-serif italic text-lg" style={{ color: TEAL }}>
                    {cms?.beginningEyebrow || "The Beginning"}
                  </p>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-white">
                    {cms?.beginningHeading || "Before FLX, There was the craft."}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                    {cms?.beginningBody ||
                      "In 1978, Babu Vekariya entered the diamond trade at twelve. There were no shortcuts. He learned by standing close to the work watching craftsmen, understanding the process and slowly discovering how much there was to notice in a single stone. What stayed with him wasn't just the craft. It was the habit of paying attention."}
                  </p>
                </div>
                <div className="overflow-hidden min-h-[200px] md:min-h-0">
                  <img
                    src={cms?.beginningImageUrl || beginningCraft}
                    alt="Precision diamond regrinding equipment"
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
              </motion.div>
            </div>

            {/* Right: tall photo + stats card */}
            <div className="flex flex-col gap-4 md:gap-5">
              <motion.div variants={up} className="overflow-hidden flex-1 min-h-[220px]">
                <img src={heroGrinding} alt="Craftsman operating a precision diamond regrinding tool" className="w-full h-full object-cover" />
              </motion.div>
              <motion.div variants={up} className="p-8 md:p-10 space-y-0" style={{ background: NAVY_DEEP }}>
                {originStats.map((s, i) => (
                  <div key={i} className={`py-4 ${i > 0 ? "border-t" : ""}`} style={{ borderColor: "rgba(28,169,201,0.2)" }}>
                    <p className="font-serif italic text-2xl text-white leading-none mb-1">{s.value}</p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ── The Craftsman ── */}
        <section className="py-20 md:py-28 px-6" style={{ background: "#FFFFFF" }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="max-w-3xl mx-auto text-center space-y-4"
          >
            <motion.div variants={up}>
              <SplitHeading
                lead="The Craftsman"
                bold={cms?.craftsman?.name || "Babu Vekariya"}
                leadClassName="text-[#02274A]"
                boldClassName="text-[#02274A]"
              />
            </motion.div>
            <motion.p variants={up} className="text-sm sm:text-base leading-relaxed" style={{ color: "rgba(2,39,74,0.55)" }}>
              {cms?.craftsman?.subtext || "47+ Years in the diamond trade — a craft you don't stop learning."}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={up}
            className="max-w-4xl mx-auto mt-10 md:mt-14"
          >
            <img
              src={cms?.craftsman?.illustrationUrl || craftsmanIllustration}
              alt={cms?.craftsman?.name || "Babu Vekariya"}
              className="w-full h-auto"
            />
          </motion.div>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={up}
            className="max-w-2xl mx-auto mt-10 md:mt-14 text-center text-sm sm:text-base leading-relaxed"
            style={{ color: "rgba(2,39,74,0.6)" }}
          >
            {craftsmanBio}
          </motion.p>
        </section>

        {/* ── The Stone Number (technique + video) ── */}
        <section className="py-20 md:py-28 px-6 relative overflow-hidden" style={{ background: NAVY_DEEP }}>
          <div className="absolute inset-0 opacity-50 pointer-events-none" style={gridTexture("rgba(255,255,255,0.05)")} />
          <div className="relative max-w-4xl mx-auto text-center space-y-8 md:space-y-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={up}
            >
              <SplitHeading
                lead={cms?.stoneHeadingLead || "The Stone Number tells you what it is"}
                bold={cms?.stoneHeadingBold || "The story tells you more."}
                leadClassName="text-white"
                boldClassName="text-white"
              />
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={up}
              className="relative max-w-3xl mx-auto aspect-video overflow-hidden group"
            >
              <img src={cms?.stoneVideoPosterUrl || stoneVideoPoster} alt="Precision diamond regrinding in progress" className="w-full h-full object-cover" />
              {cms?.stoneVideoUrl ? (
                <a
                  href={cms.stoneVideoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute inset-0 flex items-center justify-center"
                  aria-label="Play video"
                  data-testid="link-about-stone-video"
                >
                  <span className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                    <svg width="20" height="24" viewBox="0 0 20 24" fill="white"><path d="M0 0L20 12L0 24V0Z" /></svg>
                  </span>
                </a>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center bg-white/10 backdrop-blur-sm">
                    <svg width="20" height="24" viewBox="0 0 20 24" fill="white"><path d="M0 0L20 12L0 24V0Z" /></svg>
                  </span>
                </div>
              )}
            </motion.div>

            {stoneCaption.map((para, i) => (
              <motion.p
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={up}
                className="text-sm sm:text-base leading-relaxed max-w-2xl mx-auto"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                {para}
              </motion.p>
            ))}
          </div>
        </section>

        {/* ── The Journey ── */}
        <section className="py-20 md:py-28 px-6" style={{ background: "#FFFFFF" }}>
          <div className="max-w-4xl mx-auto text-center mb-14 md:mb-20">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={up}>
              <SplitHeading
                lead={cms?.journeyHeadingLead || "The Journey"}
                bold={cms?.journeyHeadingBold || "The Years Changed. The Curiosity didn't."}
                leadClassName="text-[#02274A]"
                boldClassName="text-[#02274A]"
              />
            </motion.div>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 md:gap-10 items-center">
            {/* Photo stack */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={up}
              className="relative w-full max-w-sm mx-auto aspect-[3/4]"
            >
              {journeyPhotos[2] && (
                <img src={journeyPhotos[2]} alt="" aria-hidden="true" className="absolute inset-0 w-[92%] h-[92%] m-auto object-cover rotate-[-8deg] shadow-lg" />
              )}
              {journeyPhotos[1] && (
                <img src={journeyPhotos[1]} alt="" aria-hidden="true" className="absolute inset-0 w-[92%] h-[92%] m-auto object-cover rotate-[5deg] shadow-lg" />
              )}
              {journeyPhotos[0] && (
                <img src={journeyPhotos[0]} alt="Master craftsman examining a diamond under a loupe" className="absolute inset-0 w-[92%] h-[92%] m-auto object-cover rotate-[-2deg] shadow-xl" />
              )}
            </motion.div>

            {/* Vertical timeline */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="relative pl-8"
            >
              <div className="absolute left-[3px] top-2 bottom-2 border-l border-dashed" style={{ borderColor: "rgba(2,39,74,0.2)" }} />
              <div className="space-y-16">
                {journeySteps.map((step, i) => {
                  const active = i === 0;
                  return (
                    <motion.div key={step.title} variants={up} className="relative" style={{ opacity: active ? 1 : 0.35 }}>
                      <span
                        className="absolute -left-8 top-1.5 w-[7px] h-[7px] rotate-45"
                        style={{ background: active ? TEAL : "rgba(2,39,74,0.25)" }}
                      />
                      <h3 className="font-serif font-bold text-xl sm:text-2xl mb-2" style={{ color: "#02274A" }}>{step.title}</h3>
                      <p className="text-sm sm:text-base leading-relaxed" style={{ color: "rgba(2,39,74,0.6)" }}>{step.body}</p>
                    </motion.div>
                  );
                })}
              </div>
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
            </svg>

            {MAP_PINS.map((pin) => (
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