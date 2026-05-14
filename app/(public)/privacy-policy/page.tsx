"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import Link from "next/link";

const SECTIONS = [
  {
    title: "Information We Collect",
    body: [
      "When you create an account or make a booking, we collect your name, email address, and phone number.",
      "We collect your appointment history, including services booked, dates, times, payment method, and any notes you provide.",
      "We do not store credit card or bank account numbers. Payments are handled directly via cash or bank transfer.",
      "We may collect usage data (pages visited, browser type) through standard analytics tools to improve the site experience.",
    ],
  },
  {
    title: "How We Use Your Information",
    body: [
      "To confirm and manage your appointments and send you booking reminders via email.",
      "To provide you with a personalised dashboard showing your booking history and profile.",
      "To contact you regarding changes, cancellations, or questions about your appointment.",
      "We do not sell, rent, or share your personal information with third parties for marketing purposes.",
    ],
  },
  {
    title: "Data Retention",
    body: [
      "We retain your account information and booking history for as long as your account is active.",
      "If you delete your account, all associated personal data — including your profile, bookings, and cart items — is permanently deleted from our systems.",
      "Anonymised, non-identifiable data (such as aggregate booking statistics) may be retained for business reporting.",
    ],
  },
  {
    title: "Your Rights",
    body: [
      "You have the right to access the personal information we hold about you at any time through your account dashboard.",
      "You may update or correct your information at any time from your profile page.",
      "You may request permanent deletion of your account and all associated data directly from your profile page under 'Danger Zone', or by contacting us.",
      "You may opt out of marketing communications at any time by contacting us via WhatsApp or email.",
    ],
  },
  {
    title: "Cookies",
    body: [
      "We use an authentication cookie to keep you securely logged in. This cookie is strictly necessary and contains no personal identifying information beyond a secure session token.",
      "No third-party advertising or tracking cookies are used on this site.",
    ],
  },
  {
    title: "Security",
    body: [
      "All passwords are hashed using industry-standard encryption (bcrypt) and are never stored in plain text.",
      "Our site enforces HTTPS to protect all data transmitted between your browser and our servers.",
      "Access to your personal data is restricted to you and authorised administrative staff only.",
    ],
  },
  {
    title: "Contact",
    body: [
      "If you have any questions about this Privacy Policy or how your data is handled, please contact us via WhatsApp at +1 (868) 705-7023 or through the contact form on our website.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="page-hero" style={{ background: "var(--bg)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(201,169,110,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />
        <AnimatedSection style={{ position: "relative", maxWidth: 640, margin: "0 auto", padding: "0 clamp(16px, 5vw, 32px)" }}>
          <p style={{ fontSize: 9, letterSpacing: "0.45em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 20 }}>Legal</p>
          <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 300, color: "var(--text)", margin: "0 0 20px", lineHeight: 1.2 }}>
            Privacy Policy
          </h1>
          <div style={{ width: 48, height: 1, background: "linear-gradient(to right, transparent, var(--gold), transparent)", margin: "0 auto 20px" }} />
          <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7, maxWidth: 480, margin: "0 auto" }}>
            Your privacy matters to us. This policy explains what information we collect, how we use it, and your rights regarding your personal data.
          </p>
          <p style={{ fontSize: 11, color: "var(--text-subtle)", marginTop: 16 }}>Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
        </AnimatedSection>
      </section>

      <section style={{ background: "var(--bg)", padding: "80px clamp(16px, 5vw, 40px)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", gap: 40 }}>
          {SECTIONS.map((s, i) => (
            <AnimatedSection key={s.title}>
              <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
                <span style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 13, color: "var(--gold)", opacity: 0.5, flexShrink: 0, paddingTop: 4, minWidth: 28 }}>
                  0{i + 1}
                </span>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 22, fontWeight: 500, color: "var(--text)", margin: "0 0 16px" }}>{s.title}</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {s.body.map((line, j) => (
                      <div key={j} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--gold)", flexShrink: 0, marginTop: 8, opacity: 0.6 }} />
                        <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.75, margin: 0 }}>{line}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {i < SECTIONS.length - 1 && (
                <div style={{ height: 1, background: "var(--border)", marginTop: 40 }} />
              )}
            </AnimatedSection>
          ))}

          {/* Account deletion CTA */}
          <AnimatedSection>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "28px 32px", textAlign: "center" }}>
              <p style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 10 }}>Account Deletion</p>
              <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 20, maxWidth: 480, margin: "0 auto 20px" }}>
                You can permanently delete your account and all associated data at any time from your profile page.
              </p>
              <Link href="/dashboard/profile"
                style={{ display: "inline-block", padding: "11px 28px", border: "1px solid rgba(201,169,110,0.4)", borderRadius: 2, color: "var(--gold)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", fontWeight: 600 }}>
                Go to My Profile →
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
