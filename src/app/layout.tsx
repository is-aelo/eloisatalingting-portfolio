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
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme:dark)").matches))document.documentElement.setAttribute("data-theme","dark");else document.documentElement.setAttribute("data-theme","light")}catch(e){}})();`,
        }} />
      </head>
      <body className="min-h-dvh bg-background font-body antialiased">
        {children}
      </body>
    </html>
  );
}
