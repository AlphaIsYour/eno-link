import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EnoLink - Fast & Reliable URL Shortener",
  description:
    "Shorten URLs, create custom slugs, track clicks, generate QR codes, and manage your links with EnoLink. Free, fast, and privacy-friendly.",
  keywords: ["url shortener", "link shortener", "qr code", "analytics", "custom links"],
  openGraph: {
    title: "EnoLink - Fast & Reliable URL Shortener",
    description: "Shorten URLs, create custom slugs, track clicks, and generate QR codes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col bg-gray-50`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
