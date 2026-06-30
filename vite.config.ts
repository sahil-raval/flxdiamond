import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serves the `/api/sanity-query` and `/api/sanity-mutate` endpoints during local
// `vite dev` so a plain `npm run dev` works without `vercel dev`. Reads the same
// VITE_SANITY_* env vars the client uses. In the Emergent preview/production these
// routes are handled by the backend/serverless function instead, so this is dev-only.
const sanityDevApiPlugin = {
  name: "sanity-dev-api",
  configureServer(server: import("vite").ViteDevServer) {
    server.middlewares.use((req, res, next) => {
      const pathname = (req.url || "").split("?")[0];
      const isQuery = pathname === "/api/sanity-query";
      const isMutate = pathname === "/api/sanity-mutate";
      if (req.method !== "POST" || (!isQuery && !isMutate)) return next();

      const env = server.config.env as Record<string, string | undefined>;
      const projectId = env.VITE_SANITY_PROJECT_ID;
      const dataset = env.VITE_SANITY_DATASET || "production";
      const apiVersion = env.VITE_SANITY_API_VERSION || "2024-01-01";
      const token = env.VITE_SANITY_API_TOKEN;

      let raw = "";
      req.on("data", (chunk) => (raw += chunk));
      req.on("end", async () => {
        res.setHeader("Content-Type", "application/json");
        if (!projectId) {
          res.statusCode = 503;
          res.end(JSON.stringify({ error: "Sanity not configured" }));
          return;
        }
        try {
          const body = raw ? JSON.parse(raw) : {};
          // Live API (not apicdn) so freshly published content shows immediately.
          const target = isQuery
            ? `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`
            : `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`;
          const headers: Record<string, string> = { "Content-Type": "application/json" };
          // Mutations require a write token; reads stay public (no token = no drafts).
          if (isMutate && token) headers["Authorization"] = `Bearer ${token}`;
          const payload = isQuery
            ? { query: body.query, params: body.params || {} }
            : body;
          const r = await fetch(target, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
          });
          const text = await r.text();
          res.statusCode = r.status;
          res.end(text);
        } catch (e) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }));
        }
      });
    });
  },
};

const videoRangePlugin = {
  name: "video-range-headers",
  configureServer(server: import("vite").ViteDevServer) {
    server.middlewares.use((_req, res, next) => {
      const orig = res.setHeader.bind(res);
      res.setHeader = (name: string, value: string | number | readonly string[]) => {
        orig(name, value);
        if (String(name).toLowerCase() === "content-type") {
          const ct = String(value);
          if (ct.startsWith("video/") || ct.startsWith("audio/")) {
            orig("Accept-Ranges", "bytes");
          }
        }
        return res;
      };
      next();
    });
  },
};

export default defineConfig({
  plugins: [react(), tailwindcss(), sanityDevApiPlugin, videoRangePlugin],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@assets": path.resolve(__dirname, "public"),
    },
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: ["@sanity/ui", "sanity", "@sanity/client", "@sanity/image-url"],
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
  },
  server: {
    port: 3000,
    host: true,
    allowedHosts: true,
    // For local dev of the /api/* serverless functions, run `vercel dev`
    // (it serves Vite + the functions on the same port — recommended).
    // If you'd rather use plain `yarn dev`, set VITE_API_PROXY=http://localhost:3001
    // and run the functions on a separate port.
    proxy: process.env.VITE_API_PROXY
      ? { "/api": { target: process.env.VITE_API_PROXY, changeOrigin: true } }
      : undefined,
  },
  build: {
    rollupOptions: {},
  },
});