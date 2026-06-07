import type { Metadata } from "next";
import { Rethink_Sans, DM_Sans } from "next/font/google";
import { ThemeInit } from "@/components/ui/ThemeInit";
import "./globals.css";

const rethinkSans = Rethink_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eloisa Talingting — Product Designer & Developer",
  description: "Portfolio of Eloisa Talingting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${rethinkSans.variable} ${dmSans.variable}`}
    >
      <head />
      <body className="min-h-dvh bg-background font-body antialiased">
        <ThemeInit />
        {children}
      </body>
    </html>
  );
}
