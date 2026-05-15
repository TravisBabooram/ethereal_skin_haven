import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";
import CookieBanner from "@/components/ui/CookieBanner";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh" }}>{children}</main>
      <Footer />
      <WhatsAppFloat />
      <CookieBanner />
    </>
  );
}
