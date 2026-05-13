"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/providers/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Login failed. Please check your credentials."); return; }
      // Populate AuthProvider before navigating so user is immediately available site-wide
      await refreshUser();
      if (data.user?.role === "admin") router.push("/admin");
      else router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: "100%", maxWidth: 440 }}
    >
      {/* Card */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "48px 44px", position: "relative", overflow: "hidden" }}>
        {/* Gold accent top */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent 0%, var(--gold) 40%, var(--gold-light) 60%, transparent 100%)" }} />

        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <p style={{ fontSize: 9, letterSpacing: "0.4em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 10 }}>Welcome Back</p>
          <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 34, fontWeight: 300, color: "var(--text)", margin: 0, lineHeight: 1.2 }}>Sign In</h1>
        </div>

        {error && (
          <div style={{ background: "rgba(220,60,60,0.08)", border: "1px solid rgba(220,60,60,0.2)", borderRadius: 4, padding: "12px 16px", marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: "#e05555", margin: 0 }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label style={{ fontSize: 9, letterSpacing: "0.25em", color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Email</label>
            <input className="input-base" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required autoComplete="email" />
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <label style={{ fontSize: 9, letterSpacing: "0.25em", color: "var(--text-muted)", textTransform: "uppercase" }}>Password</label>
            </div>
            <div style={{ position: "relative" }}>
              <input className="input-base" type={showPw ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required autoComplete="current-password" style={{ paddingRight: 46 }} />
              <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-subtle)", display: "flex" }}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ marginTop: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "16px", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", border: "none", color: "#080808", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 600, borderRadius: 2, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.8 : 1, transition: "opacity 0.2s" }}>
            {loading ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Signing in…</> : <>Sign In <ArrowRight size={13} /></>}
          </button>
        </form>

        <div style={{ marginTop: 28, textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
            New client?{" "}
            <Link href="/register" style={{ color: "var(--gold)", textDecoration: "none", fontWeight: 500, transition: "opacity 0.2s" }}>Create an account</Link>
          </p>
        </div>

        <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--border)", textAlign: "center" }}>
          <Link href="/booking" style={{ fontSize: 12, color: "var(--text-subtle)", textDecoration: "none", letterSpacing: "0.1em", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-subtle)")}
          >
            Continue as guest →
          </Link>
        </div>
      </div>

    </motion.div>
  );
}
