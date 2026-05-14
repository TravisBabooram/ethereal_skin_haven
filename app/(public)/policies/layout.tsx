import type { Metadata } from "next";
import { getSetting } from "@/lib/services/settings";

export async function generateMetadata(): Promise<Metadata> {
  const [title, desc] = await Promise.all([getSetting("seo_policies_title"), getSetting("seo_policies_desc")]);
  return {
    title: title || "Booking & Cancellation Policies — Ethereal Skin Haven",
    description: desc || "Review our cancellation window, booking rules, refund conditions, late arrival policy & privacy practices before your appointment in Trinidad.",
    alternates: { canonical: "https://etherealskinhaven.com/policies" },
    openGraph: { title: title || "Policies | Ethereal Skin Haven", description: desc || "Review our cancellation, refund, and booking policies at Ethereal Skin Haven in Couva, Trinidad.", url: "https://etherealskinhaven.com/policies" },
    twitter: { card: "summary", title: title || "Policies | Ethereal Skin Haven", description: desc || "Booking, cancellation, and refund policies at Ethereal Skin Haven, Trinidad." },
  };
}

export default function PoliciesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
