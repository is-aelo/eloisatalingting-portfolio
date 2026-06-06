import type { Metadata } from "next";
import { Rethink_Sans, DM_Sans } from "next/font/google";
import Script from "next/script";
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

const themeScript = `
  (function() {
    try {
      var t = localStorage.getItem("theme");
      if (t === "dark" || (!t && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.setAttribute("data-theme", "light");
      }
    } catch(e) {}
  })()
`;

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
      <body className="min-h-dvh bg-background font-body antialiased">
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        {children}
      </body>
    </html>
  );
}
