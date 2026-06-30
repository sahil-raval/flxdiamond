# FLX Diamonds — Vite + React + Sanity

A fully Sanity-CMS-driven marketing site. All copy, SEO, inventory (diamonds),
journal articles, and hero/section media are editable from Sanity Studio.

## Prerequisites
- Node.js 20+ (Node 22 recommended) and npm (or yarn)

## 1. Install
```bash
npm install            # or: yarn install
```
> If you hit an engine warning from a transitive dep on Node 20, use:
> `npm install --legacy-peer-deps`  (yarn: `yarn install --ignore-engines`)

## 2. Environment
A ready-to-run `.env` is already included (copied from `.env.example`).
It contains your Sanity + EmailJS keys:
```
VITE_SANITY_PROJECT_ID=dp1evbtf
VITE_SANITY_DATASET=production
VITE_SANITY_API_TOKEN=...           # write token (Studio uses its own login; keep server-side in prod)
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_OWNER_TMPL=...
VITE_EMAILJS_PUBLIC_KEY=...
```

## 3. Run (dev)
```bash
npm run dev            # http://localhost:5173  (or: npm start  -> port 3000)
```
- Website:  http://localhost:5173/
- Studio:   http://localhost:5173/studio

> Studio login: for the embedded Studio to authenticate, add your dev/prod URL
> in https://manage.sanity.io → project `dp1evbtf` → API → CORS Origins
> (e.g. http://localhost:5173 and your Vercel domain). The public site does NOT
> need this (it reads via the serverless proxy).

## 4. Build / preview
```bash
npm run build          # outputs to dist/
npm run serve          # preview the production build
```

## 5. Seed CMS copy (optional, safe & idempotent)
Fills any EMPTY page fields with the default copy. Never overwrites your edits,
never touches diamonds/articles/collections:
```bash
npm run seed:pages
```
⚠️ Do NOT run `npm run seed` (legacy `scripts/seed.ts`) on a populated dataset —
it uses createOrReplace and can overwrite existing documents.

## 6. Deploy (Vercel)
- Framework preset: Vite. Build: `npm run build`. Output: `dist`.
- Serverless functions in `/api/*` handle Sanity reads/writes (already included).
- Add the same `VITE_*` env vars in Vercel. For production, also set a server-only
  `SANITY_API_TOKEN` (used by `/api`) and avoid shipping the write token to the client.

## Editing content
Open `/studio`:
- Pages: Home, About, Services, FAQ, Jewellery, Journal, Investment, Trade, Contact, Site Settings
- Diamonds (inventory + filters + image/video/GIA report) — add/remove stones, CSV import tool
- Journal (blog articles)
- Every section's headings, body, SEO, images and videos are editable.
Edits reflect on the site after a reload.
