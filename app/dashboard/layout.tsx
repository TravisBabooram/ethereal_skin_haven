"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Calendar, ShoppingBag, LogOut, Home, UserCog, Menu, X } from "lucide-react";

const NAV = [
  { href: "/",                  label: "Home",       icon: Home },
  { href: "/dashboard",         label: "Overview",   icon: User },
  { href: "/dashboard/bookings",label: "My Bookings",icon: Calendar },
  { href: "/dashboard/cart",    label: "Cart",       icon: ShoppingBag },
  { href: "/dashboard/profile", label: "My Profile", icon: UserCog },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.push("/");
  };

  const sidebar = (
    <aside style={{ width: 260, background: "var(--bg-card)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", padding: "40px 0", position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 40 }}>
      <div style={{ padding: "0 32px 32px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <p style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 8, letterSpacing: "0.4em", color: "var(--gold)", textTransform: "uppercase", margin: 0 }}>Ethereal</p>
          <p style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 16, letterSpacing: "0.12em", color: "var(--text)", textTransform: "uppercase", margin: "3px 0 0" }}>Skin Haven</p>
        </Link>
        <button className="sidebar-close-btn" onClick={() => setOpen(false)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}>
          <X size={16} />
        </button>
      </div>

      <nav style={{ flex: 1, padding: "28px 16px" }}>
        <p style={{ fontSize: 8, letterSpacing: "0.35em", color: "var(--text-subtle)", textTransform: "uppercase", fontWeight: 600, padding: "0 16px", marginBottom: 12 }}>My Account</p>
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} onClick={() => setOpen(false)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 16px", borderRadius: 4, textDecoration: "none", color: active ? "var(--gold)" : "var(--text-muted)", background: active ? "rgba(201,169,110,0.06)" : "transparent", fontSize: 13, fontWeight: active ? 500 : 400, transition: "all 0.2s", marginBottom: 2 }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.background = "var(--bg-elevated)"; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; } }}
            >
              <Icon size={15} />{label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: "24px 16px", borderTop: "1px solid var(--border)" }}>
        <button onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 16px", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 13, borderRadius: 4, transition: "all 0.2s", textAlign: "left" }}
          onMouseEnter={e => { e.currentTarget.style.color = "#e05555"; e.currentTarget.style.background = "rgba(220,60,60,0.06)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; }}
        >
          <LogOut size={15} />Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      {open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 39 }} onClick={() => setOpen(false)} />
      )}

      <div className="dashboard-sidebar-wrap">
        {sidebar}
      </div>

      {open && (
        <div className="dashboard-sidebar-mobile">
          {sidebar}
        </div>
      )}

      {/* Mobile top bar */}
      <div className="dashboard-mobile-bar" style={{ display: "none", position: "fixed", top: 0, left: 0, right: 0, height: 56, background: "var(--bg-card)", borderBottom: "1px solid var(--border)", zIndex: 30, alignItems: "center", padding: "0 20px", gap: 16 }}>
        <button onClick={() => setOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}>
          <Menu size={20} />
        </button>
        <span style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 16, letterSpacing: "0.12em", color: "var(--text)", textTransform: "uppercase" }}>My Account</span>
      </div>

      <main className="dashboard-main" style={{ flex: 1, marginLeft: 260, padding: "48px" }}>
        {children}
      </main>

      <style>{`
        @media (max-width: 900px) {
          .dashboard-sidebar-wrap { display: none !important; }
          .dashboard-mobile-bar { display: flex !important; }
          .dashboard-main { margin-left: 0 !important; padding: 76px 20px 40px !important; }
          .sidebar-close-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
