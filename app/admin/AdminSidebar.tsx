"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, Printer, Package, Layers, BarChart2, Settings } from "lucide-react";
import { useAdminAuth } from "./AdminAuthContext";
import { useSidebar } from "./SidebarContext";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: <BarChart2 size={18} /> },
  { label: "Orders", href: "/admin/orders", icon: <Package size={18} /> },
  { label: "Materials", href: "/admin/materials", icon: <Layers size={18} /> },
  { label: "Analytics", href: "/admin/analytics", icon: <BarChart2 size={18} /> },
  { label: "Settings", href: "/admin/settings", icon: <Settings size={18} /> },
];

interface AdminSidebarProps {
  isMobile?: boolean;
}

export default function AdminSidebar({ isMobile = false }: AdminSidebarProps) {
  const { collapsed, setCollapsed } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
    router.push("/admin");
  };

  // For mobile we treat the sidebar as a drawer overlay. When collapsed on mobile
  // we hide it (width 0) and provide a floating toggle elsewhere to open it.
  const sidebarWidth = isMobile ? (collapsed ? 0 : "100%") : collapsed ? "80px" : "280px";

  return (
    <div
      role="navigation"
      aria-hidden={isMobile && collapsed}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        width: sidebarWidth,
        maxWidth: isMobile ? "100%" : "280px",
        background: "var(--brand-blue)",
        color: "#fff",
        overflow: sidebarWidth === 0 ? "hidden" : "auto",
        transition: "width 0.28s ease, transform 0.28s ease",
        transform: isMobile && collapsed ? "translateX(-100%)" : "translateX(0)",
        zIndex: 120,
        display: sidebarWidth === 0 ? "none" : "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: collapsed ? "none" : "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.3rem", fontWeight: 700, fontFamily: "var(--font-headline)" }}>
          <Printer size={18} />
          <span style={{ marginLeft: 8 }}>Pearl Labs</span>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "none",
            color: "#fff",
            padding: "0.5rem",
            borderRadius: "0.5rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "1.5rem 0", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                padding: "0.75rem 1rem",
                textDecoration: "none",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                fontSize: "0.95rem",
                fontFamily: "var(--font-label)",
                fontWeight: isActive ? 600 : 400,
                background: isActive ? "rgba(239,134,51,0.3)" : "transparent",
                borderLeft: isActive ? "3px solid var(--brand-orange)" : "3px solid transparent",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", gap: "1rem" }}>
        {!collapsed && (
          <div style={{ fontSize: "0.85rem", fontFamily: "var(--font-label)" }}>
            <div style={{ color: "rgba(255,255,255,0.6)", marginBottom: "0.25rem" }}>Signed in as</div>
            <div style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.email}</div>
          </div>
        )}
        <button
          onClick={handleLogout}
          style={{
            background: "rgba(239,134,51,0.2)",
            border: "1px solid rgba(239,134,51,0.4)",
            color: "#fff",
            padding: "0.5rem 0.75rem",
            borderRadius: "0.5rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: "0.5rem",
            fontFamily: "var(--font-label)",
            fontSize: "0.85rem",
            fontWeight: 500,
          }}
        >
          <LogOut size={16} />
          {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  );
}
