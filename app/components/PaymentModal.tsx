"use client";
import { useState } from "react";
import { X, AlertTriangle, CreditCard } from "lucide-react";
import { QuoteData } from "./QuotePanel";

const INPUT_STYLE: React.CSSProperties = {
  padding: "0.6rem 0.9rem", border: "1.5px solid var(--bg-container-high)",
  borderRadius: "var(--radius-sm)", fontFamily: "var(--font-body)", fontSize: "0.875rem",
  color: "var(--text-primary)", background: "var(--bg-surface)", outline: "none", width: "100%",
};

interface Props {
  open: boolean;
  quote: QuoteData | null;
  fileName: string;
  onClose: () => void;
  onSuccess: (orderId: string) => void;
}

export default function PaymentModal({ open, quote, fileName, onClose, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open || !quote) return null;

  const fmt = (n: number) => `UGX ${n.toLocaleString()}`;

  const handlePay = () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      alert("Please fill in all your details.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const id = "PL3D-" + Math.floor(10000 + Math.random() * 90000);
      onSuccess(id);
    }, 2000);
  };

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
          borderRadius: "var(--radius-xl)", padding: "2.5rem", maxWidth: 500, width: "100%",
          position: "relative", boxShadow: "var(--shadow-lg)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "1rem", right: "1rem", background: "var(--bg-container)",
            border: "none", width: 32, height: 32, borderRadius: "var(--radius-sm)",
            cursor: "pointer", color: "var(--text-secondary)", display: "flex",
            alignItems: "center", justifyContent: "center",
          }}
        >
          <X size={16} />
        </button>

        <h3 style={{ fontFamily: "var(--font-headline)", fontSize: "1.4rem", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "0.4rem" }}>
          Confirm Order &amp; Pay Deposit
        </h3>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1.75rem", lineHeight: 1.6 }}>
          Review your quote below. A 50% deposit confirms your order and unlocks the slicing preview.
        </p>

        {/* Summary */}
        <div style={{ background: "var(--bg-container-low)", border: "1px solid var(--bg-container-high)", borderRadius: "var(--radius-md)", padding: "1.25rem", marginBottom: "1.25rem" }}>
          {[
            ["File",      fileName],
            ["Material",  quote.mat],
            ["Settings",  `${quote.lh}mm · ${quote.inf}% infill`],
            ["Quantity",  `${quote.qty}`],
          ].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "0.45rem 0", fontSize: "0.875rem", borderBottom: "1px solid var(--bg-container)" }}>
              <span style={{ color: "var(--text-secondary)" }}>{l}</span>
              <span style={{ fontFamily: "var(--font-label)", fontWeight: 600 }}>{v}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "2px solid var(--bg-container-high)", fontWeight: 700 }}>
            <span style={{ color: "var(--text-primary)" }}>Total</span>
            <span style={{ fontFamily: "var(--font-label)", color: "var(--brand-blue)", fontSize: "1.1rem" }}>{fmt(quote.total)}</span>
          </div>
        </div>

        {/* Warning */}
        <div style={{ display: "flex", gap: "0.6rem", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "var(--radius-sm)", padding: "0.75rem 1rem", marginBottom: "1.5rem", fontSize: "0.8rem", color: "#92400e", lineHeight: 1.5, alignItems: "flex-start" }}>
          <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>You are paying <strong>{fmt(quote.half)}</strong> (50% deposit). The remaining 50% is due on delivery or before dispatch.</span>
        </div>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
          {[
            { label: "Full Name",     type: "text",  val: name,  set: setName,  ph: "Jane Appleseed"       },
            { label: "Email Address", type: "email", val: email, set: setEmail, ph: "jane@example.com"     },
            { label: "Phone Number",  type: "tel",   val: phone, set: setPhone, ph: "+256 700 000 000"     },
          ].map((f) => (
            <div key={f.label} style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <label style={{ fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-primary)" }}>{f.label}</label>
              <input
                type={f.type} placeholder={f.ph} value={f.val}
                onChange={(e) => f.set(e.target.value)} style={INPUT_STYLE}
              />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "0.65rem", borderRadius: "var(--radius-sm)",
              background: "var(--bg-container)", color: "var(--text-primary)",
              border: "none", cursor: "pointer", fontFamily: "var(--font-label)",
              fontSize: "0.875rem", fontWeight: 600,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handlePay}
            disabled={loading}
            style={{
              flex: 1, padding: "0.65rem", borderRadius: "var(--radius-sm)",
              background: "var(--brand-orange)", color: "#fff",
              border: "none", cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "var(--font-label)", fontSize: "0.875rem", fontWeight: 600,
              opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center",
              justifyContent: "center", gap: "0.4rem",
            }}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block" }} />
                Processing…
              </>
            ) : (
              <><CreditCard size={14} /> Pay Deposit Now →</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
