import { isSanityConfigured } from "@/lib/sanity";
import { Link } from "wouter";

export function SanityCMSBanner() {
  if (isSanityConfigured) return null;

  return (
    <div
      style={{
        background: "#1CA9C9",
        color: "#fff",
        padding: "10px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        fontSize: "12px",
        fontFamily: "'Inter', sans-serif",
        zIndex: 9999,
        position: "relative",
      }}
    >
      <span style={{ letterSpacing: "0.05em" }}>
        <strong>CMS not connected.</strong> Content is using built-in defaults. To manage content
        via Sanity,{" "}
        <Link
          href="/studio"
          style={{ color: "#fff", textDecoration: "underline", fontWeight: 600 }}
        >
          visit /studio
        </Link>{" "}
        for setup instructions.
      </span>
    </div>
  );
}
