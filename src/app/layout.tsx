import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PocketIDE - Mobile-First PWA IDE",
  description: "A mobile-optimized PWA IDE for coding on the go. Edit, run, and debug your projects anywhere.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PocketIDE",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "PocketIDE - Mobile-First PWA IDE",
    description: "A mobile-optimized PWA IDE for coding on the go. Edit, run, and debug your projects anywhere.",
    url: "https://pocketide.dev",
    siteName: "PocketIDE",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PocketIDE - Mobile-First PWA IDE",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PocketIDE - Mobile-First PWA IDE",
    description: "A mobile-optimized PWA IDE for coding on the go. Edit, run, and debug your projects anywhere.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
