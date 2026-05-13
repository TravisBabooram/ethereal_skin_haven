"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Shield, Eye, EyeOff } from "lucide-react";

interface AdminProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [form, setForm] = useState({ name: "", email: "", currentPassword: "", newPassword: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/profile", { credentials: "include" })
      .then(r => r.json())
      .then(d => {
        setProfile(d);
        setForm(f => ({ ...f, name: d.name, email: d.email }));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const body: Record<string, string> = { name: form.name, email: form.email };
      if (form.newPassword) { body.currentPassword = form.currentPassword; body.newPassword = form.newPassword; }
      const res = await fetch("/api/admin/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), credentials: "include" });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to save changes."); return; }
      setProfile(p => p ? { ...p, name: data.data.name, email: data.data.email } : p);
      setForm(f => ({ ...f, currentPassword: "", newPassword: "" }));
      setSuccess("Profile updated successfully.");
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
      <Loader2 size={20} style={{ animation: "spin 1s linear infinite", color: "var(--gold)" }} />
    </div>
  );

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <Shield size={14} style={{ color: "var(--gold)" }} />
          <p style={{ fontSize: 9, letterSpacing: "0.3em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, margin: 0 }}>Admin Panel</p>
        </div>
        <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 32, fontWeight: 300, color: "var(--text)", margin: 0 }}>My Profile</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>Manage your admin account details and password.</p>
      </div>

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }} />
        <form onSubmit={handleSave} style={{ padding: "36px 40px", display: "flex", flexDirection: "column", gap: 22 }}>

          {error && <div style={{ background: "rgba(220,60,60,0.08)", border: "1px solid rgba(220,60,60,0.2)", borderRadius: 4, padding: "12px 16px" }}><p style={{ fontSize: 13, color: "#e05555", margin: 0 }}>{error}</p></div>}
          {success && <div style={{ background: "rgba(76,175,80,0.08)", border: "1px solid rgba(76,175,80,0.2)", borderRadius: 4, padding: "12px 16px" }}><p style={{ fontSize: 13, color: "#4caf50", margin: 0 }}>{success}</p></div>}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ fontSize: 9, letterSpacing: "0.25em", color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Full Name</label>
              <input className="input-base" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <label style={{ fontSize: 9, letterSpacing: "0.25em", color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Email</label>
              <input className="input-base" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
          </div>

          <div style={{ height: 1, background: "var(--border)" }} />
          <p style={{ fontSize: 9, letterSpacing: "0.25em", color: "var(--text-subtle)", textTransform: "uppercase", margin: 0 }}>Change Password — leave blank to keep current</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ fontSize: 9, letterSpacing: "0.25em", color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Current Password</label>
              <div style={{ position: "relative" }}>
                <input className="input-base" type={showCurrent ? "text" : "password"} placeholder="••••••••" value={form.currentPassword} onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))} style={{ paddingRight: 40 }} />
                <button type="button" onClick={() => setShowCurrent(p => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-subtle)", display: "flex" }}>{showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}</button>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 9, letterSpacing: "0.25em", color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 8 }}>New Password</label>
              <div style={{ position: "relative" }}>
                <input className="input-base" type={showNew ? "text" : "password"} placeholder="Min. 8 characters" value={form.newPassword} onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))} minLength={8} style={{ paddingRight: 40 }} />
                <button type="button" onClick={() => setShowNew(p => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-subtle)", display: "flex" }}>{showNew ? <EyeOff size={14} /> : <Eye size={14} />}</button>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 4 }}>
            <p style={{ fontSize: 12, color: "var(--text-subtle)", margin: 0 }}>
              Role: <span style={{ color: "var(--gold)", textTransform: "capitalize" }}>{profile?.role}</span>
              {profile?.createdAt && <> &nbsp;·&nbsp; Member since {new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</>}
            </p>
            <button type="submit" disabled={saving} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", border: "none", color: "#080808", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 600, borderRadius: 2, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.8 : 1 }}>
              {saving ? <><Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> Saving…</> : <><Save size={12} /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
