import type { Metadata } from "next";
import { getSetting } from "@/lib/services/settings";

export async function generateMetadata(): Promise<Metadata> {
  const [title, desc] = await Promise.all([getSetting("seo_policies_title"), getSetting("seo_policies_desc")]);
  return {
    title: title || "Policies",
    description: desc || "Read our cancellation, booking, privacy, refund, and late arrival policies at Ethereal Skin Haven.",
  };
}

export default function PoliciesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
