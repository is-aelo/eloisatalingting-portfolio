"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { MobileNav } from "@/components/layout/MobileNav";
import { LuMenu } from "react-icons/lu";
import { renderTextWithAmpersand } from "@/lib/text";

type ContactLink = {
  email?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  tiktok_url?: string | null;
};

export function Header({ fullName, contact, resumeUrl }: { fullName: string; contact?: ContactLink | null; resumeUrl?: string | null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 bg-background/80 md:backdrop-blur-sm transition-border-color duration-300 ${scrolled ? "border-b border-border/50" : "border-b border-transparent"}`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 sm:px-6 md:px-8 lg:px-6 py-3 sm:py-4 md:py-5">
          <Link href="/" className="font-heading text-base sm:text-lg font-medium text-primary transition-colors hover:text-accent-secondary">
            {renderTextWithAmpersand(fullName)}
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setMenuOpen(true)}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-muted hover:text-accent-secondary sm:h-10 sm:w-10"
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
