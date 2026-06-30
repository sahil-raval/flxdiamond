import { lazy, Suspense } from "react";
import { isSanityConfigured } from "@/lib/sanity";

const SanityStudio = lazy(async () => {
  const [{ Studio }, { default: config }] = await Promise.all([
    import("sanity"),
    import("../../sanity.config"),
  ]);
  function EmbeddedStudio() {
    return (
      <div style={{ height: "100vh" }}>
        <Studio config={config} />
      </div>
    );
  }
  return { default: EmbeddedStudio };
});

function SetupGuide() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#02274A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "560px",
          width: "100%",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(28,169,201,0.2)",
          padding: "3rem",
        }}
      >
        <p
          style={{
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.45em",
            color: "#1CA9C9",
            marginBottom: "1rem",
          }}
        >
          CMS Setup Required
        </p>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "2rem",
            color: "rgba(255,255,255,0.9)",
            marginBottom: "1.5rem",
            lineHeight: 1.2,
          }}
        >
          Connect to Sanity CMS
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: "0.9rem",
            lineHeight: 1.7,
            marginBottom: "2rem",
          }}
        >
          To access the content management studio, you need to create a free Sanity project and
          add your credentials as environment variables.
        </p>

        <div style={{ marginBottom: "2rem" }}>
          <p
            style={{
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.3em",
              color: "#1CA9C9",
              marginBottom: "1rem",
            }}
          >
            Setup Steps
          </p>
          {[
            {
              step: "1",
              title: "Create a free account",
              body: (
                <>
                  Go to{" "}
                  <a
                    href="https://sanity.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#1CA9C9" }}
                  >
                    sanity.io
                  </a>{" "}
                  and sign up for free.
                </>
              ),
            },
            {
              step: "2",
              title: "Create a new project",
              body: 'Click "New Project", name it "FLX Diamonds", and choose the "production" dataset.',
            },
            {
              step: "3",
              title: "Copy your Project ID",
              body: "Find your Project ID in the Sanity dashboard under Project Settings.",
            },
            {
              step: "4",
              title: "Add environment variables",
              body: (
                <>
                  In this Replit project, add these secrets:
                  <br />
                  <code
                    style={{
                      display: "block",
                      marginTop: "0.5rem",
                      background: "rgba(0,0,0,0.3)",
                      padding: "0.75rem",
                      fontSize: "12px",
                      color: "#1CA9C9",
                      lineHeight: 1.8,
                    }}
                  >
                    VITE_SANITY_PROJECT_ID = your-project-id
                    <br />
                    VITE_SANITY_DATASET = production
                  </code>
                </>
              ),
            },
            {
              step: "5",
              title: "Add your Replit URL to Sanity CORS",
              body: "In the Sanity dashboard → API → CORS Origins, add your Replit preview URL.",
            },
            {
              step: "6",
              title: "Restart and return here",
              body: "After adding the secrets, restart the workflow and visit /studio again.",
            },
          ].map((item) => (
            <div
              key={item.step}
              style={{
                display: "flex",
                gap: "1rem",
                marginBottom: "1.25rem",
                paddingBottom: "1.25rem",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span
                style={{
                  color: "rgba(28,169,201,0.5)",
                  fontWeight: 600,
                  fontSize: "1rem",
                  minWidth: "1.5rem",
                  marginTop: "1px",
                }}
              >
                {item.step}
              </span>
              <div>
                <p style={{ color: "rgba(255,255,255,0.85)", fontWeight: 500, fontSize: "0.85rem", marginBottom: "0.35rem" }}>
                  {item.title}
                </p>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", lineHeight: 1.6 }}>
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", lineHeight: 1.5 }}>
          Once connected, you can manage all content — diamonds, journal articles, FAQs, services,
          and site settings — directly from this studio.
        </p>
      </div>
    </div>
  );
}

export default function StudioPage() {
  if (!isSanityConfigured) {
    return <SetupGuide />;
  }

  return (
    <Suspense fallback={<div style={{ background: "#02274A", minHeight: "100vh" }} />}>
      <SanityStudio />
    </Suspense>
  );
}
