"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileNav } from "@/components/layout/MobileNav";
import { NAV_LINKS } from "@/data/constants";
import { LuMenu } from "react-icons/lu";

type ContactLink = {
  email?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  tiktok_url?: string | null;
};

export function Header({ fullName, contact }: { fullName: string; contact?: ContactLink | null }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:py-6">
          <Link href="/" className="font-heading text-lg text-primary transition-colors hover:text-accent-secondary">
            {fullName}
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(true)}
              className="cursor-pointer text-primary transition-colors hover:text-accent-secondary"
              aria-label="Open menu"
            >
              <LuMenu size={24} />
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} fullName={fullName} contact={contact} />
    </>
  );
}
