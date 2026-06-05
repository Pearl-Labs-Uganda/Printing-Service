"use client";
import { Layers, Zap, Droplets, Dumbbell, Gem, Cpu } from "lucide-react";

export interface Material {
  id: string;
  icon: React.ReactNode;
  name: string;
  desc: string;
  priceLabel: string;
  pricePerGram: number;
  available: boolean;
}

export const MATERIALS: Material[] = [
  { id: "PLA",              icon: <Layers   size={26} strokeWidth={1.5} />, name: "PLA",              pricePerGram: 0.5, priceLabel: "UGX 500 / gram", desc: "Great for prototypes and decorative pieces. Easy to print with excellent detail.", available: true },
  { id: "ABS",              icon: <Zap      size={26} strokeWidth={1.5} />, name: "ABS",              pricePerGram: 3.2, priceLabel: "UGX 3,200 / gram", desc: "High temperature & impact resistance. Ideal for functional engineering parts.", available: false },
  { id: "PETG",             icon: <Droplets size={26} strokeWidth={1.5} />, name: "PETG",             pricePerGram: 3.8, priceLabel: "UGX 3,800 / gram", desc: "Flexible and durable. Food-safe and moisture-resistant finish.", available: false },
  { id: "TPU",              icon: <Dumbbell size={26} strokeWidth={1.5} />, name: "TPU (Flexible)",   pricePerGram: 4.5, priceLabel: "UGX 4,500 / gram", desc: "Rubber-like flexibility. Perfect for gaskets, grips, and wearables.", available: false },
  { id: "Resin (SLA)",      icon: <Gem      size={26} strokeWidth={1.5} />, name: "Resin (SLA)",      pricePerGram: 6.0, priceLabel: "UGX 6,000 / gram", desc: "Ultra-fine detail and smooth surfaces. Ideal for jewellery and miniatures.", available: false },
  { id: "Carbon Fiber PLA", icon: <Cpu      size={26} strokeWidth={1.5} />, name: "Carbon Fiber PLA", pricePerGram: 5.5, priceLabel: "UGX 5,500 / gram", desc: "Stiff, lightweight, and strong. Premium structural performance.", available: false },
];

interface Props {
  selected: string;
  onSelect: (id: string, price: number) => void;
}

export default function Materials({ selected, onSelect }: Props) {
  return (
    <section id="materials" style={{ padding: "72px 2rem", background: "var(--bg-container-low)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ fontFamily: "var(--font-label)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--brand-orange)", marginBottom: "0.4rem" }}>
          Materials
        </div>
        <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "0.4rem", letterSpacing: "-0.3px" }}>
          Choose Your Material
        </h2>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "2.5rem", maxWidth: 520, lineHeight: 1.7 }}>
          Each material has unique strength, flexibility, and finish properties. Click to select.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "1rem" }}>
          {MATERIALS.map((m) => {
            const isSelected = selected === m.id;
            const disabled = !m.available;
            return (
              <button
                key={m.id}
                onClick={() => !disabled && onSelect(m.id, m.pricePerGram)}
                disabled={disabled}
                style={{
                  background: isSelected ? "var(--bg-container-low)" : "var(--bg-surface)",
                  border: `1.5px solid ${isSelected ? "var(--brand-blue)" : "var(--bg-container)"}`,
                  borderRadius: "var(--radius-md)",
                  padding: "1.5rem",
                  cursor: disabled ? "not-allowed" : "pointer",
                  opacity: disabled ? 0.6 : 1,
                  textAlign: "left",
                  transition: "all 0.2s",
                  boxShadow: isSelected ? "var(--shadow-md)" : "none",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Top bar accent */}
                <div
                  style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 3,
                    background: isSelected ? "var(--brand-orange)" : "var(--brand-blue)",
                    transform: isSelected ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "left",
                    transition: "transform 0.2s",
                    borderRadius: "3px 3px 0 0",
                  }}
                />
                <div style={{ color: "var(--brand-blue)", marginBottom: "0.75rem" }}>{m.icon}</div>
                <div style={{ fontFamily: "var(--font-headline)", fontSize: "1rem", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "0.3rem" }}>
                  {m.name}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "0.75rem" }}>
                  {m.desc}
                </div>
                <div style={{ fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 600, color: disabled ? "var(--text-secondary)" : "var(--brand-orange)" }}>
                  {m.priceLabel}
                  {disabled && <span style={{ display: "block", marginTop: "0.35rem", fontSize: "0.72rem", color: "var(--text-secondary)", fontWeight: 500 }}>
                    Currently unavailable
                  </span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
