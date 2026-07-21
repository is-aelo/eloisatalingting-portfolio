"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "@/data/constants";
import { useActiveSection } from "@/hooks/useActiveSection";
import { Logo } from "@/components/ui/Logo";
import { FaLinkedin } from "react-icons/fa6";
import { SiGithub, SiTiktok } from "react-icons/si";
import { LuMail, LuMenu, LuX } from "react-icons/lu";
import { normalizeUrl } from "@/lib/url";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

type ContactLink = {
  email?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  tiktok_url?: string | null;
};

type HeaderProps = {
  fullName: string;
  contact?: ContactLink | null;
  resumeUrl?: string | null;
};

const sectionIds = ["about", "projects", "contact"];

function SocialLinks({ contact }: { contact?: ContactLink | null }) {
  const links: { href: string; icon: React.ComponentType<{ size?: number }>; label: string }[] = [];
  if (contact?.email) links.push({ href: `mailto:${contact.email}`, icon: LuMail, label: "Email" });
  if (contact?.linkedin_url) links.push({ href: normalizeUrl(contact.linkedin_url), icon: FaLinkedin, label: "LinkedIn" });
  if (contact?.github_url) links.push({ href: normalizeUrl(contact.github_url), icon: SiGithub, label: "GitHub" });
  if (contact?.tiktok_url) links.push({ href: normalizeUrl(contact.tiktok_url), icon: SiTiktok, label: "TikTok" });

  if (links.length === 0) return null;

  return (
    <div className="flex items-center gap-1">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-secondary transition-colors hover:bg-surface-muted hover:text-accent-secondary"
          >
            <Icon size={18} />
          </a>
        );
      })}
    </div>
  );
}

export function Header({ contact, resumeUrl }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const activeSection = useActiveSection(sectionIds);
  const resolvedSection = pathname.startsWith("/projects/") ? "projects" : activeSection;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center border-b border-border bg-background">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => {
              const sectionId = link.href.replace("/#", "");
              const isActive = resolvedSection === sectionId;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-body text-xs uppercase tracking-wider transition-colors ${
                    isActive
                      ? "font-bold text-accent-secondary"
                      : "text-secondary hover:text-accent-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="flex md:hidden h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-primary transition-colors hover:bg-surface-muted hover:text-accent-secondary"
            aria-label="Open menu"
          >
            <LuMenu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMenu}
            />
            <motion.aside
              className="fixed top-0 right-0 z-[60] flex h-dvh w-72 flex-col border-l border-border bg-background px-6 py-6"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button
                  onClick={closeMenu}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-primary transition-colors hover:bg-surface-muted hover:text-accent-secondary"
                  aria-label="Close menu"
                >
                  <LuX size={20} />
                </button>
              </div>

              <div className="mt-6">
                <SocialLinks contact={contact} />
              </div>

              <nav className="mt-10 flex flex-col gap-2">
                {NAV_LINKS.map((link) => {
                  const sectionId = link.href.replace("/#", "");
                  const isActive = resolvedSection === sectionId;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenu}
                      className={`rounded-lg px-3 py-3 font-body text-sm uppercase tracking-wider transition-colors ${
                        isActive
                          ? "font-medium text-accent-secondary"
                          : "text-secondary hover:text-accent-secondary"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto flex flex-col gap-3">
                <div className="flex justify-center">
                  <ThemeToggle />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
