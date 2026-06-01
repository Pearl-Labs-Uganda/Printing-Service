import { Upload, Calculator, CreditCard, PackageCheck } from "lucide-react";

const STEPS = [
  {
    num: "01",
    icon: <Upload size={22} strokeWidth={1.5} style={{ color: "var(--brand-blue)" }} />,
    title: "Upload Your STL",
    body: "Drag and drop your STL file. Our system analyses the geometry to calculate material usage and print time.",
    badge: null,
  },
  {
    num: "02",
    icon: <Calculator size={22} strokeWidth={1.5} style={{ color: "var(--brand-blue)" }} />,
    title: "Get Instant Quote",
    body: "Choose material, layer height, and infill. An itemised price is generated immediately based on your model.",
    badge: null,
  },
  {
    num: "03",
    icon: <CreditCard size={22} strokeWidth={1.5} style={{ color: "var(--brand-blue)" }} />,
    title: "Pay 50% Deposit",
    body: "Confirm your order with a 50% deposit. This unlocks the slicing preview so you can verify the print.",
    badge: { label: "50% to Start", color: "var(--brand-orange)" },
  },
  {
    num: "04",
    icon: <PackageCheck size={22} strokeWidth={1.5} style={{ color: "var(--brand-blue)" }} />,
    title: "Receive Your Print",
    body: "We print, quality-check, and ship. Remaining 50% is settled on delivery or before dispatch.",
    badge: { label: "50% on Delivery", color: "#16a34a" },
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: "72px 2rem", background: "var(--bg)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ fontFamily: "var(--font-label)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--brand-orange)", marginBottom: "0.4rem" }}>
          Process
        </div>
        <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "0.4rem", letterSpacing: "-0.3px" }}>
          How it Works
        </h2>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "2.5rem", maxWidth: 520, lineHeight: 1.7 }}>
          From file upload to finished print in four clear steps. No hidden costs.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1.5px",
            background: "var(--bg-container)",
            border: "1.5px solid var(--bg-container)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
          }}
        >
          {STEPS.map((s) => (
            <div
              key={s.num}
              style={{
                background: "var(--bg-surface)",
                padding: "2rem 1.5rem",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = "var(--bg-container-low)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = "var(--bg-surface)")}
            >
              <div style={{ fontFamily: "var(--font-headline)", fontSize: "2.5rem", fontWeight: 700, color: "var(--bg-container)", lineHeight: 1, marginBottom: "0.75rem" }}>
                {s.num}
              </div>
              <div style={{ marginBottom: "0.75rem" }}>{s.icon}</div>
              <h3 style={{ fontFamily: "var(--font-headline)", fontSize: "1rem", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "0.5rem" }}>
                {s.title}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {s.body}
              </p>
              {s.badge && (
                <div style={{ marginTop: "0.75rem" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "0.2rem 0.65rem",
                      borderRadius: 999,
                      fontFamily: "var(--font-label)",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      background: s.badge.color,
                      color: "#fff",
                    }}
                  >
                    {s.badge.label}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
