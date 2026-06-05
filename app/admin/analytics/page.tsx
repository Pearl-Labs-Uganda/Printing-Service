"use client";

import { useState, useEffect } from "react";

const statusList = ["pending_payment", "deposit_paid", "printing", "quality_check", "ready_for_pickup", "shipped", "delivered", "cancelled"];

export default function AnalyticsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        if (!response.ok) {
          throw new Error("Failed to load analytics data");
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const fmt = (n: number) => `UGX ${n.toLocaleString()}`;

  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const dailyRevenue = last7Days.map((date) => {
    const dayOrders = orders.filter(
      (o) =>
        new Date(o.createdAt).toDateString() === date.toDateString() &&
        !["pending_payment", "cancelled"].includes(o.status)
    );
    return dayOrders.reduce((sum, o) => sum + o.depositPrice, 0);
  });

  const maxDaily = dailyRevenue.length ? Math.max(...dailyRevenue) : 0;
  const totalRevenue = dailyRevenue.reduce((a, b) => a + b, 0);

  const revenueByMaterial = orders
    .filter((o) => !["pending_payment", "cancelled"].includes(o.status))
    .reduce(
      (acc: Array<{ material: string; revenue: number; count: number }>, o: any) => {
        const found = acc.find((m) => m.material === o.material);
        if (found) {
          found.revenue += o.depositPrice;
          found.count += 1;
        } else {
          acc.push({ material: o.material, revenue: o.depositPrice, count: 1 });
        }
        return acc;
      },
      []
    );

  const maxMaterialRevenue = revenueByMaterial.length ? Math.max(...revenueByMaterial.map((m) => m.revenue)) : 0;

  const ordersByStatus = statusList.map((status) => ({
    status,
    count: orders.filter((o) => o.status === status).length,
  }));

  const totalOrders = ordersByStatus.reduce((a, b) => a + b.count, 0);

  const topCustomers = orders
    .reduce((acc: Array<{ name: string; email: string; orders: number; spent: number }>, order: any) => {
      const found = acc.find((c) => c.email === order.customerEmail);
      if (found) {
        found.orders += 1;
        found.spent += order.depositPrice;
      } else {
        acc.push({
          name: order.customerName,
          email: order.customerEmail,
          orders: 1,
          spent: order.depositPrice,
        });
      }
      return acc;
    }, [])
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 5);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
        Loading analytics…
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "#dc2626" }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1400 }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-headline)", fontSize: "2rem", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "0.5rem" }}>
          📈 Analytics
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>Monitor business performance and trends</p>
      </div>

      <div style={{ background: "#fff", border: "1.5px solid var(--bg-container)", borderRadius: "var(--radius-lg)", padding: "1.5rem", marginBottom: "2rem", boxShadow: "var(--shadow-sm)" }}>
        <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.2rem", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "1.5rem" }}>
          Daily Revenue (Last 7 Days)
        </h2>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "0.75rem", height: 200, marginBottom: "1rem" }}>
          {dailyRevenue.map((revenue, i) => {
            const height = maxDaily > 0 ? (revenue / maxDaily) * 160 : 0;
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                <div
                  style={{
                    width: "100%",
                    height: height,
                    background: "linear-gradient(180deg, var(--brand-orange) 0%, #EF8633 100%)",
                    borderRadius: "var(--radius-sm) var(--radius-sm) 0 0",
                    minHeight: 20,
                  }}
                  title={fmt(revenue)}
                />
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", marginTop: "0.75rem" }}>
          {last7Days.map((date, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", fontSize: "0.8rem", color: "var(--text-secondary)", fontFamily: "var(--font-label)" }}>
              {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
          ))}
        </div>
        <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--bg-container)" }}>
          <div style={{ fontFamily: "var(--font-label)", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
            Total (7 days)
          </div>
          <div style={{ fontFamily: "var(--font-headline)", fontSize: "1.8rem", fontWeight: 700, color: "var(--brand-orange)" }}>
            {fmt(totalRevenue)}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
        <div style={{ background: "#fff", border: "1.5px solid var(--bg-container)", borderRadius: "var(--radius-lg)", padding: "1.5rem", boxShadow: "var(--shadow-sm)" }}>
          <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.2rem", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "1.5rem" }}>
            Revenue by Material
          </h2>
          <div style={{ display: "grid", gap: "1.25rem" }}>
            {revenueByMaterial.map((mat) => {
              const width = maxMaterialRevenue > 0 ? (mat.revenue / maxMaterialRevenue) * 100 : 0;
              return (
                <div key={mat.material}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                    <span style={{ fontFamily: "var(--font-label)", fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>
                      {mat.material}
                    </span>
                    <span style={{ fontFamily: "var(--font-label)", fontSize: "0.85rem", fontWeight: 600, color: "var(--brand-blue)" }}>
                      {fmt(mat.revenue)} ({mat.count} orders)
                    </span>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: 24,
                      background: "var(--bg-container)",
                      borderRadius: "var(--radius-sm)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${width}%`,
                        background: "linear-gradient(90deg, var(--brand-orange) 0%, #EF8633 100%)",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ background: "#fff", border: "1.5px solid var(--bg-container)", borderRadius: "var(--radius-lg)", padding: "1.5rem", boxShadow: "var(--shadow-sm)" }}>
          <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.2rem", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "1.5rem" }}>
            Orders by Status
          </h2>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {ordersByStatus.filter((s) => s.count > 0).map((stat) => {
              const percentage = totalOrders > 0 ? (stat.count / totalOrders) * 100 : 0;
              return (
                <div key={stat.status} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ minWidth: 120, fontSize: "0.8rem", fontFamily: "var(--font-label)", fontWeight: 600, color: "var(--text-secondary)" }}>
                    {stat.status.replace(/_/g, " ")}
                  </div>
                  <div style={{ flex: 1, height: 20, background: "var(--bg-container)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${percentage}%`,
                        background: "var(--brand-blue)",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                  <div style={{ minWidth: 40, textAlign: "right", fontSize: "0.85rem", fontFamily: "var(--font-label)", fontWeight: 600, color: "var(--brand-blue)" }}>
                    {stat.count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1.5px solid var(--bg-container)", borderRadius: "var(--radius-lg)", padding: "1.5rem", boxShadow: "var(--shadow-sm)" }}>
        <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.2rem", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "1.5rem" }}>
          Top Customers
        </h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--bg-container)" }}>
                <th style={{ textAlign: "left", padding: "0.75rem 0", fontFamily: "var(--font-label)", fontWeight: 600, color: "var(--text-secondary)" }}>
                  Name
                </th>
                <th style={{ textAlign: "left", padding: "0.75rem 0", fontFamily: "var(--font-label)", fontWeight: 600, color: "var(--text-secondary)" }}>
                  Email
                </th>
                <th style={{ textAlign: "right", padding: "0.75rem 0", fontFamily: "var(--font-label)", fontWeight: 600, color: "var(--text-secondary)" }}>
                  Orders
                </th>
                <th style={{ textAlign: "right", padding: "0.75rem 0", fontFamily: "var(--font-label)", fontWeight: 600, color: "var(--text-secondary)" }}>
                  Deposits
                </th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((customer) => (
                <tr key={customer.email} style={{ borderBottom: "1px solid var(--bg-container)" }}>
                  <td style={{ padding: "0.75rem 0", fontFamily: "var(--font-label)", fontWeight: 600, color: "var(--brand-blue)" }}>{customer.name}</td>
                  <td style={{ padding: "0.75rem 0", fontFamily: "var(--font-body)", color: "var(--text-primary)" }}>{customer.email}</td>
                  <td style={{ padding: "0.75rem 0", textAlign: "right", fontFamily: "var(--font-label)", fontWeight: 600, color: "var(--text-secondary)" }}>{customer.orders}</td>
                  <td style={{ padding: "0.75rem 0", textAlign: "right", fontFamily: "var(--font-label)", fontWeight: 600, color: "var(--brand-blue)" }}>{fmt(customer.spent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
