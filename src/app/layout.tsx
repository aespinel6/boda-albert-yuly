import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { wedding } from "@/lib/config";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(wedding.site.url),
  title: wedding.site.title,
  description: wedding.site.description,
  applicationName: "Albert & Yuly",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Albert & Yuly", statusBarStyle: "black-translucent" },
  openGraph: {
    title: wedding.site.title,
    description: wedding.site.description,
    url: wedding.site.url,
    siteName: "Albert & Yuly",
    images: [{ url: "/photos/hero-couple.jpeg", width: 853, height: 1280, alt: "Albert & Yuly" }],
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: wedding.site.title,
    description: wedding.site.description,
    images: ["/photos/hero-couple.jpeg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#1C2740",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
