import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Ethereal Skin Haven collects, uses, and protects your personal data — your rights, data retention, cookies, and how to delete your account.",
  alternates: { canonical: "https://etherealskinhaven.com/privacy-policy" },
  openGraph: {
    title: "Privacy Policy | Ethereal Skin Haven",
    description: "How we collect, use, and protect your personal data at Ethereal Skin Haven in Couva, Trinidad.",
    url: "https://etherealskinhaven.com/privacy-policy",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | Ethereal Skin Haven",
    description: "How we collect, use, and protect your personal data at Ethereal Skin Haven.",
  },
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
