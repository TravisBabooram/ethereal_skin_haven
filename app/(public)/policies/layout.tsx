import type { Metadata } from "next";
import { getSetting } from "@/lib/services/settings";

export async function generateMetadata(): Promise<Metadata> {
  const [title, desc] = await Promise.all([getSetting("seo_policies_title"), getSetting("seo_policies_desc")]);
  return {
    title: title || "Booking & Cancellation Policies — Ethereal Skin Haven",
    description: desc || "Review our cancellation window, booking rules, refund conditions, late arrival policy & privacy practices before your appointment in Trinidad.",
  };
}

export default function PoliciesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
