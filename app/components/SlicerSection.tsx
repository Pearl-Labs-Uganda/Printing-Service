"use client";
import { Lock, Unlock, Scissors } from "lucide-react";

interface Props {
  unlocked: boolean;
  onUnlockClick: () => void;
}

export default function SlicerSection({ unlocked, onUnlockClick }: Props) {
  return (
    <section id="slicer" style={{ padding: "72px 2rem", background: "var(--bg-container-low)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ fontFamily: "var(--font-label)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--brand-orange)", marginBottom: "0.4rem" }}>
          3D Slicer
        </div>
        <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "0.4rem", letterSpacing: "-0.3px" }}>
          Slice Preview
        </h2>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "2.5rem", maxWidth: 520, lineHeight: 1.7 }}>
          Inspect every layer of your print before production begins. Unlocked after your 50% deposit is paid.
        </p>

        <div
          style={{
            background: "var(--bg-surface)", border: "1.5px solid var(--bg-container)",
            borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-md)",
          }}
        >
          {/* Top bar */}
          <div className="top-row" style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--bg-container)", background: "var(--bg-surface)" }}>
            <h3
              style={{
                fontFamily: "var(--font-headline)", fontSize: "1rem", fontWeight: 700,
                color: "var(--brand-blue)", display: "flex", alignItems: "center", gap: "0.5rem",
              }}
            >
              <Scissors size={16} strokeWidth={1.5} />
              Online Slicer — Powered by Kiri:Moto
            </h3>
            <span
              className="status-pill"
              style={{
                background: unlocked ? "#dcfce7" : "var(--bg-container)",
                color: unlocked ? "#16a34a" : "var(--text-secondary)",
              }}
            >
              {unlocked ? <Unlock size={11} /> : <Lock size={11} />}
              {unlocked ? "Unlocked" : "Locked — Pay Deposit to Unlock"}
            </span>
          </div>

          {/* Slicer + overlay */}
          <div style={{ position: "relative" }}>
              {!unlocked && (
                <div className="slicer-overlay">
                  <Lock size={40} strokeWidth={1.5} style={{ color: "var(--brand-blue)", marginBottom: "1rem" }} />
                  <div style={{ fontFamily: "var(--font-headline)", fontSize: "1.4rem", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "0.5rem" }}>
                    Slicing Preview Locked
                  </div>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", maxWidth: 400, lineHeight: 1.7, marginBottom: "1.75rem" }}>
                    Pay your 50% deposit to unlock the full slicing environment. You&apos;ll see exactly how your model is sliced, layer count, support structures, and material paths before printing begins.
                  </p>
                  <button onClick={onUnlockClick} className="slicer-unlock-btn">
                    <Unlock size={16} /> Unlock Slicer — Pay 50% Deposit
                  </button>
                </div>
              )}
            <iframe
              className="slicer-iframe"
              src="https://grid.space/kiri/"
              title="Kiri:Moto 3D Slicer"
              allow="fullscreen"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
