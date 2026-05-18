"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Calendar, TrendingUp, Clock, ArrowRight, Loader2, Package, AlertTriangle, ToggleLeft, ToggleRight, Wrench, BookOpen } from "lucide-react";
import AdminGuide from "@/components/admin/AdminGuide";

interface Stats {
  totalUsers: number;
  totalBookings: number;
  todayBookings: number;
  totalRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  upcomingBookings: Array<{
    id: string;
    appointmentDate: string;
    appointmentTime: string;
    status: string;
    user: { name: string; email: string };
    bookingItems: { service?: { name: string } }[];
  }>;
  popularServices: Array<{ id: string; name: string; price: number; bookingCount: number }>;
  recentUsers: Array<{ id: string; name: string; email: string; createdAt: string }>;
  lowStockProducts: Array<{ id: string; name: string; stockQty: number; availabilityStatus: string; category: string }>;
}

const STATUS_COLORS: Record<string, string> = {
  Pending: "#C9A96E",
  Confirmed: "#4caf50",
  Completed: "#9A8878",
  Cancelled: "#e05555",
};

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [guideOpen, setGuideOpen] = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  const [comingSoonGallery, setComingSoonGallery] = useState(false);
  const [comingSoonProducts, setComingSoonProducts] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats", { credentials: "include" })
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => {})
      .finally(() => setLoading(false));

    fetch("/api/admin/maintenance", { credentials: "include" })
      .then(r => r.json())
      .then(d => setMaintenance(!!d.maintenance))
      .catch(() => {});

    fetch("/api/admin/coming-soon", { credentials: "include" })
      .then(r => r.json())
      .then(d => { setComingSoonGallery(!!d.gallery); setComingSoonProducts(!!d.products); })
      .catch(() => {});
  }, []);

  const toggleMaintenance = async () => {
    setToggling("maintenance");
    const next = !maintenance;
    await fetch("/api/admin/maintenance", {
      method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include",
      body: JSON.stringify({ maintenance: next }),
    });
    setMaintenance(next);
    setToggling(null);
  };

  const toggleComingSoon = async (key: "gallery" | "products") => {
    setToggling(key);
    const next = key === "gallery" ? !comingSoonGallery : !comingSoonProducts;
    await fetch("/api/admin/coming-soon", {
      method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include",
      body: JSON.stringify({ [key]: next }),
    });
    if (key === "gallery") setComingSoonGallery(next);
    else setComingSoonProducts(next);
    setToggling(null);
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-muted)", padding: "80px 0" }}>
      <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
      <span>Loading dashboard…</span>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <p style={{ fontSize: 9, letterSpacing: "0.35em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Admin</p>
          <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 40, fontWeight: 300, color: "var(--text)", margin: 0 }}>Dashboard Overview</h1>
        </div>
        <button
          onClick={() => setGuideOpen(true)}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "none", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text-muted)", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}
        >
          <BookOpen size={13} /> How to Use This Panel
        </button>
      </div>

      {guideOpen && <AdminGuide onClose={() => setGuideOpen(false)} />}

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
        {[
          { icon: Users, label: "Total Clients", value: stats?.totalUsers ?? 0, color: "var(--gold)" },
          { icon: Calendar, label: "Total Bookings", value: stats?.totalBookings ?? 0, color: "var(--gold)" },
          { icon: Clock, label: "Today's Bookings", value: stats?.todayBookings ?? 0, color: "#4caf50" },
          { icon: TrendingUp, label: "Total Revenue", value: `$${(stats?.totalRevenue ?? 0).toFixed(0)}`, color: "var(--gold)" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, padding: "22px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <p style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--text-subtle)", textTransform: "uppercase", margin: 0 }}>{label}</p>
              <Icon size={14} style={{ color: "var(--text-subtle)" }} />
            </div>
            <p style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 36, color, margin: 0, fontWeight: 300, lineHeight: 1 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Revenue breakdown */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, padding: "18px 24px", marginBottom: 40, display: "flex", gap: 32, flexWrap: "wrap" }}>
        <p style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--text-subtle)", textTransform: "uppercase", margin: 0, display: "flex", alignItems: "center" }}>Revenue:</p>
        {[
          { label: "This Week", value: stats?.weekRevenue ?? 0 },
          { label: "This Month", value: stats?.monthRevenue ?? 0 },
          { label: "All Time", value: stats?.totalRevenue ?? 0 },
        ].map(({ label, value }) => (
          <div key={label}>
            <p style={{ fontSize: 9, letterSpacing: "0.15em", color: "var(--text-subtle)", textTransform: "uppercase", margin: "0 0 4px" }}>{label}</p>
            <p style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 22, color: "var(--gold)", margin: 0, fontWeight: 300 }}>${value.toFixed(0)} TTD</p>
          </div>
        ))}
      </div>

      {/* Site toggles */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, padding: "18px 24px", marginBottom: 40 }}>
        <p style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--text-subtle)", textTransform: "uppercase", margin: "0 0 16px", fontWeight: 600 }}>Site Controls</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { key: "maintenance", label: "Maintenance Mode", desc: "Takes entire site offline", active: maintenance, color: "#e05555", icon: Wrench, onToggle: toggleMaintenance },
            { key: "gallery", label: "Gallery Coming Soon", desc: "Hides gallery from clients", active: comingSoonGallery, color: "#f59e0b", icon: ToggleLeft, onToggle: () => toggleComingSoon("gallery") },
            { key: "products", label: "Products Coming Soon", desc: "Hides products from clients", active: comingSoonProducts, color: "#f59e0b", icon: ToggleLeft, onToggle: () => toggleComingSoon("products") },
          ].map(({ key, label, desc, active, color, icon: Icon, onToggle }) => (
            <button key={key} onClick={onToggle} disabled={toggling === key}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", background: active ? `${color}12` : "var(--bg-elevated)", border: `1px solid ${active ? color : "var(--border)"}`, borderRadius: 6, cursor: "pointer", transition: "all 0.2s", textAlign: "left" }}>
              {toggling === key
                ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite", color }} />
                : active ? <ToggleRight size={18} style={{ color }} /> : <ToggleLeft size={18} style={{ color: "var(--text-subtle)" }} />}
              <div>
                <p style={{ fontSize: 12, color: active ? color : "var(--text)", margin: "0 0 2px", fontWeight: 500 }}>{label}</p>
                <p style={{ fontSize: 10, color: "var(--text-subtle)", margin: 0 }}>{active ? "ON — " : ""}{desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}>
        {/* Upcoming bookings */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 22, color: "var(--text)", margin: 0, fontWeight: 400 }}>Upcoming Appointments</h2>
            <Link href="/admin/bookings" style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", textDecoration: "none" }}>View All →</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(stats?.upcomingBookings ?? []).slice(0, 6).map(b => (
              <div key={b.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 15, color: "var(--text)", margin: "0 0 4px" }}>
                    {b.bookingItems[0]?.service?.name || "Treatment"}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>
                    {b.user?.name} · {new Date(b.appointmentDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} at {b.appointmentTime}
                  </p>
                </div>
                <span style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, color: STATUS_COLORS[b.status] ?? "var(--text-muted)" }}>{b.status}</span>
              </div>
            ))}
            {!stats?.upcomingBookings?.length && (
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, padding: "28px", textAlign: "center" }}>
                <p style={{ fontSize: 14, color: "var(--text-muted)", margin: 0 }}>No upcoming appointments</p>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Popular services */}
          <div>
            <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 22, color: "var(--text)", margin: "0 0 16px", fontWeight: 400 }}>Popular Services</h2>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, overflow: "hidden" }}>
              {(stats?.popularServices ?? []).map((s, i) => (
                <div key={s.id ?? i} style={{ padding: "14px 18px", borderBottom: i < (stats?.popularServices?.length ?? 1) - 1 ? "1px solid var(--border)" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: 13, color: "var(--text)", margin: "0 0 2px" }}>{s.name}</p>
                    <p style={{ fontSize: 11, color: "var(--text-subtle)", margin: 0 }}>{s.bookingCount} booking{s.bookingCount !== 1 ? "s" : ""}</p>
                  </div>
                  <span style={{ fontSize: 13, color: "var(--gold)", fontFamily: "var(--font-cormorant, Georgia, serif)" }}>${s.price}</span>
                </div>
              ))}
              {!stats?.popularServices?.length && <div style={{ padding: "20px", textAlign: "center" }}><p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>No data yet</p></div>}
            </div>
          </div>

          {/* Recent clients */}
          <div>
            <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 22, color: "var(--text)", margin: "0 0 16px", fontWeight: 400 }}>New Clients</h2>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, overflow: "hidden" }}>
              {(stats?.recentUsers ?? []).map((u, i) => (
                <div key={u.id} style={{ padding: "13px 18px", borderBottom: i < (stats?.recentUsers?.length ?? 1) - 1 ? "1px solid var(--border)" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: 13, color: "var(--text)", margin: "0 0 2px", fontWeight: 500 }}>{u.name}</p>
                    <p style={{ fontSize: 11, color: "var(--text-subtle)", margin: 0 }}>{u.email}</p>
                  </div>
                  <span style={{ fontSize: 10, color: "var(--text-subtle)" }}>{new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                </div>
              ))}
              {!stats?.recentUsers?.length && <div style={{ padding: "20px", textAlign: "center" }}><p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>No clients yet</p></div>}
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {(stats?.lowStockProducts ?? []).length > 0 && (
        <div style={{ marginTop: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <AlertTriangle size={16} style={{ color: "#f59e0b" }} />
              <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 22, color: "var(--text)", margin: 0, fontWeight: 400 }}>Low Stock Alerts</h2>
            </div>
            <Link href="/admin/products" style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", textDecoration: "none" }}>Manage Stock →</Link>
          </div>
          <div style={{ background: "var(--bg-card)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 6, overflow: "hidden" }}>
            {(stats?.lowStockProducts ?? []).map((p, i) => {
              const isOut = p.stockQty === 0;
              return (
                <div key={p.id} style={{
                  padding: "14px 20px",
                  borderBottom: i < (stats?.lowStockProducts?.length ?? 1) - 1 ? "1px solid var(--border)" : "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: isOut ? "rgba(224,85,85,0.03)" : "transparent",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Package size={14} style={{ color: isOut ? "#e05555" : "#f59e0b", flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: 13, color: "var(--text)", margin: "0 0 2px", fontWeight: 500 }}>{p.name}</p>
                      <p style={{ fontSize: 11, color: "var(--text-subtle)", margin: 0 }}>{p.category}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: isOut ? "#e05555" : "#f59e0b" }}>
                      {p.stockQty} left
                    </span>
                    <span style={{
                      fontSize: 9,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                      padding: "3px 8px",
                      borderRadius: 2,
                      background: isOut ? "rgba(224,85,85,0.1)" : "rgba(245,158,11,0.1)",
                      color: isOut ? "#e05555" : "#f59e0b",
                    }}>
                      {isOut ? "Out of Stock" : "Low Stock"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div style={{ marginTop: 40, padding: "24px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <p style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--text-subtle)", textTransform: "uppercase", margin: "0 16px 0 0", display: "flex", alignItems: "center" }}>Quick Actions:</p>
        {[
          { label: "Add Service", href: "/admin/services" },
          { label: "Add Product", href: "/admin/products" },
          { label: "View Clients", href: "/admin/users" },
          { label: "Audit Logs", href: "/admin/audit-logs" },
        ].map(({ label, href }) => (
          <Link key={label} href={href} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", border: "1px solid var(--border)", borderRadius: 2, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)", textDecoration: "none", transition: "all 0.2s" }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.color = "var(--gold)"; el.style.borderColor = "var(--gold)"; }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.color = "var(--text-muted)"; el.style.borderColor = "var(--border)"; }}
          >
            {label} <ArrowRight size={10} />
          </Link>
        ))}
      </div>

    </div>
  );
}
