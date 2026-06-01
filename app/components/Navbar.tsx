"use client";
import { Printer } from "lucide-react";

export default function Navbar() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

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
        <a
          href="#"
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
        </a>

        {/* Links */}
        <ul style={{ display: "flex", alignItems: "center", gap: "0.25rem", listStyle: "none" }}>
          {[
            { label: "How it works", id: "how-it-works" },
            { label: "Materials", id: "materials" },
            { label: "Slicer", id: "slicer" },
          ].map((l) => (
            <li key={l.id}>
              <button
                onClick={() => scrollTo(l.id)}
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
                {l.label}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => scrollTo("upload")}
              style={{
                padding: "0.45rem 1rem",
                fontFamily: "var(--font-label)",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "#fff",
                background: "var(--brand-orange)",
                border: "none",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
              }}
            >
              Get a Quote →
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
