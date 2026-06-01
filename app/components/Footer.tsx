import { Printer } from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--brand-blue)",
        color: "rgba(255,255,255,0.6)",
        padding: "2.5rem 2rem",
        textAlign: "center",
        fontFamily: "var(--font-label)",
        fontSize: "0.8rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
        <Printer size={14} strokeWidth={1.5} style={{ color: "rgba(255,255,255,0.5)" }} />
        <strong style={{ color: "#fff", fontFamily: "var(--font-headline)" }}>Pearl Labs</strong>
        <span>3D Print Service</span>
      </div>
      <div>Kampala, Uganda · © {new Date().getFullYear()} Pearl Labs. All rights reserved.</div>
    </footer>
  );
}
