import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";

/* ── 3D Diamond profile icon ─────────────────────────────────── */
function DiamondProfileIcon({ initial }: { initial: string }) {
  return (
    <div style={{ position: "relative", width: "38px", height: "42px", flexShrink: 0 }}>
      <svg viewBox="0 0 100 112" width="38" height="42" style={{ display: "block" }}>
        <defs>
          <linearGradient id="dp-top" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9EEEFF" />
            <stop offset="50%" stopColor="#1CA9C9" />
            <stop offset="100%" stopColor="#0B7A96" />
          </linearGradient>
          <linearGradient id="dp-left" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0A5F78" />
            <stop offset="100%" stopColor="#1590AE" />
          </linearGradient>
          <linearGradient id="dp-right" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1BBAD8" />
            <stop offset="100%" stopColor="#3CD4F0" />
          </linearGradient>
          <linearGradient id="dp-bottom" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0E7A95" />
            <stop offset="100%" stopColor="#063D4F" />
          </linearGradient>
          <filter id="dp-glow">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#1CA9C9" floodOpacity="0.65"/>
          </filter>
        </defs>
        {/* Top-left facet */}
        <polygon points="50,4 2,38 50,56" fill="url(#dp-top)" filter="url(#dp-glow)" />
        {/* Top-right facet */}
        <polygon points="50,4 98,38 50,56" fill="url(#dp-right)" />
        {/* Left facet */}
        <polygon points="2,38 50,56 2,74" fill="url(#dp-left)" />
        {/* Right facet */}
        <polygon points="98,38 50,56 98,74" fill="url(#dp-right)" opacity="0.7" />
        {/* Bottom-left facet */}
        <polygon points="2,74 50,56 50,108" fill="url(#dp-bottom)" />
        {/* Bottom-right facet */}
        <polygon points="98,74 50,56 50,108" fill="url(#dp-bottom)" opacity="0.6" />
        {/* Top edge highlight */}
        <polygon points="50,4 2,38 50,56" fill="rgba(255,255,255,0.18)" />
        {/* Glint */}
        <ellipse cx="34" cy="26" rx="9" ry="5" fill="rgba(255,255,255,0.5)" transform="rotate(-30,34,26)" />
      </svg>
      {/* Initial letter overlay */}
      <div style={{
        position: "absolute", top: "44%", left: "50%",
        transform: "translate(-50%,-50%)",
        color: "white", fontSize: "13px", fontWeight: 700,
        fontFamily: "'Playfair Display', serif",
        textShadow: "0 1px 4px rgba(0,0,0,0.6)",
        letterSpacing: "0.04em", lineHeight: 1,
        pointerEvents: "none", userSelect: "none",
      }}>
        {initial.toUpperCase()}
      </div>
    </div>
  );
}

/* ── Profile dropdown ────────────────────────────────────────── */
function ProfileDropdown({ user, onLogout }: { user: { firstName?: string; lastName?: string; email: string; company: string }, onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const initial = user.firstName?.[0] ?? user.email?.[0] ?? "U";

  return (
    <div ref={ref} style={{ position: "relative", display: "flex", alignItems: "center", gap: "10px" }}>
      {/* Welcome text */}
      <span style={{
        fontSize: "10px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.65)",
        fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap",
      }}>
        Welcome,{" "}
        <span style={{ color: "#1CA9C9", fontWeight: 600 }}>{user.firstName}</span>
      </span>

      {/* Diamond icon button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}
        aria-label="Account menu"
      >
        <DiamondProfileIcon initial={initial} />
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 14px)", right: 0,
          background: "rgba(1,26,53,0.97)", border: "1px solid rgba(28,169,201,0.2)",
          backdropFilter: "blur(16px)", minWidth: "200px", zIndex: 200,
          boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
        }}>
          {/* User info */}
          <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid rgba(28,169,201,0.1)" }}>
            <p style={{ fontSize: "12px", color: "white", fontFamily: "'Inter', sans-serif", fontWeight: 500, marginBottom: "2px" }}>
              {user.firstName} {user.lastName}
            </p>
            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.38)", fontFamily: "'Inter', sans-serif" }}>
              {user.email}
            </p>
            {user.company && (
              <p style={{ fontSize: "9px", color: "#1CA9C9", letterSpacing: "0.1em", marginTop: "4px", fontFamily: "'Inter', sans-serif" }}>
                {user.company}
              </p>
            )}
          </div>

          <div style={{ padding: "6px 0" }}>
            <Link href="/diamonds">
              <button
                onClick={() => setOpen(false)}
                style={{
                  width: "100%", padding: "9px 16px", background: "none", border: "none",
                  cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: "8px",
                  color: "rgba(255,255,255,0.7)", fontSize: "11px",
                  letterSpacing: "0.06em", fontFamily: "'Inter', sans-serif",
                  transition: "color 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "#1CA9C9")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5"/>
                  <line x1="12" y1="22" x2="12" y2="15.5"/>
                  <polyline points="22,8.5 12,15.5 2,8.5"/>
                </svg>
                Diamond Inventory
              </button>
            </Link>

            <button
              onClick={() => { setOpen(false); onLogout(); }}
              style={{
                width: "100%", padding: "9px 16px", background: "none", border: "none",
                cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: "8px",
                color: "rgba(255,255,255,0.45)", fontSize: "11px",
                letterSpacing: "0.06em", fontFamily: "'Inter', sans-serif",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                transition: "color 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#ff7070")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const [location, navigate] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const isHome = location === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 72);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [location]);

  const links = [
    { href: "/diamonds",   label: "Collection" },
    { href: "/services",   label: "Expertise" },
    { href: "/investment", label: "IF to FL" },
    { href: "/about",      label: "About" },
    { href: "/trade",        label: "Trade" },
    { href: "/journal",    label: "Journal" },
    { href: "/contact",    label: "Talk to us" },
  ];

  const solid = !isHome || scrolled;

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        solid ? "border-b" : "border-b border-transparent"
      )}
      style={{
        background: solid ? "rgba(2,39,74,0.96)" : "transparent",
        borderColor: solid ? "rgba(28,169,201,0.12)" : "transparent",
        backdropFilter: solid ? "blur(14px)" : "none",
        WebkitBackdropFilter: solid ? "blur(14px)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0" data-testid="nav-logo">
          <img
            src="/flx-logo.png"
            alt="FLX Diamond"
            style={{ height: "44px", width: "auto", mixBlendMode: "screen" }}
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-testid={`nav-link-${link.label.toLowerCase()}`}
              className={cn(
                "text-[10px] tracking-[0.18em] uppercase font-medium transition-all duration-200 relative py-2",
                location === link.href
                  ? "text-white"
                  : "text-white/55 hover:text-white"
              )}
            >
              {link.label}
              {location === link.href && (
                <span
                  className="absolute bottom-0 left-0 w-full h-px"
                  style={{ background: "#1CA9C9" }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right side: user section */}
        <div className="hidden md:flex items-center">
          {isAuthenticated && user ? (
            <ProfileDropdown user={user} onLogout={handleLogout} />
          ) : (
            <Link href="/login">
              <button style={{
                fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase",
                color: "#1CA9C9", background: "none",
                border: "1px solid rgba(28,169,201,0.4)",
                padding: "8px 16px", cursor: "pointer",
                fontFamily: "'Inter', sans-serif", fontWeight: 500,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(28,169,201,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
              >
                Trade Login
              </button>
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                className="text-white/70 hover:text-white p-2 transition-colors"
                data-testid="btn-mobile-menu"
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#02274A] border-none text-white w-full sm:max-w-sm p-0">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b flex items-center" style={{ borderColor: "rgba(28,169,201,0.12)" }}>
                  <img src="/flx-logo.png" alt="FLX Diamond" style={{ height: "40px", width: "auto", mixBlendMode: "screen" }} />
                </div>
                <div className="flex-1 py-10 px-6 flex flex-col gap-7">
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "font-serif text-2xl tracking-wide transition-colors",
                        location === link.href ? "text-white" : "text-white/50"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="p-6 border-t space-y-3" style={{ borderColor: "rgba(28,169,201,0.1)" }}>
                  {isAuthenticated && user ? (
                    <div>
                      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", marginBottom: "10px" }}>
                        Signed in as <span style={{ color: "#1CA9C9" }}>{user.firstName}</span>
                      </p>
                      <button onClick={handleLogout}
                        style={{ fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif" }}>
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <Link href="/login">
                      <span style={{ fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#1CA9C9" }}>
                        Trade Login →
                      </span>
                    </Link>
                  )}
                  <p className="text-[9px] tracking-widest text-white/30 uppercase">Geelong, VIC, Australia</p>
                  <p className="text-xs tracking-wide" style={{ color: "rgba(28,169,201,0.7)" }}>info@flxdiamond.com</p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </nav>
  );
}