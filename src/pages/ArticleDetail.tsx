import { useParams } from "wouter";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { useSanityQuery } from "@/lib/useSanityData";
import { isSanityConfigured } from "@/lib/sanity";
import { ARTICLE_BY_SLUG_QUERY } from "@/lib/sanity-queries";
import SeoHead from "@/components/SeoHead";
import { EASE } from "@/lib/motion";

interface PortableBlock {
  _type: string;
  _key: string;
  [key: string]: unknown;
}

interface SanityArticleDetail {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  category: string;
  excerpt: string;
  body: PortableBlock[];
  coverImageUrl?: string;
  seo?: {
    metaTitle?: string; metaDescription?: string; ogImageUrl?: string;
    noIndex?: boolean; structuredDataType?: string;
  };
}

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString("en-AU", { year: "numeric", month: "long", day: "numeric" });
  } catch { return d; }
}

function estimateReadTime(body: PortableBlock[]): number {
  if (!body) return 3;
  const text = body
    .filter((b) => b._type === "block")
    .map((b) => {
      const children = (b.children as { text?: string }[]) || [];
      return children.map((c) => c.text || "").join(" ");
    })
    .join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

const portableComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const url = (value as { asset?: { url?: string }; url?: string; alt?: string; caption?: string })?.asset?.url
        || (value as { url?: string }).url;
      const alt = (value as { alt?: string }).alt || "";
      const caption = (value as { caption?: string }).caption;
      if (!url) return null;
      return (
        <figure className="my-10 md:my-14">
          <img
            src={url}
            alt={alt}
            className="w-full object-cover"
            style={{ maxHeight: "560px" }}
          />
          {caption && (
            <figcaption className="mt-3 text-center text-[10px] uppercase tracking-[0.3em]" style={{ color: "rgba(2,39,74,0.35)" }}>
              {caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="font-serif text-2xl md:text-3xl mt-12 mb-4 leading-snug" style={{ color: "#02274A" }}>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-serif text-xl md:text-2xl mt-10 mb-3 leading-snug" style={{ color: "#02274A" }}>
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="text-base leading-[1.85] mb-6" style={{ color: "rgba(2,39,74,0.68)" }}>
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote
        className="my-10 pl-6 py-1"
        style={{ borderLeft: "3px solid #1CA9C9" }}
      >
        <p className="font-serif text-xl italic leading-relaxed" style={{ color: "rgba(2,39,74,0.55)" }}>
          {children}
        </p>
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong style={{ color: "#02274A", fontWeight: 600 }}>{children}</strong>,
    em: ({ children }) => <em style={{ color: "rgba(2,39,74,0.8)" }}>{children}</em>,
    link: ({ value, children }) => (
      <a
        href={(value as { href?: string })?.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#1CA9C9", textDecoration: "underline", textDecorationColor: "rgba(28,169,201,0.4)" }}
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-6 space-y-2 pl-5" style={{ listStyleType: "disc", color: "rgba(2,39,74,0.68)" }}>
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="my-6 space-y-2 pl-5" style={{ listStyleType: "decimal", color: "rgba(2,39,74,0.68)" }}>
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="text-base leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="text-base leading-relaxed">{children}</li>,
  },
};

const up = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: article, isLoading } = useSanityQuery<SanityArticleDetail>(
    ["article", slug],
    ARTICLE_BY_SLUG_QUERY,
    { slug },
    !!slug
  );

  if (!isSanityConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#02274A" }}>
        <div className="text-center space-y-4 px-8">
          <p className="text-[10px] uppercase tracking-[0.45em]" style={{ color: "#1CA9C9" }}>Journal</p>
          <p className="font-serif text-3xl text-white">Sanity CMS not configured</p>
          <Link href="/journal">
            <button className="mt-6 text-[9px] uppercase tracking-[0.3em]" style={{ color: "rgba(255,255,255,0.4)" }}>
              ← Back to Journal
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F4F8FC" }}>
        <div className="space-y-3 text-center">
          <div className="w-8 h-px mx-auto animate-pulse" style={{ background: "#1CA9C9" }} />
          <p className="text-[9px] uppercase tracking-[0.45em]" style={{ color: "rgba(2,39,74,0.3)" }}>Loading</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#02274A" }}>
        <div className="text-center space-y-4 px-8">
          <p className="text-[10px] uppercase tracking-[0.45em]" style={{ color: "#1CA9C9" }}>404</p>
          <p className="font-serif text-3xl text-white">Article not found</p>
          <Link href="/journal">
            <button className="mt-6 text-[9px] uppercase tracking-[0.3em]" style={{ color: "rgba(255,255,255,0.4)" }}>
              ← Back to Journal
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const readTime = estimateReadTime(article.body);
  const seo = article.seo;

  return (
    <>
      <SeoHead
        metaTitle={seo?.metaTitle || `${article.title} | FLX Diamonds Journal`}
        metaDescription={seo?.metaDescription || article.excerpt}
        ogTitle={seo?.metaTitle || article.title}
        ogDescription={seo?.metaDescription || article.excerpt}
        ogImageUrl={seo?.ogImageUrl || article.coverImageUrl}
        noIndex={seo?.noIndex}
        structuredDataType="Article"
        siteName="FLX Diamonds"
      />
      <div style={{ fontFamily: "'Inter', sans-serif" }}>

        {/* ── Hero / Cover ── */}
        <section
          className="relative overflow-hidden flex items-end"
          style={{
            minHeight: article.coverImageUrl ? "62vh" : "42vh",
            background: "#02274A",
          }}
        >
          {article.coverImageUrl && (
            <>
              <img
                src={article.coverImageUrl}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ zIndex: 0 }}
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to bottom, rgba(2,39,74,0.35) 0%, rgba(2,39,74,0.85) 70%, rgba(2,39,74,0.97) 100%)", zIndex: 1 }}
              />
            </>
          )}

          <div className="relative w-full max-w-3xl mx-auto px-6 pb-14 pt-36" style={{ zIndex: 2 }}>
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div variants={up} className="flex items-center gap-4 mb-6">
                <Link href="/journal">
                  <button
                    className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.35em] transition-opacity hover:opacity-70"
                    style={{ color: "#1CA9C9" }}
                  >
                    <ArrowLeft size={10} /> Journal
                  </button>
                </Link>
                <span className="w-6 h-px" style={{ background: "rgba(28,169,201,0.3)" }} />
                <span className="text-[8px] uppercase tracking-[0.4em]" style={{ color: "#1CA9C9" }}>
                  {article.category}
                </span>
              </motion.div>

              <motion.h1
                variants={up}
                className="font-serif leading-[1.08] text-white mb-6"
                style={{ fontSize: "clamp(1.9rem, 5vw, 3.2rem)" }}
              >
                {article.title}
              </motion.h1>

              <motion.div variants={up} className="flex items-center gap-5">
                <span className="text-[9px] uppercase tracking-[0.3em]" style={{ color: "rgba(255,255,255,0.38)" }}>
                  {formatDate(article.publishedAt)}
                </span>
                <span className="w-px h-3" style={{ background: "rgba(255,255,255,0.15)" }} />
                <span className="text-[9px] uppercase tracking-[0.3em]" style={{ color: "rgba(255,255,255,0.38)" }}>
                  {readTime} min read
                </span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── Article Body ── */}
        <section className="py-16 md:py-24 px-6" style={{ background: "white" }}>
          <div className="max-w-3xl mx-auto">

            {/* Lead / Excerpt */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="text-lg md:text-xl leading-relaxed mb-10 pb-10"
              style={{
                color: "rgba(2,39,74,0.55)",
                borderBottom: "1px solid rgba(2,39,74,0.08)",
                fontStyle: "italic",
              }}
            >
              {article.excerpt}
            </motion.p>

            {/* Portable Text body */}
            {article.body && article.body.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
              >
                <PortableText value={article.body} components={portableComponents} />
              </motion.div>
            ) : (
              <p className="text-sm" style={{ color: "rgba(2,39,74,0.3)" }}>
                Article body coming soon.
              </p>
            )}

            {/* End rule */}
            <div className="mt-16 pt-10" style={{ borderTop: "1px solid rgba(2,39,74,0.08)" }}>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <Link href="/journal">
                  <button
                    className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.35em] transition-all hover:gap-3"
                    style={{ color: "rgba(2,39,74,0.35)" }}
                  >
                    <ArrowLeft size={10} /> All Articles
                  </button>
                </Link>
                <Link href="/contact">
                  <button
                    className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.35em] transition-all hover:gap-3"
                    style={{ color: "#1CA9C9" }}
                  >
                    Discuss this with our team <ArrowRight size={10} />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA strip ── */}
        <section className="py-16 px-6" style={{ background: "#02274A", borderTop: "1px solid rgba(28,169,201,0.1)" }}>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-[9px] uppercase tracking-[0.45em] mb-2" style={{ color: "#1CA9C9" }}>Trade Enquiries</p>
              <p className="font-serif text-2xl text-white">Ready to discuss your stones?</p>
            </div>
            <Link href="/contact">
              <button
                className="text-[10px] uppercase tracking-[0.3em] text-white transition-all hover:opacity-80"
                style={{ background: "#1CA9C9", height: "50px", padding: "0 2.5rem", border: "none", cursor: "pointer" }}
              >
                Begin the Conversation →
              </button>
            </Link>
          </div>
        </section>

      </div>
    </>
  );
}
