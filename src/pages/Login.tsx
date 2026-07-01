import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

function FloatInput({
  id, label, type = "text", value, onChange, required = false,
}: {
  id: string; label: string; type?: string; value: string;
  onChange: (v: string) => void; required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        autoComplete="off"
        className="w-full text-sm text-white bg-transparent outline-none peer"
        style={{
          border: "none",
          borderBottom: `1px solid ${focused ? "#1CA9C9" : "rgba(255,255,255,0.18)"}`,
          padding: "22px 0 8px",
          transition: "border-color 0.2s",
        }}
      />
      <label
        htmlFor={id}
        className="absolute left-0 font-medium pointer-events-none transition-all"
        style={{
          top: active ? "6px" : "50%",
          transform: active ? "none" : "translateY(-50%)",
          fontSize: active ? "9px" : "11px",
          letterSpacing: active ? "0.2em" : "0.15em",
          textTransform: "uppercase",
          color: active ? "#1CA9C9" : "rgba(255,255,255,0.35)",
        }}
      >
        {label}
      </label>
    </div>
  );
}

export default function Login() {
  const [, navigate] = useLocation();
  const { login } = useAuth();

  const params = new URLSearchParams(window.location.search);
  const returnTo = params.get("return") || "/shortlist";

  const [mode, setMode] = useState<"register" | "login">("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (mode === "register") {
        if (!name.trim() || !email.trim() || !company.trim()) {
          setError("Please fill in all required fields.");
          setSubmitting(false);
          return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setError("Please enter a valid email address.");
          setSubmitting(false);
          return;
        }
        login({ name: name.trim(), email: email.trim(), company: company.trim(), phone: phone.trim() });
        navigate(returnTo);
      } else {
        if (!email.trim()) {
          setError("Please enter your email address.");
          setSubmitting(false);
          return;
        }
        const stored = localStorage.getItem("flx_trade_user");
        if (stored) {
          const user = JSON.parse(stored);
          if (user.email.toLowerCase() === email.toLowerCase()) {
            login(user);
            navigate(returnTo);
            return;
          }
        }
        setError("No account found for that email. Please register below.");
        setMode("register");
        setSubmitting(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: "#02274A", minHeight: "100vh" }}>

      {/* Hero */}
      <div className="pt-28 md:pt-40 pb-10 px-8 md:px-14 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.45em] mb-4 font-medium" style={{ color: "#1CA9C9" }}>
            Trade Access
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-3 leading-tight">
            {mode === "register" ? "Create Trade Account" : "Sign In"}
          </h1>
          <div className="w-10 h-px my-4" style={{ background: "#1CA9C9" }} />
          <p className="text-white/45 text-sm max-w-xl leading-relaxed font-light">
            {mode === "register"
              ? "Free access for qualified jewellers, dealers, and industry buyers."
              : "Welcome back. Enter your email to continue."}
          </p>
        </div>
      </div>

      {/* Form card */}
      <div className="max-w-4xl mx-auto px-8 md:px-14 lg:px-20 pb-24">
        <div className="grid md:grid-cols-2 gap-12">

          {/* Form */}
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <form onSubmit={handleSubmit} noValidate className="space-y-7">

              {mode === "register" ? (
                <>
                  <FloatInput id="name"    label="Full Name *"      value={name}    onChange={setName}    required />
                  <FloatInput id="email"   label="Email Address *"  value={email}   onChange={setEmail}   type="email" required />
                  <FloatInput id="company" label="Company / Business *" value={company} onChange={setCompany} required />
                  <FloatInput id="phone"   label="Phone (optional)" value={phone}   onChange={setPhone}   type="tel" />
                </>
              ) : (
                <FloatInput id="email" label="Email Address" value={email} onChange={setEmail} type="email" required />
              )}

              {error && (
                <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,140,140,0.85)" }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 text-[10px] uppercase tracking-[0.4em] font-semibold text-white transition-all"
                style={{
                  background: submitting ? "rgba(28,169,201,0.5)" : "#1CA9C9",
                  cursor: submitting ? "wait" : "pointer",
                }}
              >
                {submitting ? "Please wait..." : mode === "register" ? "Create Account & Continue" : "Sign In & Continue"}
              </button>

              <div className="pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                {mode === "register" ? (
                  <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => { setMode("login"); setError(""); }}
                      className="transition-colors"
                      style={{ color: "#1CA9C9", textDecoration: "underline" }}
                    >
                      Sign in
                    </button>
                  </p>
                ) : (
                  <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                    New to FLX Diamond?{" "}
                    <button
                      type="button"
                      onClick={() => { setMode("register"); setError(""); }}
                      className="transition-colors"
                      style={{ color: "#1CA9C9", textDecoration: "underline" }}
                    >
                      Create a free trade account
                    </button>
                  </p>
                )}
              </div>
            </form>
          </motion.div>

          {/* Trust sidebar */}
          <div className="flex flex-col gap-6 pt-2">
            <div>
              <p className="text-[9px] uppercase tracking-[0.4em] font-semibold mb-5" style={{ color: "rgba(255,255,255,0.3)" }}>
                Trade Account Benefits
              </p>
              {[
                { icon: "◈", title: "Verified Trade Pricing", body: "Direct wholesale pricing — no retail margin, no markups." },
                { icon: "✦", title: "Quote Within 24 Hours", body: "Every quote is handled personally with full stone disclosure." },
                { icon: "⬡", title: "Shortlist & Compare", body: "Save stones across sessions and request quotes in batches." },
                { icon: "◎", title: "Confidential & Discreet", body: "White-label sourcing available. All enquiries are private." },
              ].map(b => (
                <div
                  key={b.title}
                  className="flex gap-4 py-4"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <span className="text-base mt-0.5 shrink-0" style={{ color: "#1CA9C9" }}>{b.icon}</span>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-white mb-1">{b.title}</p>
                    <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{b.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[10px] leading-relaxed" style={{ color: "rgba(255,255,255,0.25)" }}>
              FLX Diamond operates exclusively with verified trade buyers. Access is reviewed and may be revoked at our discretion.
              All information is kept strictly confidential.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}