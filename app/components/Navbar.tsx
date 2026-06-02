"use client";
import { Printer } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const navLinkStyle = (active: boolean): React.CSSProperties => ({
    padding: "0.45rem 0.9rem",
    fontFamily: "var(--font-label)",
    fontSize: "0.82rem",
    fontWeight: active ? 600 : 500,
    color: active ? "var(--brand-blue)" : "var(--text-secondary)",
    background: active ? "var(--bg-container-low)" : "transparent",
    borderRadius: "var(--radius-sm)",
    textDecoration: "none",
    display: "inline-block",
  });

  return (
    <nav className="site-nav">
      <div className="nav-inner container">
        {/* Logo */}
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none" }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              background: "var(--brand-blue)",
              borderRadius: "var(--radius-sm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            <Printer size={16} strokeWidth={2} />
          </div>
          <div style={{ fontFamily: "var(--font-headline)", fontWeight: 700, fontSize: "1rem", color: "var(--brand-blue)", lineHeight: 1.1 }}>
            Pearl Labs
            <span
              style={{
                display: "block",
                fontSize: "0.65rem",
                fontWeight: 500,
                color: "var(--text-secondary)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                fontFamily: "var(--font-label)",
              }}
            >
              3D Print Service
            </span>
          </div>
        </Link>

        {/* Links */}
        <button
          className="nav-toggle tap-target"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((s) => !s)}
        >
          <svg width="22" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <ul id="primary-navigation" className={`nav-links ${menuOpen ? "open" : ""}`} style={{ listStyle: "none" }}>
          <li>
            <Link href="/how-it-works" style={navLinkStyle(pathname === "/how-it-works")} onClick={() => setMenuOpen(false)}>
              How it works
            </Link>
          </li>
          <li>
            <Link href="/materials" style={navLinkStyle(pathname === "/materials")} onClick={() => setMenuOpen(false)}>
              Materials
            </Link>
          </li>
          <li>
            <button
              onClick={() => {
                setMenuOpen(false);
                scrollTo("slicer");
              }}
              style={{
                padding: "0.45rem 0.9rem",
                fontFamily: "var(--font-label)",
                fontSize: "0.82rem",
                fontWeight: 500,
                color: "var(--text-secondary)",
                background: "transparent",
                border: "none",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                transition: "color 0.15s, background 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--brand-blue)";
                (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-container-low)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              Slicer
            </button>
          </li>
          <li>
            <Link
              href="/#upload"
              className="tap-target"
              onClick={() => setMenuOpen(false)}
              style={{
                padding: "0.45rem 1rem",
                fontFamily: "var(--font-label)",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "#fff",
                background: "var(--brand-orange)",
                borderRadius: "var(--radius-sm)",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Get a Quote →
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}