"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { MobileNav } from "@/components/layout/MobileNav";
import { LuMenu } from "react-icons/lu";

type ContactLink = {
  email?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  tiktok_url?: string | null;
};

export function Header({ fullName, contact }: { fullName: string; contact?: ContactLink | null }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:py-6">
          <Link href="/" className="font-heading text-lg text-primary transition-colors hover:text-accent-secondary">
            {fullName}
          </Link>

          <button
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-primary transition-colors hover:bg-surface-muted hover:text-accent-secondary"
            aria-label="Open menu"
          >
            <LuMenu size={20} />
          </button>
        </div>
      </header>

      <MobileNav open={menuOpen} onClose={closeMenu} fullName={fullName} contact={contact} />
    </>
  );
}
