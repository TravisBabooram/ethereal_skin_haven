import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "@/src/app/globals.css";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";

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
    default: "Ethereal Skin Haven — Luxury Spa & Esthetics in Trinidad",
    template: "%s | Ethereal Skin Haven",
  },
  description:
    "Book luxury facials, waxing, brow lamination & nail services in Couva, Trinidad. Open Tuesday–Saturday, 9am–6pm.",
  keywords: ["luxury spa Trinidad", "esthetics Trinidad", "facial Couva", "waxing Trinidad", "brow lamination Trinidad", "skincare Trinidad", "Ethereal Skin Haven"],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Ethereal Skin Haven — Luxury Spa & Esthetics in Trinidad",
    description: "Book luxury facials, waxing, brow lamination & nail services in Couva, Trinidad. Open Tue–Sat, 9am–6pm.",
    siteName: "Ethereal Skin Haven",
    images: [{ url: "/logo.png", width: 685, height: 685, alt: "Ethereal Skin Haven" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      </head>
      <body>
        <ThemeProvider><AuthProvider>{children}</AuthProvider></ThemeProvider>
      </body>
    </html>
  );
}
