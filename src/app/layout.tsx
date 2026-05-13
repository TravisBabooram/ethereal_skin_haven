import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/providers/ThemeProvider";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ethereal Skin Haven — Luxury Spa & Esthetics",
    template: "%s | Ethereal Skin Haven",
  },
  description:
    "Experience the art of radiant skin. Luxury esthetics treatments, premium skincare products, and effortless online booking.",
  keywords: ["luxury spa", "esthetics", "skincare", "facial", "booking"],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Ethereal Skin Haven — Luxury Spa & Esthetics",
    description: "Experience the art of radiant skin.",
    siteName: "Ethereal Skin Haven",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
