"use client";
import { X, PartyPopper, ArrowRight } from "lucide-react";

interface Props {
  open: boolean;
  orderId: string;
  onClose: () => void;
  onViewSlicer: () => void;
}

export default function SuccessModal({ open, orderId, onClose, onViewSlicer }: Props) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,15,30,0.6)",
        backdropFilter: "blur(6px)", zIndex: 1000, display: "flex",
        alignItems: "center", justifyContent: "center", padding: "1.5rem",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: "var(--bg-surface)", border: "1.5px solid var(--bg-container)",
          borderRadius: "var(--radius-xl)", padding: "2.5rem", maxWidth: 460, width: "100%",
          position: "relative", boxShadow: "var(--shadow-lg)", textAlign: "center",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "1rem", right: "1rem", background: "var(--bg-container)",
            border: "none", width: 32, height: 32, borderRadius: "var(--radius-sm)",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <X size={16} />
        </button>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem", color: "var(--brand-orange)" }}>
          <PartyPopper size={48} strokeWidth={1.5} />
        </div>

        <h3 style={{ fontFamily: "var(--font-headline)", fontSize: "1.5rem", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "0.5rem" }}>
          Order Confirmed!
        </h3>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1rem", lineHeight: 1.6 }}>
          Your deposit has been received. Your order is in the queue and the slicer preview is now unlocked.
        </p>

        <div
          style={{
            background: "var(--bg-container-low)", border: "1.5px dashed var(--bg-dim)",
            borderRadius: "var(--radius-sm)", padding: "0.75rem",
            fontFamily: "var(--font-label)", fontSize: "0.9rem", fontWeight: 700,
            color: "var(--brand-blue)", letterSpacing: "0.08em", margin: "1rem 0",
          }}
        >
          {orderId}
        </div>

        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
          A confirmation will be sent to your email. Our team will contact you within 2 hours with a print timeline.
        </p>

        <button
          onClick={() => { onClose(); onViewSlicer(); }}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
            gap: "0.4rem", padding: "0.8rem 2rem", borderRadius: "var(--radius-sm)",
            border: "none", cursor: "pointer", fontFamily: "var(--font-label)",
            fontSize: "1rem", fontWeight: 600, background: "var(--brand-blue)", color: "#fff",
          }}
        >
          View Slicing Preview <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
