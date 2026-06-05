"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { useAdminAuth } from "./AdminAuthContext";
import { AdminAuthProvider } from "./AdminAuthContext";
import { SidebarProvider, useSidebar } from "./SidebarContext";
import { Mail } from "lucide-react";

function AdminLoginGate({ children }: { children: React.ReactNode }) {
  const { user, loading, login } = useAdminAuth();
  const { collapsed, setCollapsed } = useSidebar();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateMobile = () => setIsMobile(window.innerWidth < 900);
    updateMobile();
    window.addEventListener("resize", updateMobile);
    return () => window.removeEventListener("resize", updateMobile);
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "var(--bg)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🖨️</div>
          <div style={{ fontFamily: "var(--font-headline)", fontSize: "1.5rem", fontWeight: 700, color: "var(--brand-blue)" }}>Pearl Labs Admin</div>
          <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, var(--brand-blue) 0%, #003F80 100%)",
          padding: "1.5rem",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "var(--radius-lg)",
            padding: "3rem 2rem",
            maxWidth: 420,
            width: "100%",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🖨️</div>
            <h1 style={{ fontFamily: "var(--font-headline)", fontSize: "1.8rem", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "0.5rem" }}>
              Pearl Labs Admin
            </h1>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Manage orders, materials, and analytics</p>
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!email.includes("@")) {
                setError("Please enter a valid email");
                return;
              }
              if (!password) {
                setError("Please enter your password");
                return;
              }

              try {
                await login(email, password);
                setError("");
              } catch (err: any) {
                setError(err?.message || "Invalid credentials");
              }
            }}
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            <div>
              <label htmlFor="email" style={{ display: "block", fontFamily: "var(--font-label)", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="pearllabsug@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  border: "1.5px solid var(--bg-container)",
                  borderRadius: "var(--radius-sm)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.95rem",
                  color: "var(--text-primary)",
                  background: "var(--bg-surface)",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                }}
              />
            </div>

            <div>
              <label htmlFor="password" style={{ display: "block", fontFamily: "var(--font-label)", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  border: "1.5px solid var(--bg-container)",
                  borderRadius: "var(--radius-sm)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.95rem",
                  color: "var(--text-primary)",
                  background: "var(--bg-surface)",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                }}
              />
            </div>

            {error && <div style={{ fontSize: "0.8rem", color: "#dc2626", marginTop: "0.35rem" }}>{error}</div>}

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "0.8rem",
                background: "var(--brand-orange)",
                color: "#fff",
                border: "none",
                borderRadius: "var(--radius-sm)",
                fontFamily: "var(--font-label)",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <Mail size={18} /> Sign in
            </button>
          </form>

          <div style={{ marginTop: "1.5rem", padding: "1rem", background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "var(--radius-sm)", fontSize: "0.8rem", color: "#166534" }}>
            <strong style={{ display: "block", marginBottom: "0.35rem" }}>Restricted Access</strong>
            This admin panel is accessible only with the Pearl Labs admin email and password.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar isMobile={isMobile} />
      {/* Floating toggle for mobile when sidebar is collapsed */}
      {isMobile && collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          aria-label="Open menu"
          style={{
            position: "fixed",
            top: 12,
            left: 12,
            zIndex: 140,
            background: "var(--brand-blue)",
            color: "#fff",
            border: "none",
            padding: "0.6rem",
            borderRadius: 8,
            boxShadow: "var(--shadow-md)",
            cursor: "pointer",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      )}
      <main
        style={{
          flex: 1,
          marginLeft: isMobile ? 0 : collapsed ? "80px" : "280px",
          padding: "2rem",
          background: "var(--bg)",
          transition: "margin-left 0.3s ease",
          overflowX: "hidden",
        }}
      >
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <SidebarProvider>
        <AdminLoginGate>{children}</AdminLoginGate>
      </SidebarProvider>
    </AdminAuthProvider>
  );
}
