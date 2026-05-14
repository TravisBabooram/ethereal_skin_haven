"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Eye, EyeOff, Trash2, X, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  createdAt: string;
}

export default function CustomerProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", currentPassword: "", newPassword: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    fetch("/api/users/profile", { credentials: "include" })
      .then(r => r.json())
      .then(d => {
        setProfile(d);
        setForm(f => ({ ...f, name: d.name ?? "", email: d.email ?? "", phone: d.phone ?? "" }));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const body: Record<string, string> = { name: form.name, email: form.email, phone: form.phone };
      if (form.newPassword) {
        if (!form.currentPassword) { setError("Current password is required to set a new password."); setSaving(false); return; }
        body.currentPassword = form.currentPassword;
        body.newPassword = form.newPassword;
      }
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to save changes."); return; }
      setProfile(p => p ? { ...p, name: form.name, email: form.email, phone: form.phone } : p);
      setForm(f => ({ ...f, currentPassword: "", newPassword: "" }));
      setSuccess("Profile updated successfully.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") return;
    setDeleting(true);
    setDeleteError("");
    try {
      const res = await fetch("/api/users/profile/delete", { method: "DELETE", credentials: "include" });
      if (!res.ok) { const d = await res.json(); setDeleteError(d.error || "Failed to delete account."); return; }
      router.push("/");
    } catch {
      setDeleteError("Something went wrong. Please try again.");
    } finally {
      setDeleting(false);
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
        <p style={{ fontSize: 9, letterSpacing: "0.3em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, margin: "0 0 6px" }}>My Account</p>
        <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 32, fontWeight: 300, color: "var(--text)", margin: 0 }}>My Profile</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>Update your personal details and password.</p>
      </div>

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", marginBottom: 32 }}>
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

          <div>
            <label style={{ fontSize: 9, letterSpacing: "0.25em", color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Phone Number</label>
            <input className="input-base" type="tel" placeholder="+1 (868) 000-0000" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
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
              {profile?.createdAt && <>Member since {new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</>}
            </p>
            <button type="submit" disabled={saving} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", border: "none", color: "#080808", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 600, borderRadius: 2, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.8 : 1 }}>
              {saving ? <><Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> Saving…</> : <><Save size={12} /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
      {/* Danger zone */}
      <div style={{ background: "var(--bg-card)", border: "1px solid rgba(224,85,85,0.3)", borderRadius: 8, padding: "28px 40px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <AlertTriangle size={14} style={{ color: "#e05555" }} />
              <p style={{ fontSize: 11, letterSpacing: "0.2em", color: "#e05555", textTransform: "uppercase", fontWeight: 600, margin: 0 }}>Danger Zone</p>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0, lineHeight: 1.6 }}>
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
          <button onClick={() => { setDeleteModal(true); setDeleteConfirm(""); setDeleteError(""); }}
            style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", background: "rgba(224,85,85,0.08)", border: "1px solid rgba(224,85,85,0.35)", borderRadius: 2, color: "#e05555", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" }}>
            <Trash2 size={12} /> Delete Account
          </button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid rgba(224,85,85,0.35)", borderRadius: 8, padding: "36px", width: "100%", maxWidth: 440, position: "relative" }}>
            <button onClick={() => setDeleteModal(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
              <X size={18} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <AlertTriangle size={18} style={{ color: "#e05555" }} />
              <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 22, color: "var(--text)", margin: 0, fontWeight: 500 }}>Delete Account</h2>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.65, marginBottom: 20 }}>
              This will permanently delete your account, all your bookings, and personal data. This cannot be reversed.
            </p>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>
              Type <strong style={{ color: "#e05555" }}>DELETE</strong> to confirm:
            </p>
            <input
              value={deleteConfirm}
              onChange={e => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
              style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid rgba(224,85,85,0.4)", borderRadius: 4, color: "var(--text)", fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 16 }}
            />
            {deleteError && <p style={{ fontSize: 12, color: "#e05555", marginBottom: 12 }}>{deleteError}</p>}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setDeleteModal(false)}
                style={{ padding: "10px 18px", background: "none", border: "1px solid var(--border)", borderRadius: 2, color: "var(--text-muted)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleDeleteAccount} disabled={deleteConfirm !== "DELETE" || deleting}
                style={{ padding: "10px 20px", background: deleteConfirm === "DELETE" ? "#e05555" : "rgba(224,85,85,0.3)", border: "none", borderRadius: 2, color: "#fff", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, cursor: deleteConfirm === "DELETE" ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: 7, transition: "background 0.2s" }}>
                {deleting ? <><Loader2 size={11} style={{ animation: "spin 1s linear infinite" }} /> Deleting…</> : "Delete My Account"}
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
