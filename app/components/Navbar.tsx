"use client";
import { Printer } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

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
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(244,250,255,0.92)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--bg-container)",
        padding: "0 2rem",
      }}
    >
      <div
        className="nav-inner"
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 60,
          gap: "2rem",
        }}
      >
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
        <ul className="nav-links" style={{ display: "flex", alignItems: "center", gap: "0.25rem", listStyle: "none" }}>
          <li>
            <Link href="/how-it-works" style={navLinkStyle(pathname === "/how-it-works")}>
              How it works
            </Link>
          </li>
          <li>
            <Link href="/materials" style={navLinkStyle(pathname === "/materials")}>
              Materials
            </Link>
          </li>
          <li>
            <button
              onClick={() => scrollTo("slicer")}
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