"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Save, User, Settings, CreditCard, Edit, MapPin, FileText, XCircle } from "lucide-react";

const statusOptions = ["pending_payment", "deposit_paid", "printing", "quality_check", "ready_for_pickup", "shipped", "delivered", "cancelled"];
const priorityOptions = ["normal", "express", "urgent"];

const statusColors: Record<string, string> = {
  pending_payment: "#fca5a5",
  deposit_paid: "#fbbf24",
  printing: "#93c5fd",
  quality_check: "#d8b4fe",
  ready_for_pickup: "#86efac",
  shipped: "#67e8f9",
  delivered: "#6ee7b7",
  cancelled: "#e5e5e7",
};

const statusSteps = ["pending_payment", "deposit_paid", "printing", "quality_check", "ready_for_pickup", "shipped", "delivered"];

export default function OrderDetail({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<string>("pending_payment");
  const [priority, setPriority] = useState<string>("normal");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${params.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError("Order not found");
          } else {
            setError("Failed to load order");
          }
          return;
        }

        const data = await response.json();
        setOrder(data);
        setStatus(data.status || "pending_payment");
        setPriority(data.priority || "normal");
        setNotes(data.notes || "");
      } catch (err) {
        console.error(err);
        setError("Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id]);

  const handleSave = async () => {
    if (!order) return;

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, priority, notes }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      const updated = await response.json();
      setOrder(updated);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const fmt = (n: number) => `UGX ${n.toLocaleString()}`;

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
        <p style={{ color: "var(--text-secondary)" }}>Loading order details…</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}><XCircle size={48} /></div>
        <h1 style={{ fontFamily: "var(--font-headline)", fontSize: "1.5rem", fontWeight: 700, color: "var(--brand-blue)" }}>
          {error || "Order not found"}
        </h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem", marginBottom: "1.5rem" }}>
          The order ID {params.id} does not exist.
        </p>
        <Link href="/admin/orders" style={{ color: "var(--brand-orange)", textDecoration: "none", fontFamily: "var(--font-label)", fontWeight: 600 }}>
          ← Back to orders
        </Link>
      </div>
    );
  }

  const printConfig = {
    layerHeight: order.layerHeight,
    infill: order.infill,
    quality: order.quality,
  };

  const stepIndex = statusSteps.indexOf(status);

  return (
    <div style={{ maxWidth: 1000 }}>
      <Link href="/admin/orders" style={{ color: "var(--text-secondary)", textDecoration: "none", fontFamily: "var(--font-label)", fontSize: "0.9rem", marginBottom: "1.5rem", display: "inline-block" }}>
        ← Back to orders
      </Link>

      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-headline)", fontSize: "2rem", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "0.5rem" }}>
          Order {order.orderId || order.id}
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>Manage order details and status</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
        <div>
          <div style={{ background: "#fff", border: "1.5px solid var(--bg-container)", borderRadius: "var(--radius-lg)", padding: "1.5rem", marginBottom: "1.5rem" }}>
            <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.1rem", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "1rem" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}><User size={18} /> Customer Info</span>
            </h2>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <div>
                <div style={{ fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
                  Name
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--text-primary)" }}>{order.customerName}</div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
                  Email
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--text-primary)" }}>{order.customerEmail}</div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
                  Phone
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--text-primary)" }}>{order.customerPhone}</div>
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", border: "1.5px solid var(--bg-container)", borderRadius: "var(--radius-lg)", padding: "1.5rem" }}>
            <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.1rem", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "1rem" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}><Settings size={18} /> Print Configuration</span>
            </h2>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <div>
                <div style={{ fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
                  File Name
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--text-primary)" }}>{order.fileName}</div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
                  Material & Colour
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--text-primary)" }}>
                  {order.material} · {order.colour}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
                  Quantity
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--text-primary)" }}>{order.quantity} item(s)</div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
                  Layer Height
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--text-primary)" }}>{printConfig.layerHeight}mm</div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
                  Infill & Quality
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--text-primary)" }}>
                  {printConfig.infill}% · {printConfig.quality}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div style={{ background: "#fff", border: "1.5px solid var(--bg-container)", borderRadius: "var(--radius-lg)", padding: "1.5rem", marginBottom: "1.5rem" }}>
            <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.1rem", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "1rem" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}><CreditCard size={18} /> Payment</span>
            </h2>
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ padding: "0.75rem", background: "var(--bg-container-low)", borderRadius: "var(--radius-sm)" }}>
                <div style={{ fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
                  Total Estimate
                </div>
                <div style={{ fontFamily: "var(--font-label)", fontSize: "1.3rem", fontWeight: 700, color: "var(--brand-blue)" }}>
                  {fmt(order.totalPrice)}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div style={{ padding: "0.75rem", background: "rgba(239,134,51,0.1)", borderRadius: "var(--radius-sm)" }}>
                  <div style={{ fontFamily: "var(--font-label)", fontSize: "0.7rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
                    Pay Now — 50%
                  </div>
                  <div style={{ fontFamily: "var(--font-label)", fontSize: "1.1rem", fontWeight: 700, color: "var(--brand-orange)" }}>
                    {fmt(order.depositPrice)}
                  </div>
                </div>
                <div style={{ padding: "0.75rem", background: "rgba(0,45,91,0.1)", borderRadius: "var(--radius-sm)" }}>
                  <div style={{ fontFamily: "var(--font-label)", fontSize: "0.7rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
                    On Delivery — 50%
                  </div>
                  <div style={{ fontFamily: "var(--font-label)", fontSize: "1.1rem", fontWeight: 700, color: "var(--brand-blue)" }}>
                    {fmt(order.balancePrice)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", border: "1.5px solid var(--bg-container)", borderRadius: "var(--radius-lg)", padding: "1.5rem" }}>
            <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.1rem", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "1rem" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}><Edit size={18} /> Update</span>
            </h2>
            <div style={{ display: "grid", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.75rem",
                    border: "1.5px solid var(--bg-container)",
                    borderRadius: "var(--radius-sm)",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9rem",
                  }}
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.75rem",
                    border: "1.5px solid var(--bg-container)",
                    borderRadius: "var(--radius-sm)",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9rem",
                  }}
                >
                  {priorityOptions.map((p) => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{
                    width: "100%",
                    minHeight: 120,
                    padding: "0.75rem 1rem",
                    border: "1.5px solid var(--bg-container)",
                    borderRadius: "var(--radius-sm)",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.95rem",
                  }}
                />
              </div>
              <button
                onClick={handleSave}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  background: saved ? "#16a34a" : "var(--brand-orange)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  fontFamily: "var(--font-label)",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                <Save size={16} /> {saved ? "Saved!" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1.5px solid var(--bg-container)", borderRadius: "var(--radius-lg)", padding: "2rem", marginBottom: "2rem" }}>
        <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.1rem", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "1.5rem" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}><MapPin size={18} /> Order Timeline</span>
        </h2>
        <div style={{ display: "grid", gap: "1rem" }}>
          {statusSteps.map((step, index) => (
            <div key={step} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "9999px",
                  background: index <= stepIndex ? "var(--brand-orange)" : "var(--bg-container)",
                  display: "grid",
                  placeItems: "center",
                  color: index <= stepIndex ? "#fff" : "var(--text-secondary)",
                  fontWeight: 700,
                }}
              >
                {index + 1}
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-label)", fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>
                  {step.replace(/_/g, " ")}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  {index <= stepIndex ? "Completed" : "Pending"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#fff", border: "1.5px solid var(--bg-container)", borderRadius: "var(--radius-lg)", padding: "1.5rem" }}>
        <div style={{ display: "grid", gap: "0.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
            <div>
              <div style={{ fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
                Estimated ready
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--text-primary)" }}>{order.readyAt || "TBD"}</div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
                Notes
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--text-primary)" }}>{order.notes || "No notes provided."}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
