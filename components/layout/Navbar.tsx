"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, UserCircle, ChevronDown, LogOut, Calendar, User } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useAuth } from "@/components/providers/AuthProvider";

const NAV = [
  { href: "/",         label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/gallery",  label: "Gallery" },
  { href: "/about",    label: "About" },
  { href: "/contact",  label: "Contact" },
];

function formatDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function statusColor(status: string) {
  if (status === "Confirmed") return "#4ade80";
  if (status === "Pending") return "var(--gold)";
  if (status === "Cancelled") return "#f87171";
  return "var(--text-muted)";
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [accountHovered, setAccountHovered] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { user, loading, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setOpen(false); setAccountOpen(false); }, [pathname]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    if (accountOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [accountOpen]);

  const handleLogout = async () => {
    setAccountOpen(false);
    await logout();
    router.push("/");
  };

  const firstName = user?.name?.split(" ")[0] ?? "";
  const accountExpanded = accountHovered || accountOpen;

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: "padding 0.4s ease, background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
          padding: scrolled ? "12px 0" : "20px 0",
          background: scrolled ? "var(--bg-glass)" : "transparent",
          backdropFilter: scrolled ? "blur(24px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(24px)" : "none",
          borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
          boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.3)" : "none",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Left: Logo + Account dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Link href="/" style={{ textDecoration: "none", display: "inline-flex" }}>
              <div className="logo-wrap" style={{ width: 60, height: 60 }}>
                <Image src="/logo.png" alt="Ethereal Skin Haven" width={60} height={60} priority style={{ display: "block" }} />
              </div>
            </Link>

            {/* Account dropdown */}
            {!loading && (
              <div ref={dropdownRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setAccountOpen(o => !o)}
                  onMouseEnter={() => setAccountHovered(true)}
                  onMouseLeave={() => setAccountHovered(false)}
                  style={{
                    display: "flex", alignItems: "center",
                    gap: accountExpanded ? 8 : 0,
                    overflow: "hidden",
                    width: accountExpanded ? (user ? 130 : 128) : 36,
                    padding: accountExpanded ? "5px 10px 5px 5px" : "5px",
                    background: accountOpen ? "rgba(201,169,110,0.06)" : "none",
                    border: `1px solid ${accountExpanded ? "var(--gold)" : "var(--border)"}`,
                    borderRadius: 24,
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    transition: "width 0.4s cubic-bezier(0.22,1,0.36,1), gap 0.35s cubic-bezier(0.22,1,0.36,1), padding 0.35s cubic-bezier(0.22,1,0.36,1), border-color 0.25s ease, background 0.25s ease",
                  }}
                >
                  {user ? (
                    <div style={{
                      width: 26, height: 26, borderRadius: "50%",
                      background: "linear-gradient(135deg, var(--gold-dark), var(--gold))",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700, color: "#080808", flexShrink: 0,
                    }}>
                      {firstName.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <UserCircle size={16} style={{ flexShrink: 0 }} />
                  )}
                  <span style={{
                    fontSize: user ? 11 : 10, letterSpacing: user ? "0.12em" : "0.2em",
                    textTransform: "uppercase", color: "var(--text)",
                    fontWeight: user ? 500 : 400, whiteSpace: "nowrap",
                    opacity: accountExpanded ? 1 : 0,
                    transform: accountExpanded ? "translateX(0)" : "translateX(-6px)",
                    transition: "opacity 0.2s ease 0.08s, transform 0.25s ease 0.05s",
                    pointerEvents: "none",
                  }}>
                    {user ? firstName : "Account"}
                  </span>
                  <ChevronDown size={12} style={{
                    color: "var(--text-muted)", flexShrink: 0,
                    opacity: accountExpanded ? 1 : 0,
                    transform: accountExpanded ? (accountOpen ? "translateX(0) rotate(180deg)" : "translateX(0)") : "translateX(-6px)",
                    transition: "opacity 0.2s ease 0.1s, transform 0.25s ease 0.07s",
                    pointerEvents: "none",
                  }} />
                </button>


                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        position: "absolute",
                        top: "calc(100% + 10px)",
                        left: 0,
                        width: 280,
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        boxShadow: "0 16px 48px rgba(0,0,0,0.35)",
                        overflow: "hidden",
                        zIndex: 100,
                      }}
                    >
                      {user ? (
                        <>
                          {/* User header */}
                          <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid var(--border)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <div style={{
                                width: 36, height: 36, borderRadius: "50%",
                                background: "linear-gradient(135deg, var(--gold-dark), var(--gold))",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 15, fontWeight: 700, color: "#080808", flexShrink: 0,
                              }}>
                                {firstName.charAt(0).toUpperCase()}
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <p style={{ fontSize: 13, color: "var(--text)", fontWeight: 600, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</p>
                                <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</p>
                              </div>
                            </div>
                          </div>

                          {/* Recent bookings */}
                          {user.bookings && user.bookings.length > 0 && (
                            <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
                              <p style={{ fontSize: 8, letterSpacing: "0.3em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, margin: "0 0 10px" }}>Recent Bookings</p>
                              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {user.bookings.slice(0, 3).map(b => (
                                  <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                      <p style={{ fontSize: 11, color: "var(--text)", margin: 0, fontWeight: 500 }}>
                                        {formatDate(b.appointmentDate)}
                                      </p>
                                      <p style={{ fontSize: 10, color: "var(--text-muted)", margin: 0 }}>{b.appointmentTime}</p>
                                    </div>
                                    <span style={{
                                      fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase",
                                      color: statusColor(b.status), fontWeight: 600,
                                      padding: "2px 8px", borderRadius: 10,
                                      background: b.status === "Confirmed" ? "rgba(74,222,128,0.1)" : b.status === "Pending" ? "rgba(201,169,110,0.1)" : "rgba(248,113,113,0.1)",
                                    }}>
                                      {b.status}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* No bookings yet */}
                          {(!user.bookings || user.bookings.length === 0) && (
                            <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", textAlign: "center" }}>
                              <Calendar size={20} style={{ color: "var(--text-subtle)", margin: "0 auto 6px" }} />
                              <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>No bookings yet</p>
                            </div>
                          )}

                          {/* Actions */}
                          <div style={{ padding: "8px 0" }}>
                            <Link
                              href="/dashboard"
                              onClick={() => setAccountOpen(false)}
                              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", fontSize: 11, color: "var(--text-muted)", textDecoration: "none", letterSpacing: "0.1em", transition: "all 0.15s" }}
                              onMouseEnter={e => { e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.background = "rgba(201,169,110,0.06)"; }}
                              onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; }}
                            >
                              <Calendar size={13} />
                              My Bookings
                            </Link>
                            <Link
                              href="/dashboard/profile"
                              onClick={() => setAccountOpen(false)}
                              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", fontSize: 11, color: "var(--text-muted)", textDecoration: "none", letterSpacing: "0.1em", transition: "all 0.15s" }}
                              onMouseEnter={e => { e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.background = "rgba(201,169,110,0.06)"; }}
                              onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; }}
                            >
                              <User size={13} />
                              My Profile
                            </Link>
                            <button
                              onClick={handleLogout}
                              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", fontSize: 11, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left", letterSpacing: "0.1em", transition: "all 0.15s", borderTop: "1px solid var(--border)", marginTop: 4 }}
                              onMouseEnter={e => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "rgba(248,113,113,0.06)"; }}
                              onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; }}
                            >
                              <LogOut size={13} />
                              Sign Out
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div style={{ padding: "20px 20px 16px" }}>
                            <p style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 20, color: "var(--text)", margin: "0 0 4px", fontWeight: 400 }}>Welcome Back</p>
                            <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0, lineHeight: 1.6 }}>Sign in to view your bookings and manage your appointments.</p>
                          </div>
                          <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                            <Link
                              href="/login"
                              onClick={() => setAccountOpen(false)}
                              style={{ display: "block", padding: "11px 0", textAlign: "center", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", color: "#080808", textDecoration: "none", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700, borderRadius: 4 }}
                            >
                              Sign In
                            </Link>
                            <Link
                              href="/register"
                              onClick={() => setAccountOpen(false)}
                              style={{ display: "block", padding: "11px 0", textAlign: "center", border: "1px solid var(--border)", color: "var(--text-muted)", textDecoration: "none", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", borderRadius: 4, transition: "all 0.2s" }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}
                            >
                              Create Account
                            </Link>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Desktop nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 36 }} className="nav-desktop">
            {NAV.map(({ href, label }) => {
              const active = href !== "/" && (pathname === href || pathname.startsWith(href + "/"));
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    position: "relative",
                    fontSize: 10,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    color: active ? "var(--gold)" : "var(--text-muted)",
                    transition: "color 0.2s ease",
                    paddingBottom: 2,
                  }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = "var(--text)"; }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
                >
                  {label}
                  <span style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    height: 1,
                    width: active ? "100%" : "0%",
                    background: "var(--gold)",
                    transition: "width 0.3s ease",
                  }} className="nav-underline" />
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", transition: "color 0.2s ease" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            <Link href="/booking" className="nav-book-btn">
              Book Now
            </Link>

            <button
              onClick={() => setOpen(o => !o)}
              aria-label="Toggle menu"
              style={{ width: 32, height: 32, display: "none", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
              className="nav-menu-btn"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ position: "fixed", inset: 0, zIndex: 40 }}
          >
            <div
              style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              style={{
                position: "absolute", right: 0, top: 0, bottom: 0, width: 300,
                background: "var(--bg-card)",
                borderLeft: "1px solid var(--border)",
                display: "flex", flexDirection: "column",
                padding: "96px 40px 48px",
              }}
            >
              {/* Mobile auth links */}
              {!loading && (
                <div style={{ marginBottom: 32, paddingBottom: 28, borderBottom: "1px solid var(--border)" }}>
                  {user ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#080808" }}>
                        {firstName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontSize: 14, color: "var(--text)", margin: 0, fontWeight: 500 }}>{user.name}</p>
                        <Link href="/dashboard" onClick={() => setOpen(false)} style={{ fontSize: 11, color: "var(--gold)", textDecoration: "none" }}>View my bookings</Link>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: 10 }}>
                      <Link href="/login" onClick={() => setOpen(false)} style={{ flex: 1, padding: "10px 0", textAlign: "center", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", color: "#080808", textDecoration: "none", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, borderRadius: 4 }}>Sign In</Link>
                      <Link href="/register" onClick={() => setOpen(false)} style={{ flex: 1, padding: "10px 0", textAlign: "center", border: "1px solid var(--border)", color: "var(--text-muted)", textDecoration: "none", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", borderRadius: 4 }}>Register</Link>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                {NAV.map(({ href, label }, i) => (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={href}
                      style={{
                        fontFamily: "var(--font-cormorant, Georgia, serif)",
                        fontSize: 30,
                        fontWeight: 300,
                        color: (href !== "/" && pathname === href) ? "var(--gold)" : "var(--text)",
                        textDecoration: "none",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {user ? (
                <button
                  onClick={async () => { setOpen(false); await handleLogout(); }}
                  style={{ marginTop: "auto", padding: "14px 0", textAlign: "center", border: "1px solid var(--border)", background: "none", color: "var(--text-muted)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/booking"
                  style={{ marginTop: "auto", padding: "14px 0", textAlign: "center", border: "1px solid var(--gold)", color: "var(--gold)", textDecoration: "none", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", transition: "background 0.3s ease, color 0.3s ease" }}
                >
                  Book Appointment
                </Link>
              )}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
