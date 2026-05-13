"use client";

import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      {/* Minimal header */}
      <header style={{ padding: "28px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ textDecoration: "none", display: "inline-flex" }}>
          <div className="logo-wrap" style={{ width: 52, height: 52 }}>
            <Image src="/logo.png" alt="Ethereal Skin Haven" width={52} height={52} style={{ display: "block" }} />
          </div>
        </Link>
        <Link href="/" style={{ fontSize: 11, letterSpacing: "0.2em", color: "var(--text-muted)", textDecoration: "none", textTransform: "uppercase", transition: "color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
        >← Back to site</Link>
      </header>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        {children}
      </div>
    </div>
  );
}
