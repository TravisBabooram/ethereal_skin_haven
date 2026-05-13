import type { Metadata } from "next";
import { getSetting } from "@/lib/services/settings";

export async function generateMetadata(): Promise<Metadata> {
  const [title, desc] = await Promise.all([getSetting("seo_booking_title"), getSetting("seo_booking_desc")]);
  return {
    title: title || "Book an Appointment",
    description: desc || "Book your luxury spa appointment online in minutes. Choose your treatment, pick a date and time, and confirm your booking.",
    robots: { index: false },
  };
}

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
