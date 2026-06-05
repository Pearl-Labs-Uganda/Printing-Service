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
}

export default function PaymentModal({ open, quote, fileName, onClose }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fmt = (n: number) => `UGX ${n.toLocaleString()}`;
  const fieldIds = {
    name: "payment-full-name",
    email: "payment-email",
    phone: "payment-phone",
  };

  const handlePay = async () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError("Please fill in all your details.");
      return;
    }

    if (!quote) {
      setError("Missing quote information.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cleanedPhone = phone.trim().replace(/\s+/g, "");
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name.trim(),
          customerEmail: email.trim(),
          customerPhone: cleanedPhone,
          fileName,
          material: quote.mat,
          colour: quote.colour || "White",
          quantity: quote.qty,
          layerHeight: quote.lh,
          infill: quote.inf,
          quality: quote.quality,
          printType: quote.printType,
          postProcessing: quote.postProcessing,
          postProcessingCost: quote.postProcessingCost,
          readyAt: quote.readyAt,
          estWeightGrams: Math.round(quote.wt),
          estPrintHours: quote.hrs,
          estPrintMinutes: quote.rm,
          totalAmount: quote.total,
        }),
      });

      if (!orderResponse.ok) {
        const data = await orderResponse.json();
        throw new Error(data?.error || "Failed to create order");
      }

      const order = await orderResponse.json();
      const initResponse = await fetch("/api/flutterwave/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.orderId }),
      });

      if (!initResponse.ok) {
        const data = await initResponse.json();
        throw new Error(data?.error || "Failed to initialize payment");
      }

      const initData = await initResponse.json();
      if (!initData.checkoutUrl) {
        throw new Error("Unable to load payment checkout link.");
      }

      window.location.href = initData.checkoutUrl;
    } catch (err: any) {
      setError(err.message || String(err));
      setLoading(false);
    }
  };

  if (!open || !quote) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
      style={{
        position: "fixed", inset: 0, background: "rgba(0,15,30,0.6)",
        backdropFilter: "blur(6px)", zIndex: 1000, display: "flex",
        alignItems: "center", justifyContent: "center", padding: "1.5rem",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-content" style={{ position: "relative", width: "min(100%, 640px)" }}>
        <button
          onClick={onClose}
          aria-label="Close payment dialog"
          style={{
            position: "absolute", top: "1rem", right: "1rem", background: "var(--bg-container)",
            border: "none", width: 32, height: 32, borderRadius: "var(--radius-sm)",
            cursor: "pointer", color: "var(--text-secondary)", display: "flex",
            alignItems: "center", justifyContent: "center",
          }}
        >
          <X size={16} />
        </button>

        <h3 id="payment-modal-title" style={{ fontFamily: "var(--font-headline)", fontSize: "1.4rem", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "0.4rem" }}>
          Confirm Order &amp; Pay Deposit
        </h3>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1.75rem", lineHeight: 1.6 }}>
          Review your quote below and continue to Flutterwave for the 50% deposit payment.
        </p>

        <div style={{ background: "var(--bg-container-low)", border: "1px solid var(--bg-container-high)", borderRadius: "var(--radius-md)", padding: "1.25rem", marginBottom: "1.25rem" }}>
          {[
            ["File", fileName],
            ["Material", quote.mat],
            ["Print Type", quote.printType],
            ["Post-processing", quote.postProcessing],
            ["Settings", `${quote.lh}mm · ${quote.inf}% infill`],
            ["Quantity", `${quote.qty}`],
          ].map(([label, value]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "0.45rem 0", fontSize: "0.875rem", borderBottom: "1px solid var(--bg-container)" }}>
              <span style={{ color: "var(--text-secondary)" }}>{label}</span>
              <span style={{ fontFamily: "var(--font-label)", fontWeight: 600 }}>{value}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "2px solid var(--bg-container-high)", fontWeight: 700 }}>
            <span style={{ color: "var(--text-primary)" }}>Total</span>
            <span style={{ fontFamily: "var(--font-label)", color: "var(--brand-blue)", fontSize: "1.1rem" }}>{fmt(quote.total)}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.6rem", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "var(--radius-sm)", padding: "0.75rem 1rem", marginBottom: "1.5rem", fontSize: "0.8rem", color: "#92400e", lineHeight: 1.5, alignItems: "flex-start" }}>
          <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>You are paying <strong>{fmt(quote.half)}</strong> (50% deposit). The remaining 50% is due on delivery or before dispatch.</span>
        </div>

        {error && (
          <div style={{ display: "flex", gap: "0.6rem", background: "#fee2e2", border: "1px solid #fecaca", borderRadius: "var(--radius-sm)", padding: "0.75rem 1rem", marginBottom: "1.25rem", fontSize: "0.85rem", color: "#991b1b", alignItems: "flex-start" }}>
            <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{error}</span>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
          {[
            { label: "Full Name", type: "text", val: name, set: setName, ph: "Jane Appleseed" },
            { label: "Email Address", type: "email", val: email, set: setEmail, ph: "jane@example.com" },
            { label: "Phone Number", type: "tel", val: phone, set: setPhone, ph: "+256 700 000 000" },
          ].map((field) => (
            <div key={field.label} style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <label htmlFor={field.label.replace(/\s+/g, "-").toLowerCase()} style={{ fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-primary)" }}>{field.label}</label>
              <input
                id={field.label.replace(/\s+/g, "-").toLowerCase()}
                type={field.type}
                placeholder={field.ph}
                value={field.val}
                autoComplete={field.type === "email" ? "email" : field.type === "tel" ? "tel" : "name"}
                onChange={(e) => field.set(e.target.value)}
                style={INPUT_STYLE}
              />
            </div>
          ))}
        </div>

        <div className="modal-actions" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, minWidth: 130, padding: "0.65rem", borderRadius: "var(--radius-sm)",
              background: "var(--bg-container)", color: "var(--text-primary)", border: "none", cursor: "pointer",
              fontFamily: "var(--font-label)", fontSize: "0.875rem", fontWeight: 600,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handlePay}
            disabled={loading}
            style={{
              flex: 1, minWidth: 180, padding: "0.65rem", borderRadius: "var(--radius-sm)",
              background: "var(--brand-orange)", color: "#fff", border: "none",
              cursor: loading ? "not-allowed" : "pointer", fontFamily: "var(--font-label)",
              fontSize: "0.875rem", fontWeight: 600, opacity: loading ? 0.7 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
            }}
          >
            {loading ? (
              <span className="spinner" style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block" }} />
            ) : (
              <><CreditCard size={14} /> Pay Deposit Now →</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
