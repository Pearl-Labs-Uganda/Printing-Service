"use client";
import { ArrowRight, Layers, Clock, Package } from "lucide-react";

const BAR_COLORS = [
  "#002D5B","#003F80","#EF8633","#6EAADC",
  "#002D5B","#EF8633","#003F80","#6EAADC",
  "#002D5B","#EF8633","#003F80","#6EAADC",
];
const BAR_HEIGHTS = [55,40,70,35,60,45,80,30,65,50,75,42];

export default function Hero() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      style={{
        background: "linear-gradient(160deg, var(--brand-blue) 0%, #003F80 60%, #004f9f 100%)",
        position: "relative",
        overflow: "hidden",
        padding: "80px 2rem 80px",
      }}
    >
      {/* Radial glows */}
      <div
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage:
            "radial-gradient(circle at 70% 50%, rgba(239,134,51,0.12) 0%, transparent 55%), radial-gradient(circle at 10% 80%, rgba(110,170,220,0.1) 0%, transparent 45%)",
        }}
      />
      {/* Grid */}
      <div
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div
        style={{
          maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1,
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center",
        }}
      >
        {/* Left */}
        <div>
          {/* Badge */}
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "rgba(239,134,51,0.18)", border: "1px solid rgba(239,134,51,0.4)",
              color: "#f9b96a", fontFamily: "var(--font-label)", fontSize: "0.72rem",
              fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
              padding: "0.3rem 0.9rem", borderRadius: 999, marginBottom: "1.25rem",
            }}
          >
            <span
              className="pulse-dot"
              style={{ width: 6, height: 6, background: "#f9b96a", borderRadius: "50%" }}
            />
            Accepting Orders Now
          </div>

          <h1
            style={{
              fontFamily: "var(--font-headline)", fontSize: "clamp(2.2rem, 4vw, 3.4rem)",
              fontWeight: 700, color: "#fff", lineHeight: 1.1,
              letterSpacing: "-0.5px", marginBottom: "1.25rem",
            }}
          >
            Turn Your{" "}
            <em style={{ color: "var(--brand-orange)", fontStyle: "normal" }}>3D Models</em>
            <br />Into Reality.
          </h1>

          <p
            style={{
              fontSize: "1rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.7,
              marginBottom: "2rem", fontWeight: 300, maxWidth: 460,
            }}
          >
            Upload your STL file, get an instant quotation, choose your settings — pay
            50% to unlock slicing and confirm your print.
          </p>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button
              onClick={() => scrollTo("upload")}
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                padding: "0.8rem 2rem", borderRadius: "var(--radius-sm)",
                fontFamily: "var(--font-label)", fontSize: "1rem", fontWeight: 600,
                background: "var(--brand-orange)", color: "#fff", border: "none", cursor: "pointer",
              }}
            >
              Upload STL &amp; Get Quote <ArrowRight size={16} />
            </button>
            <button
              onClick={() => scrollTo("how-it-works")}
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                padding: "0.8rem 2rem", borderRadius: "var(--radius-sm)",
                fontFamily: "var(--font-label)", fontSize: "1rem", fontWeight: 600,
                background: "transparent", color: "#fff",
                border: "1.5px solid rgba(255,255,255,0.5)", cursor: "pointer",
              }}
            >
              How it works
            </button>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "flex", gap: "2rem", marginTop: "2.5rem",
              paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            {[
              { label: "Prints Completed", value: "12,400+" },
              { label: "Avg Turnaround",   value: "48hrs"   },
              { label: "Materials",        value: "6+"      },
            ].map((s) => (
              <div key={s.label}>
                <span
                  style={{
                    display: "block", fontFamily: "var(--font-label)", fontSize: "0.7rem",
                    letterSpacing: "0.07em", textTransform: "uppercase",
                    color: "rgba(255,255,255,0.5)", marginBottom: 3,
                  }}
                >
                  {s.label}
                </span>
                <strong
                  style={{
                    fontFamily: "var(--font-headline)", fontSize: "1.6rem",
                    fontWeight: 700, color: "#fff", lineHeight: 1,
                  }}
                >
                  {s.value.replace(/(\d[\d,]+)(\+?)(hrs?)/, (_, n, plus, unit) => n)}
                  <span style={{ color: "var(--brand-orange)" }}>
                    {s.value.replace(/^[\d,]+/, "")}
                  </span>
                </strong>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Visual */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Print viz card */}
          <div
            style={{
              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "var(--radius-lg)", padding: "1.5rem", backdropFilter: "blur(8px)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-label)", fontSize: "0.72rem", fontWeight: 600,
                color: "rgba(255,255,255,0.6)", marginBottom: "0.75rem",
                textTransform: "uppercase", letterSpacing: "0.05em",
                display: "flex", alignItems: "center", gap: "0.4rem",
              }}
            >
              <Layers size={12} /> Live Print Visualisation
            </div>
            <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 64 }}>
              {BAR_HEIGHTS.map((h, i) => (
                <div
                  key={i}
                  className="layer-bar"
                  style={{
                    flex: 1,
                    height: `${h}%`,
                    background: BAR_COLORS[i],
                    opacity: 0.8,
                    borderRadius: "3px 3px 0 0",
                    animationDelay: `${i * 0.08}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Mini stats card */}
          <div
            style={{
              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "var(--radius-lg)", padding: "1.5rem", backdropFilter: "blur(8px)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-label)", fontSize: "0.72rem", fontWeight: 600,
                color: "rgba(255,255,255,0.6)", marginBottom: "0.75rem",
                textTransform: "uppercase", letterSpacing: "0.05em",
                display: "flex", alignItems: "center", gap: "0.4rem",
              }}
            >
              <Package size={12} /> Order at a Glance
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
              {[
                { val: "PLA", lbl: "Material" },
                { val: "0.2mm", lbl: "Layer" },
                { val: "30%", lbl: "Infill" },
              ].map((s) => (
                <div
                  key={s.lbl}
                  style={{
                    background: "rgba(255,255,255,0.06)", borderRadius: "var(--radius-sm)",
                    padding: "0.75rem", textAlign: "center",
                  }}
                >
                  <div style={{ fontFamily: "var(--font-headline)", fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>
                    {s.val}
                  </div>
                  <div style={{ fontFamily: "var(--font-label)", fontSize: "0.65rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {s.lbl}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Turnaround pill */}
          <div
            style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "var(--radius-md)", padding: "1rem 1.25rem",
            }}
          >
            <Clock size={20} style={{ color: "var(--brand-orange)", flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: "var(--font-headline)", fontWeight: 700, color: "#fff", fontSize: "0.9rem" }}>
                Avg. 48-hour turnaround
              </div>
              <div style={{ fontFamily: "var(--font-label)", fontSize: "0.72rem", color: "rgba(255,255,255,0.5)" }}>
                Express prints available on request
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
