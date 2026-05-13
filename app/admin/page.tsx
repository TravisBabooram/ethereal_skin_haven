"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Calendar, TrendingUp, Clock, ArrowRight, Loader2 } from "lucide-react";

interface Stats {
  totalUsers: number;
  totalBookings: number;
  todayBookings: number;
  totalRevenue: number;
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

  useEffect(() => {
    fetch("/api/admin/stats", { credentials: "include" })
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-muted)", padding: "80px 0" }}>
      <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
      <span>Loading dashboard…</span>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 9, letterSpacing: "0.35em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Admin</p>
        <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 40, fontWeight: 300, color: "var(--text)", margin: 0 }}>Dashboard Overview</h1>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 48 }}>
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
