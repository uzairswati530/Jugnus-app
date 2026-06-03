import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jugnu's Salon — Premium Beauty & Style",
  description: "Complete salon management system for Jugnu's Salon — Premium Beauty & Style",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased`}
        style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
