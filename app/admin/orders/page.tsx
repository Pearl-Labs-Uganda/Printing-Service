"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, Package } from "lucide-react";

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
  cancelled: "#e5e7eb",
};

const priorityColors: Record<string, string> = {
  normal: "#e5e7eb",
  express: "#fbbf24",
  urgent: "#f87171",
};

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        if (!response.ok) {
          throw new Error("Failed to load orders");
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const lowerSearch = search.toLowerCase();
      const matchesSearch =
        order.orderId?.toLowerCase().includes(lowerSearch) ||
        order.customerName?.toLowerCase().includes(lowerSearch) ||
        order.customerEmail?.toLowerCase().includes(lowerSearch);
      const matchesStatus = !selectedStatus || order.status === selectedStatus;
      const matchesPriority = !selectedPriority || order.priority === selectedPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [search, selectedStatus, selectedPriority, orders]);

  const fmt = (n: number) => `UGX ${n.toLocaleString()}`;

  return (
    <div style={{ maxWidth: 1400 }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-headline)", fontSize: "2rem", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "0.5rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
          <Package size={24} /> Orders
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>Manage all customer print orders</p>
      </div>

      {/* Filters */}
      <div style={{ background: "#fff", border: "1.5px solid var(--bg-container)", borderRadius: "var(--radius-lg)", padding: "1.5rem", marginBottom: "2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.25rem" }}>
          {/* Search */}
          <div>
            <label style={{ display: "block", fontFamily: "var(--font-label)", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
              Search
            </label>
            <div style={{ position: "relative" }}>
              <Search size={18} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
              <input
                type="text"
                placeholder="Order ID, customer name, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  paddingLeft: "2.5rem",
                  padding: "0.75rem 1rem",
                  border: "1.5px solid var(--bg-container)",
                  borderRadius: "var(--radius-sm)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.95rem",
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontFamily: "var(--font-label)", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
              Status
            </label>
            <select
              value={selectedStatus || ""}
              onChange={(e) => setSelectedStatus(e.target.value || null)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "1.5px solid var(--bg-container)",
                borderRadius: "var(--radius-sm)",
                fontFamily: "var(--font-body)",
                fontSize: "0.95rem",
              }}
            >
              <option value="">All statuses</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontFamily: "var(--font-label)", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
              Priority
            </label>
            <select
              value={selectedPriority || ""}
              onChange={(e) => setSelectedPriority(e.target.value || null)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "1.5px solid var(--bg-container)",
                borderRadius: "var(--radius-sm)",
                fontFamily: "var(--font-body)",
                fontSize: "0.95rem",
              }}
            >
              <option value="">All priorities</option>
              {priorityOptions.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", color: "var(--text-secondary)", padding: "3rem 0" }}>Loading orders…</div>
      ) : error ? (
        <div style={{ textAlign: "center", color: "#dc2626", padding: "3rem 0" }}>{error}</div>
      ) : (
        <div style={{ background: "#fff", border: "1.5px solid var(--bg-container)", borderRadius: "var(--radius-lg)", padding: "1.5rem", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ marginBottom: "1.25rem", fontFamily: "var(--font-label)", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            {filtered.length} of {orders.length} orders
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-secondary)" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>📭</div>
              <p>No orders found matching your filters.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--bg-container)" }}>
                    <th style={{ textAlign: "left", padding: "0.75rem 0", fontFamily: "var(--font-label)", fontWeight: 600, color: "var(--text-secondary)" }}>
                      Order ID
                    </th>
                    <th style={{ textAlign: "left", padding: "0.75rem 0", fontFamily: "var(--font-label)", fontWeight: 600, color: "var(--text-secondary)" }}>
                      Customer
                    </th>
                    <th style={{ textAlign: "left", padding: "0.75rem 0", fontFamily: "var(--font-label)", fontWeight: 600, color: "var(--text-secondary)" }}>
                      Priority
                    </th>
                    <th style={{ textAlign: "left", padding: "0.75rem 0", fontFamily: "var(--font-label)", fontWeight: 600, color: "var(--text-secondary)" }}>
                      Status
                    </th>
                    <th style={{ textAlign: "right", padding: "0.75rem 0", fontFamily: "var(--font-label)", fontWeight: 600, color: "var(--text-secondary)" }}>
                      Total
                    </th>
                    <th style={{ textAlign: "center", padding: "0.75rem 0", fontFamily: "var(--font-label)", fontWeight: 600, color: "var(--text-secondary)" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => (
                    <tr
                      key={order.id}
                      style={{
                        borderBottom: "1px solid var(--bg-container)",
                        transition: "background-color 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-container-low)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "0.75rem 0", fontFamily: "var(--font-label)", fontWeight: 600, color: "var(--brand-blue)" }}>
                        {order.orderId || order.id}
                      </td>
                      <td style={{ padding: "0.75rem 0" }}>
                        <div style={{ color: "var(--text-primary)", fontWeight: 500 }}>{order.customerName}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{order.customerEmail}</div>
                      </td>
                      <td style={{ padding: "0.75rem 0" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "0.35rem 0.75rem",
                            borderRadius: "9999px",
                            background: priorityColors[order.priority],
                            color: "#1f2937",
                            fontSize: "0.8rem",
                            fontFamily: "var(--font-label)",
                            fontWeight: 600,
                          }}
                        >
                          {order.priority}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem 0" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "0.35rem 0.75rem",
                            borderRadius: "9999px",
                            background: statusColors[order.status],
                            color: "#1f2937",
                            fontSize: "0.8rem",
                            fontFamily: "var(--font-label)",
                            fontWeight: 600,
                          }}
                        >
                          {order.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem 0", textAlign: "right", fontFamily: "var(--font-label)", fontWeight: 600, color: "var(--brand-blue)" }}>
                        {fmt(order.totalPrice)}
                      </td>
                      <td style={{ padding: "0.75rem 0", textAlign: "center" }}>
                        <Link href={`/admin/orders/${order.id}`} style={{ color: "var(--brand-orange)", textDecoration: "none", fontFamily: "var(--font-label)", fontWeight: 600, cursor: "pointer" }}>
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
