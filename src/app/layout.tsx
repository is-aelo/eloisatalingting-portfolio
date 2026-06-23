import type { Metadata } from "next";
import { Karla, DM_Sans } from "next/font/google";
import "./globals.css";

const karla = Karla({
  weight: ["400", "700"],
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
      className={`${karla.variable} ${dmSans.variable}`}
    >
      <body className="min-h-dvh bg-background font-body antialiased">
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
