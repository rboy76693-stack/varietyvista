import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";

const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: {
    default: "Variety Vista® | Premium Denim & Streetwear",
    template: "%s | Variety Vista®"
  },
  description: "Exclusive heavyweight denim and architectural streetwear crafted for the modern Indian landscape. Precision fits, premium cotton, 100% original designs.",
  keywords: ["premium denim", "streetwear India", "baggy jeans", "cargo pants", "Variety Vista", "luxury fashion Mumbai"],
  authors: [{ name: "Variety Vista Team" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://varietyvista.co.in",
    siteName: "Variety Vista®",
    title: "Variety Vista® | Premium Denim & Streetwear",
    description: "Architectural denim crafted for those who refuse to blend in. 100% Made in India.",
    images: [{ url: "/og-image.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Variety Vista® | Premium Denim & Streetwear",
    description: "The Architecture of Denim. High-end streetwear for the Indian streets.",
    creator: "@varietyvista",
  },
  metadataBase: new URL('https://varietyvista.co.in'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} antialiased selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black`}>
        <Navbar />
        <CartDrawer />
        <WhatsAppButton />
        <main className="min-h-screen pt-[132px]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
