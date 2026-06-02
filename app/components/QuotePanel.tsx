"use client";
import { CheckCircle, Info } from "lucide-react";

export interface QuoteData {
  wt: number;
  hrs: number;
  rm: number;
  qty: number;
  total: number;
  half: number;
  bal: number;
  customCol: boolean;
  mat: string;
  lh: number;
  inf: number;
}

interface Props {
  status: "idle" | "loading" | "ready";
  quote: QuoteData | null;
  onPay: () => void;
}

const fmt = (n: number) => `UGX ${n.toLocaleString()}`;

export default function QuotePanel({ status, quote, onPay }: Props) {
  return (
    <div
      className="quote-panel"
      style={{
        background: "var(--bg-surface)",
        border: "1.5px solid var(--bg-container)",
        borderRadius: "var(--radius-lg)",
        padding: "2rem",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div style={{ fontFamily: "var(--font-headline)", fontSize: "1.1rem", fontWeight: 700, color: "var(--brand-blue)" }}>
          Your Quote
        </div>
        {status === "idle" && (
          <span style={{ background: "var(--bg-container)", color: "var(--text-secondary)", padding: "0.2rem 0.65rem", borderRadius: 999, fontFamily: "var(--font-label)", fontSize: "0.7rem", fontWeight: 600 }}>
            Awaiting File
          </span>
        )}
        {status === "loading" && (
          <span style={{ background: "#fef9c3", color: "#a16207", padding: "0.2rem 0.65rem", borderRadius: 999, fontFamily: "var(--font-label)", fontSize: "0.7rem", fontWeight: 600 }}>
            Calculating…
          </span>
        )}
        {status === "ready" && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", background: "#dcfce7", color: "#16a34a", padding: "0.2rem 0.65rem", borderRadius: 999, fontFamily: "var(--font-label)", fontSize: "0.7rem", fontWeight: 600 }}>
            <CheckCircle size={11} /> Ready
          </span>
        )}
      </div>

      {/* Idle */}
      {status === "idle" && (
        <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: "var(--text-secondary)" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem", color: "var(--bg-dim)" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <p style={{ fontSize: "0.875rem", lineHeight: 1.6 }}>
            Upload an STL file above to generate your instant price estimate. We&apos;ll calculate material, weight, and print time automatically.
          </p>
        </div>
      )}

      {/* Loading */}
      {status === "loading" && (
        <div style={{ textAlign: "center", padding: "2.5rem 0" }}>
          <div
            className="spinner"
            style={{
              width: 36, height: 36, border: "3px solid var(--bg-container)",
              borderTopColor: "var(--brand-blue)", borderRadius: "50%", margin: "0 auto 0.75rem",
            }}
          />
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Analysing your model…</p>
        </div>
      )}

      {/* Ready */}
      {status === "ready" && quote && (
        <>
          {[
            ["Material",      quote.mat],
            ["Est. Weight",   `~${quote.wt}g`],
            ["Print Time",    quote.hrs > 0 ? `${quote.hrs}h ${quote.rm}m` : `${quote.rm}m`],
            ["Layer Height",  `${quote.lh}mm`],
            ["Infill",        `${quote.inf}%`],
            ["Quantity",      `${quote.qty}`],
            ["Material Cost", fmt(quote.total - 15000 - (quote.customCol ? 5000 : 0))],
            ["Setup Fee",     "UGX 15,000"],
            ...(quote.customCol ? [["Custom Colour", "UGX 5,000"]] : []),
          ].map(([lbl, val]) => (
            <div
              key={lbl}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "0.65rem 0", borderBottom: "1px solid var(--bg-container)", fontSize: "0.875rem",
              }}
            >
              <span style={{ color: "var(--text-secondary)" }}>{lbl}</span>
              <span style={{ fontFamily: "var(--font-label)", fontWeight: 600 }}>{val}</span>
            </div>
          ))}

          {/* Total */}
          <div
            style={{
              background: "linear-gradient(135deg, var(--brand-blue), #003F80)",
              borderRadius: "var(--radius-md)", padding: "1.5rem",
              textAlign: "center", margin: "1.25rem 0",
            }}
          >
            <div style={{ fontFamily: "var(--font-label)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: "0.4rem" }}>
              Total Estimate
            </div>
            <div style={{ fontFamily: "var(--font-headline)", fontSize: "2.2rem", fontWeight: 700, color: "#fff" }}>
              {fmt(quote.total)}
            </div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginTop: "0.35rem" }}>
              VAT may apply · Quote valid 48 hours
            </div>
          </div>

          {/* Split */}
          <div className="split-grid" style={{ marginBottom: "1.25rem" }}>
            <div
              style={{
                background: "rgba(239,134,51,0.06)", border: "1.5px solid rgba(239,134,51,0.35)",
                borderRadius: "var(--radius-sm)", padding: "1rem", textAlign: "center",
              }}
            >
              <div style={{ fontFamily: "var(--font-label)", fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)", marginBottom: "0.3rem" }}>
                Pay Now — 50%
              </div>
              <div style={{ fontFamily: "var(--font-headline)", fontSize: "1.15rem", fontWeight: 700, color: "var(--brand-orange)" }}>
                {fmt(quote.half)}
              </div>
            </div>
            <div
              style={{
                background: "var(--bg-container-low)", border: "1.5px solid var(--bg-container)",
                borderRadius: "var(--radius-sm)", padding: "1rem", textAlign: "center",
              }}
            >
              <div style={{ fontFamily: "var(--font-label)", fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)", marginBottom: "0.3rem" }}>
                On Delivery — 50%
              </div>
              <div style={{ fontFamily: "var(--font-headline)", fontSize: "1.15rem", fontWeight: 700, color: "var(--brand-blue)" }}>
                {fmt(quote.bal)}
              </div>
            </div>
          </div>

          {/* Info */}
          <div
            style={{
              display: "flex", gap: "0.6rem", background: "var(--bg-container-low)",
              border: "1px solid var(--bg-container-high)", borderRadius: "var(--radius-sm)",
              padding: "0.75rem 1rem", marginBottom: "1.25rem", fontSize: "0.8rem",
              color: "var(--text-secondary)", lineHeight: 1.5, alignItems: "flex-start",
            }}
          >
            <Info size={15} style={{ flexShrink: 0, marginTop: 1, color: "var(--brand-blue)" }} />
            <span>
              Paying 50% now confirms your order and <strong>unlocks the slicing preview</strong> so you can inspect the print layer-by-layer before we start.
            </span>
          </div>

          <button
            onClick={onPay}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
              padding: "0.8rem 2rem", borderRadius: "var(--radius-sm)", border: "none", cursor: "pointer",
              fontFamily: "var(--font-label)", fontSize: "1rem", fontWeight: 600,
              background: "var(--brand-orange)", color: "#fff",
            }}
          >
            Confirm Order &amp; Pay 50% Deposit →
          </button>
        </>
      )}
    </div>
  );
}
