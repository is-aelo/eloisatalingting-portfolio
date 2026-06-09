"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { MobileNav } from "@/components/layout/MobileNav";
import { LuMenu, LuMoon, LuSun } from "react-icons/lu";
import { useTheme } from "@/hooks/useTheme";

type ContactLink = {
  email?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  tiktok_url?: string | null;
};

export function Header({ fullName, contact, resumeUrl }: { fullName: string; contact?: ContactLink | null; resumeUrl?: string | null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => { setMounted(true); }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:py-6">
          <Link href="/" className="font-heading text-lg text-primary transition-colors hover:text-accent-secondary">
            {fullName}
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm text-secondary transition-colors hover:bg-surface-muted hover:text-primary"
              aria-label={`Switch to ${mounted && isDark ? "light" : "dark"} mode`}
            >
              {mounted ? (isDark ? <LuSun size={16} /> : <LuMoon size={16} />) : <LuMoon size={16} />}
              <span className="hidden md:inline">{mounted ? (isDark ? "Light" : "Dark") : "Dark"}</span>
            </button>

            <button
              onClick={() => setMenuOpen(true)}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-primary transition-colors hover:bg-surface-muted hover:text-accent-secondary"
              aria-label="Open menu"
            >
              <LuMenu size={20} />
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={menuOpen} onClose={closeMenu} fullName={fullName} contact={contact} resumeUrl={resumeUrl} />
    </>
  );
}
