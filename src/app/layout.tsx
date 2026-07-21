import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare, GeistPixelCircle } from "geist/font/pixel";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "./globals.css";

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
      className={`${GeistPixelSquare.variable} ${GeistMono.variable} ${GeistPixelCircle.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-dvh bg-background font-body antialiased">
        <ThemeProvider>
          <div className="relative z-10">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
