"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BarChart2, Package, Clock, CreditCard, AlertTriangle } from "lucide-react";

interface Order {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  totalPrice: number;
  material: string;
  colour: string;
  status: string;
  depositPrice: number;
  createdAt: string;
}

interface Material {
  id: string;
  name: string;
  inStock: boolean;
}

function StatCard({ icon, label, value, trend }: { icon: React.ReactNode; label: string; value: string | number; trend?: string }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid var(--bg-container)",
        borderRadius: "var(--radius-lg)",
        padding: "1.5rem",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{icon}</div>
      <div style={{ fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
        {label}
      </div>
      <div style={{ fontFamily: "var(--font-headline)", fontSize: "2rem", fontWeight: 700, color: "var(--brand-blue)", marginBottom: trend ? "0.5rem" : 0 }}>
        {value}
      </div>
      {trend && <div style={{ fontFamily: "var(--font-label)", fontSize: "0.75rem", color: "#16a34a" }}>{trend}</div>}
    </div>
  );
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, materialsRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/materials"),
        ]);
        const ordersData = await ordersRes.json();
        const materialsData = await materialsRes.json();
        setOrders(ordersData);
        setMaterials(materialsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalOrders = orders.length;
  const activeOrders = orders.filter((o) => ["pending_payment", "deposit_paid", "printing", "quality_check"].includes(o.status)).length;
  const depositsCollected = orders
    .filter((o) => !["pending_payment", "cancelled"].includes(o.status))
    .reduce((sum, o) => sum + o.depositPrice, 0);
  const pendingPayments = orders.filter((o) => o.status === "pending_payment").length;

  const recentOrders = orders.slice(0, 5);

  const fmt = (n: number) => `UGX ${n.toLocaleString()}`;

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

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1400 }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-headline)", fontSize: "2rem", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "0.5rem" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
            <BarChart2 size={24} /> Dashboard
          </span>
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>Welcome back. Here's an overview of your 3D printing lab.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
        <StatCard icon={<Package size={28} />} label="Total Orders" value={totalOrders} trend={`${((activeOrders / totalOrders) * 100).toFixed(0)}% active`} />
        <StatCard icon={<Clock size={28} />} label="Active Orders" value={activeOrders} trend={`${totalOrders - activeOrders} completed`} />
        <StatCard icon={<CreditCard size={28} />} label="Deposits Collected" value={fmt(depositsCollected)} trend="From completed orders" />
        <StatCard icon={<AlertTriangle size={28} />} label="Pending Payments" value={pendingPayments} trend="Awaiting deposit" />
      </div>

      {/* Recent Orders */}
      <div style={{ background: "#fff", border: "1.5px solid var(--bg-container)", borderRadius: "var(--radius-lg)", padding: "2rem", marginBottom: "2.5rem", boxShadow: "var(--shadow-sm)" }}>
        <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.3rem", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "1.5rem" }}>
          Recent Orders
        </h2>
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
                  Material
                </th>
                <th style={{ textAlign: "left", padding: "0.75rem 0", fontFamily: "var(--font-label)", fontWeight: 600, color: "var(--text-secondary)" }}>
                  Status
                </th>
                <th style={{ textAlign: "right", padding: "0.75rem 0", fontFamily: "var(--font-label)", fontWeight: 600, color: "var(--text-secondary)" }}>
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
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
                    <Link href={`/admin/orders/${order.id}`} style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}>
                      {order.orderId}
                    </Link>
                  </td>
                  <td style={{ padding: "0.75rem 0", color: "var(--text-primary)" }}>{order.customerName}</td>
                  <td style={{ padding: "0.75rem 0", color: "var(--text-primary)" }}>{order.material}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link href="/admin/orders" style={{ display: "inline-block", marginTop: "1.5rem", textDecoration: "none", color: "var(--brand-blue)", fontFamily: "var(--font-label)", fontWeight: 600 }}>
          View all orders →
        </Link>
      </div>

      {/* Materials */}
      <div style={{ background: "#fff", border: "1.5px solid var(--bg-container)", borderRadius: "var(--radius-lg)", padding: "2rem", boxShadow: "var(--shadow-sm)" }}>
        <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.3rem", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "1.5rem" }}>
          Material Stock Summary
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {materials.map((mat) => (
            <div key={mat.id} style={{ border: "1.5px solid var(--bg-container)", borderRadius: "var(--radius-md)", padding: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <div>
                  <h3 style={{ fontFamily: "var(--font-headline)", fontSize: "1.1rem", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "0.25rem" }}>
                    {mat.name}
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>{mat.description}</p>
                </div>
                <span
                  style={{
                    display: "inline-block",
                    padding: "0.35rem 0.75rem",
                    borderRadius: "9999px",
                    background: mat.inStock ? "#dcfce7" : "#fee2e2",
                    color: mat.inStock ? "#166534" : "#991b1b",
                    fontSize: "0.75rem",
                    fontFamily: "var(--font-label)",
                    fontWeight: 600,
                  }}
                >
                  {mat.inStock ? "✓ In Stock" : "⚠ Low Stock"}
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--bg-container)" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
                    Price
                  </div>
                  <div style={{ fontFamily: "var(--font-label)", fontSize: "1.1rem", fontWeight: 700, color: "var(--brand-orange)" }}>
                    UGX {mat.pricePerGram}/g
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
                    Colours
                  </div>
                  <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                    {mat.colours.split(",").map((colour: string) => (
                      <span key={colour} style={{ fontSize: "0.75rem", fontFamily: "var(--font-label)", fontWeight: 600, color: "#666" }}>
                        {colour.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Link href="/admin/materials" style={{ display: "inline-block", marginTop: "1.5rem", textDecoration: "none", color: "var(--brand-blue)", fontFamily: "var(--font-label)", fontWeight: 600 }}>
          Manage materials →
        </Link>
      </div>
    </div>
  );
}
