"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileNav } from "@/components/layout/MobileNav";
import { NAV_LINKS } from "@/data/constants";
import { useActiveSection } from "@/hooks/useActiveSection";
import { Logo } from "@/components/ui/Logo";
import { LuFolderKanban, LuUser, LuMail, LuMenu, LuDownload } from "react-icons/lu";
import { renderTextWithAmpersand } from "@/lib/text";

type ContactLink = {
  email?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  tiktok_url?: string | null;
};

const sectionIds = ["about", "projects", "contact"];

const navIcons: Record<string, React.ReactNode> = {
  LuFolderKanban: <LuFolderKanban size={16} />,
  LuUser: <LuUser size={16} />,
  LuMail: <LuMail size={16} />,
};

export function Header({ fullName, contact, resumeUrl }: { fullName: string; contact?: ContactLink | null; resumeUrl?: string | null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const activeSection = useActiveSection(sectionIds);
  const resolvedSection = pathname.startsWith("/projects/") ? "projects" : activeSection;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 bg-background/95 md:backdrop-blur-sm transition-border-color duration-300 ${scrolled ? "border-b border-border/50" : "border-b border-transparent"}`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 sm:px-6 md:px-8 lg:px-6 py-3 sm:py-4 md:py-5">
          <Logo />

          {/* Desktop nav — pill shape */}
          <div className="hidden md:flex items-center rounded-full border border-border bg-surface-muted p-1">
            <nav className="flex items-center gap-0.5">
              {NAV_LINKS.map((link) => {
                const sectionId = link.href.replace("/#", "");
                const isActive = resolvedSection === sectionId;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm transition-colors ${
                      isActive
                        ? "bg-accent-secondary/15 text-accent-secondary font-medium"
                        : "text-secondary hover:text-primary"
                    }`}
                  >
                    {navIcons[link.icon]}
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Resume + Mobile hamburger */}
          <div className="flex items-center gap-2">
            <a
              href={resumeUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm text-white transition-opacity hover:opacity-90"
            >
              <LuDownload size={16} />
              Resume
            </a>

            <button
              onClick={() => setMenuOpen(true)}
              className="flex md:hidden h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-primary transition-colors hover:bg-surface-muted hover:text-accent-secondary sm:h-10 sm:w-10"
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
