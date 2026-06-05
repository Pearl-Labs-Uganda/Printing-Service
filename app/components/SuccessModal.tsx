"use client";
import { X, PartyPopper } from "lucide-react";

interface Props {
  open: boolean;
  orderId: string;
  readyAt: string;
  onClose: () => void;
}

export default function SuccessModal({ open, orderId, readyAt, onClose }: Props) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
      style={{
        position: "fixed", inset: 0, background: "rgba(0,15,30,0.6)",
        backdropFilter: "blur(6px)", zIndex: 1000, display: "flex",
        alignItems: "center", justifyContent: "center", padding: "1.5rem",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-content" style={{ position: "relative", textAlign: "center", maxWidth: 460 }}>
        <button
          onClick={onClose}
          aria-label="Close success dialog"
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

        <h3 id="success-modal-title" style={{ fontFamily: "var(--font-headline)", fontSize: "1.5rem", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "0.5rem" }}>
          Order Confirmed!
        </h3>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1rem", lineHeight: 1.6 }}>
          Your deposit has been received and your order is confirmed. Our team will contact you shortly with delivery and post-processing details.
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

        <div style={{ textAlign: "left", marginBottom: "1rem", padding: "1rem", borderRadius: "var(--radius-sm)", background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1e3a8a" }}>
          <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Order Tracking</div>
          <ul style={{ margin: 0, paddingLeft: "1.2rem", lineHeight: 1.6, color: "#0f172a" }}>
            <li>Deposit received and order confirmed.</li>
            <li>Printing is now in process.</li>
            <li>Estimated ready by <strong>{readyAt}</strong>.</li>
          </ul>
        </div>

        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
          A confirmation will be sent to your email. Our team will contact you within 2 hours with delivery and finishing details.
        </p>

        <button
          onClick={onClose}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
            gap: "0.4rem", padding: "0.8rem 2rem", borderRadius: "var(--radius-sm)",
            border: "none", cursor: "pointer", fontFamily: "var(--font-label)",
            fontSize: "1rem", fontWeight: 600, background: "var(--brand-blue)", color: "#fff",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
