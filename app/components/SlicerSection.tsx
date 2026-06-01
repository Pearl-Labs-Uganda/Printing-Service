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
          <div
            style={{
              padding: "1rem 1.5rem", borderBottom: "1px solid var(--bg-container)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "var(--bg-surface)",
            }}
          >
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
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.35rem",
                padding: "0.2rem 0.65rem", borderRadius: 999,
                fontFamily: "var(--font-label)", fontSize: "0.7rem", fontWeight: 600,
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
              <div
                style={{
                  position: "absolute", inset: 0, background: "rgba(244,250,255,0.95)",
                  backdropFilter: "blur(10px)", display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", textAlign: "center",
                  padding: "3rem", zIndex: 10,
                }}
              >
                <Lock size={40} strokeWidth={1.5} style={{ color: "var(--brand-blue)", marginBottom: "1rem" }} />
                <div
                  style={{
                    fontFamily: "var(--font-headline)", fontSize: "1.4rem",
                    fontWeight: 700, color: "var(--brand-blue)", marginBottom: "0.5rem",
                  }}
                >
                  Slicing Preview Locked
                </div>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", maxWidth: 400, lineHeight: 1.7, marginBottom: "1.75rem" }}>
                  Pay your 50% deposit to unlock the full slicing environment. You'll see exactly how your model is sliced, layer count, support structures, and material paths before printing begins.
                </p>
                <button
                  onClick={onUnlockClick}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.4rem",
                    padding: "0.8rem 2rem", borderRadius: "var(--radius-sm)", border: "none",
                    fontFamily: "var(--font-label)", fontSize: "1rem", fontWeight: 600,
                    background: "var(--brand-blue)", color: "#fff", cursor: "pointer",
                  }}
                >
                  <Unlock size={16} /> Unlock Slicer — Pay 50% Deposit
                </button>
              </div>
            )}
            <iframe
              src="https://grid.space/kiri/"
              title="Kiri:Moto 3D Slicer"
              allow="fullscreen"
              style={{ width: "100%", height: 580, border: "none", display: "block", background: "#f8f9fa" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
