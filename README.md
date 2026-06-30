# FLX Diamonds

A luxury diamond sourcing website for trade buyers, integrated with
[Sanity CMS](https://www.sanity.io). The original site is untouched —
Sanity has been layered on as a content backbone so every page (heading,
paragraph, FAQ, service, diamond, journal article, jewellery collection)
can be edited from `/studio`.

Deploy target: **Vercel** (serverless functions in `/api`, Vite SPA at the root).

---

## Tech Stack

| Layer | Tech |
|------|------|
| Frontend | React 19 + Vite 6 + TypeScript + Tailwind CSS v4 |
| Content | Sanity v5 (embedded Studio at `/studio`) |
| Backend | Vercel Serverless Functions (Node 18+/TypeScript) in `/api` |
| Routing | Wouter |
| State | TanStack React Query |

---

## Project Layout (flat — matches original)

```
flx-diamonds/
├── index.html
├── sanity.config.ts              # Studio config (basePath /studio)
├── vite.config.ts
├── vercel.json                   # Vercel rewrites + headers
├── package.json
├── tsconfig.json
├── .env.example
├── public/                       # Logos, images, videos (unchanged)
├── scripts/
│   └── seed.ts                   # `yarn seed` — pushes initial content
├── api/                          # Vercel Serverless Functions
│   ├── _lib.ts                   # shared Sanity config + admin guard
│   ├── health.ts                 # GET  /api/health
│   ├── sanity-query.ts           # POST /api/sanity-query (public GROQ proxy)
│   ├── sanity-mutate.ts          # POST /api/sanity-mutate  (admin)
│   ├── sitemap.ts                # GET  /sitemap.xml
│   ├── robots.ts                 # GET  /robots.txt
│   └── admin/
│       └── import-diamonds-csv.ts # POST /api/admin/import-diamonds-csv
└── src/                          # React app (unchanged)
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    ├── pages/                    # 17 pages — Home, Diamonds, About, ...
    ├── components/
    ├── hooks/
    ├── contexts/
    ├── lib/
    │   ├── sanity.ts             # Sanity client + sanityFetch (uses /api proxy)
    │   ├── sanity-queries.ts     # All GROQ queries
    │   ├── useSanityData.ts      # React Query wrapper
    │   └── useSEO.ts             # Dynamic meta tags + JSON-LD
    └── sanity/
        ├── schemas/              # 12 content schemas
        ├── plugins/csvImports.ts # In-Studio CSV plugin
        └── tools/CsvImportTools.tsx
```

---

## Quick start (local)

```bash
# 1. install
yarn install

# 2. configure env
cp .env.example .env
# → fill in VITE_SANITY_PROJECT_ID, dataset, write token, ADMIN_SECRET, SITE_URL

# 3. seed Sanity with the original site content (one-time, idempotent)
yarn seed

# 4. run locally — TWO options
#    a) Vite only (the /api/* endpoints won't be available locally):
yarn dev

#    b) Full local stack — Vite + Vercel serverless functions:
npm i -g vercel
vercel dev          # runs on http://localhost:3000

# 5. typecheck before commit
yarn typecheck

# 6. production build
yarn build          # outputs to /dist
```

---

## Deploy to Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com), click **Add New → Project**, import the repo.
3. **Framework preset**: Vite (auto-detected).
4. **Environment variables** — add these in the Vercel project settings:

| Key | Notes |
|---|---|
| `VITE_SANITY_PROJECT_ID` | from sanity.io |
| `VITE_SANITY_DATASET` | `production` |
| `VITE_SANITY_API_VERSION` | `2024-01-01` |
| `VITE_SANITY_API_TOKEN` | write token (seed/scripts) |
| `SANITY_PROJECT_ID` | same as VITE_SANITY_PROJECT_ID |
| `SANITY_DATASET` | same as VITE_SANITY_DATASET |
| `SANITY_API_VERSION` | same |
| `SANITY_API_TOKEN` | write token (server-side `/api`) |
| `ADMIN_SECRET` | random string protecting `/api/sanity-mutate` + CSV endpoint |
| `SITE_URL` | your live domain, e.g. `https://flxdiamond.com` |

5. **Deploy** → done. `/api/*` are automatic serverless functions; Vite SPA is served from `/`.

### One-time Sanity setup (required for Studio to work)

1. **CORS** — `sanity.io → Manage → API → CORS Origins`. Add (Allow credentials = OFF):
   - your production domain
   - `http://localhost:3000`
2. **Register Studio** — open `/studio` on your deployed site → click **"Add development host"** (Sanity v5 one-click).


| Schema | What it controls |
|---|---|
| `siteSettings` | Site name, tagline, default SEO, contact details, phones |
| `homePage` | Hero copy, marquee, featured section, FAQs, CTA |
| `aboutPage` | Hero, craftsman bio, technique steps, partnerships, pillars |
| `investmentPage` | Hero, pillars, process flow, case-study intro, CTA |
| `tradePage` | Hero, who qualifies, what we offer, process, form copy |
| `contactPage` | Hero, stats, enquiry types, confirmation messages |
| `diamond` | The full inventory (with CSV bulk import) |
| `journalArticle` | Blog posts with PortableText body + per-post SEO |
| `faqCategory` | FAQ categories + Q&A |
| `service` | Service tiles (sourcing / conversion / advisory) |
| `jewelleryCollection` | Jewellery showcase tiles |
| `conversionStone` | IF→FL case study results |

Every document has a `seo` object (title + description + optional OG image)
so search engines can be tuned per page.

---

## CSV Import — two ways

### A. Inside Sanity Studio (recommended)

1. Open `/studio`
2. Click **"Import CSV"** in the top toolbar (puzzle icon)
3. Download the CSV template → fill in your diamonds → drag the file back in
4. Hit **Import** — diamonds are upserted by `stockId`

### B. From command line / API (scripted)

```bash
curl -X POST https://your-domain.com/api/admin/import-diamonds-csv \
  -H "X-Admin-Secret: $ADMIN_SECRET" \
  -H "Content-Type: text/csv" \
  --data-binary @inventory.csv
```

### CSV columns ↔ `/diamonds` page filters

| `/diamonds` filter | CSV column | Accepted values |
|---|---|---|
| Category tabs | `type` | `natural`, `lab`, `loose` |
| Shape | `shape` | Round, Oval, Princess, Cushion, Emerald, Pear, Marquise, Radiant, Asscher, Heart, Triangle |
| Carat slider | `carat` | numeric |
| Color | `color` | D–M |
| Clarity | `clarity` | FL, IF, VVS1, VVS2, VS1, VS2, SI1, SI2, I1, I2, I3 |
| Cut | `cut` | Ideal, Excellent, Very Good, Good, Fair |
| Fluorescence | `fluorescence` | None, Faint, Medium, Strong, Very Strong, BGM |
| Certification | `certification` | GIA, IGI, None |

Plus non-filter fields: `stockId`, `polish`, `symmetry`, `measurements`,
`certificateNumber`, `tradePrice`, `notes`, `available`, `featured`.

---

## SEO — what's built in

| Feature | Where |
|---|---|
| Per-page `<title>` / description | `useSEO()` hook in `src/lib/useSEO.ts`, fed from each Sanity `seo` field |
| OpenGraph + Twitter Card | `useSEO()` injects them on every page load |
| Canonical URL | Auto-injected from `window.location` |
| JSON-LD structured data | `useSEO()` accepts a `jsonLd` payload; helpers for Organization & Product schemas |
| `robots.txt` | `/api/robots` (mapped to `/robots.txt` via vercel.json) |
| `sitemap.xml` | `/api/sitemap` (mapped to `/sitemap.xml`) — pulls journal article slugs from Sanity at request time |

---

## Available routes

| Path | Description |
|------|-------------|
| `/` | Home — hero, featured diamonds, brand story |
| `/diamonds` | Full inventory with filters |
| `/services` | IF→FL conversion & sourcing services |
| `/investment` | Investment-grade stone information |
| `/about` | About the team |
| `/journal` | Articles & educational content |
| `/jewellery` | Jewellery collections |
| `/faq` | Frequently asked questions |
| `/contact` | Contact form |
| `/trade` | Trade partnership info |
| `/studio` | Sanity CMS editor |
| `/sitemap.xml` | Dynamic sitemap |
| `/robots.txt` | Robots directives |

---

## Code health

- `yarn typecheck` — zero TypeScript errors (strict mode on)
- `yarn build` — production build succeeds (~22 s, outputs to `/dist`)
- No backend Python/uvicorn dependency — pure Node/TypeScript end to end
