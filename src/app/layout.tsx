import type { Metadata } from "next";
import { Hanken_Grotesk, DM_Sans } from "next/font/google";
import { MeshBlobBackground } from "@/components/layout/MeshBlobBackground";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  weight: "400",
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
      className={`${hankenGrotesk.variable} ${dmSans.variable}`}
    >
      <body className="min-h-dvh bg-background font-body antialiased">
        <MeshBlobBackground />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
