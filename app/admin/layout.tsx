"use client";

import { useState } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, Calendar, Users, Package, Image, FileText, HelpCircle, LogOut, Shield, ShoppingBag, UserCog, Layout, Search, Menu, X, Sun, Moon, Settings } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

const NAV = [
  { href: "/admin",          label: "Overview",        icon: BarChart3 },
  { href: "/admin/calendar", label: "Calendar",        icon: Calendar },
  { href: "/admin/bookings", label: "Bookings",        icon: FileText },
  { href: "/admin/services", label: "Services",        icon: Package },
  { href: "/admin/products", label: "Products",        icon: Package },
  { href: "/admin/users",    label: "Clients",         icon: Users },
  { href: "/admin/cart",     label: "Customer Carts",  icon: ShoppingBag },
  { href: "/admin/homepage", label: "Homepage",        icon: Layout },
  { href: "/admin/seo",      label: "SEO",             icon: Search },
  { href: "/admin/gallery",  label: "Gallery",         icon: Image },
  { href: "/admin/faq",      label: "FAQ",             icon: HelpCircle },
  { href: "/admin/policies", label: "Policies",        icon: FileText },
  { href: "/admin/settings", label: "Settings",         icon: Settings },
  { href: "/admin/profile",  label: "My Profile",      icon: UserCog },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.push("/");
  };

  const sidebar = (
    <aside style={{ width: 240, background: "var(--bg-card)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", padding: "36px 0", position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 40, transition: "transform 0.3s", transform: open ? "translateX(0)" : undefined }}>
      <div style={{ padding: "0 24px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ textDecoration: "none", display: "inline-flex" }}>
          <div className="logo-wrap" style={{ width: 52, height: 52 }}>
            <NextImage src="/logo.png" alt="Ethereal Skin Haven" width={52} height={52} style={{ display: "block" }} />
          </div>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Shield size={10} style={{ color: "var(--gold)" }} />
            <span style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase" }}>Admin</span>
          </div>
          <button className="sidebar-close-btn" onClick={() => setOpen(false)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}>
            <X size={16} />
          </button>
        </div>
      </div>

      <nav style={{ flex: 1, padding: "20px 12px", overflowY: "auto" }}>
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} onClick={() => setOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 4, textDecoration: "none", color: active ? "var(--gold)" : "var(--text-muted)", background: active ? "rgba(201,169,110,0.07)" : "transparent", fontSize: 12, fontWeight: active ? 500 : 400, transition: "all 0.2s", marginBottom: 2 }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.background = "var(--bg-elevated)"; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; } }}
            >
              <Icon size={14} />{label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: "16px 12px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "none", border: "none", cursor: "pointer", borderRadius: 4, transition: "background 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-elevated)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-muted)", fontSize: 12 }}>
            {theme === "dark" ? <Sun size={14} style={{ color: "var(--gold)" }} /> : <Moon size={14} style={{ color: "var(--gold)" }} />}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </div>
          {/* Pill toggle */}
          <div style={{ width: 34, height: 18, borderRadius: 9, background: theme === "dark" ? "rgba(201,169,110,0.25)" : "rgba(201,169,110,0.5)", border: "1px solid var(--border-hover)", position: "relative", transition: "background 0.3s", flexShrink: 0 }}>
            <div style={{ position: "absolute", top: 2, left: theme === "dark" ? 2 : 16, width: 12, height: 12, borderRadius: "50%", background: "var(--gold)", transition: "left 0.3s cubic-bezier(0.22,1,0.36,1)", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
          </div>
        </button>

        {/* Sign out */}
        <button onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 12, borderRadius: 4, transition: "all 0.2s", textAlign: "left" }}
          onMouseEnter={e => { e.currentTarget.style.color = "#e05555"; e.currentTarget.style.background = "rgba(220,60,60,0.06)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; }}
        >
          <LogOut size={14} />Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      {/* Mobile overlay */}
      {open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 39 }} onClick={() => setOpen(false)} />
      )}

      {/* Sidebar — hidden on mobile via CSS, shown via toggle */}
      <div className="admin-sidebar-wrap">
        {sidebar}
      </div>

      {/* Mobile-only sidebar overlay */}
      {open && (
        <div className="admin-sidebar-mobile">
          {sidebar}
        </div>
      )}

      {/* Mobile top bar */}
      <div className="admin-mobile-bar" style={{ display: "none", position: "fixed", top: 0, left: 0, right: 0, height: 56, background: "var(--bg-card)", borderBottom: "1px solid var(--border)", zIndex: 30, alignItems: "center", padding: "0 20px", gap: 16 }}>
        <button onClick={() => setOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}>
          <Menu size={20} />
        </button>
        <span style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 16, letterSpacing: "0.12em", color: "var(--text)", textTransform: "uppercase", flex: 1 }}>Admin Panel</span>
        <button onClick={toggleTheme} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gold)", display: "flex", padding: 4 }} aria-label="Toggle theme">
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <main className="admin-main" style={{ flex: 1, marginLeft: 240, padding: "40px 48px" }}>
        {children}
      </main>

      <style>{`
        @media (max-width: 900px) {
          .admin-sidebar-wrap { display: none !important; }
          .admin-mobile-bar { display: flex !important; }
          .admin-main { margin-left: 0 !important; padding: 76px 20px 40px !important; }
          .sidebar-close-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
