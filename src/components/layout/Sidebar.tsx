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
import { LuChevronDown, LuDownload, LuEye, LuFileText, LuFolderKanban, LuMail, LuMenu, LuUser, LuX } from "react-icons/lu";
import { renderTextWithAmpersand } from "@/lib/text";
import { normalizeUrl } from "@/lib/url";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

type ContactLink = {
  email?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  tiktok_url?: string | null;
};

type SidebarProps = {
  fullName: string;
  contact?: ContactLink | null;
  resumeUrl?: string | null;
};

const sectionIds = ["about", "projects", "contact"];

const navIcons: Record<string, React.ReactNode> = {
  LuFolderKanban: <LuFolderKanban size={18} />,
  LuUser: <LuUser size={18} />,
  LuMail: <LuMail size={18} />,
};

function SocialLinks({ contact }: { contact?: ContactLink | null }) {
  const links: { href: string; icon: React.ComponentType<{ size?: number }>; label: string }[] = [];
  if (contact?.email) links.push({ href: `mailto:${contact.email}`, icon: LuMail, label: "Email" });
  if (contact?.linkedin_url) links.push({ href: normalizeUrl(contact.linkedin_url), icon: FaLinkedin, label: "LinkedIn" });
  if (contact?.github_url) links.push({ href: normalizeUrl(contact.github_url), icon: SiGithub, label: "GitHub" });
  if (contact?.tiktok_url) links.push({ href: normalizeUrl(contact.tiktok_url), icon: SiTiktok, label: "TikTok" });

  if (links.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
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

function NavLinks({
  resolvedSection,
  onLinkClick,
}: {
  resolvedSection: string;
  onLinkClick?: () => void;
}) {
  return (
    <>
      {NAV_LINKS.map((link) => {
        const sectionId = link.href.replace("/#", "");
        const isActive = resolvedSection === sectionId;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onLinkClick}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              isActive
                ? "bg-accent-secondary/10 font-medium text-accent-secondary"
                : "text-secondary hover:bg-surface-muted hover:text-primary"
            }`}
          >
            {navIcons[link.icon]}
            {link.label}
          </Link>
        );
      })}
    </>
  );
}

function CVSection({ resumeUrl, onLinkClick }: { resumeUrl?: string | null; onLinkClick?: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-secondary transition-colors hover:bg-surface-muted hover:text-primary"
      >
        <LuFileText size={18} />
        CV
        <LuChevronDown
          size={16}
          className={`ml-auto transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="ml-7 mt-1 flex flex-col gap-0.5">
          <a
            href={resumeUrl ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onLinkClick}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-secondary transition-colors hover:bg-surface-muted hover:text-primary"
          >
            <LuEye size={16} />
            View
          </a>
          <a
            href={resumeUrl ?? "#"}
            download
            onClick={onLinkClick}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-secondary transition-colors hover:bg-surface-muted hover:text-primary"
          >
            <LuDownload size={16} />
            Download
          </a>
        </div>
      )}
    </div>
  );
}

export function Sidebar({ fullName, contact, resumeUrl }: SidebarProps) {
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
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-border bg-background px-5 py-3 md:hidden">
        <Logo />
        <button
          onClick={() => setMenuOpen(true)}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-primary transition-colors hover:bg-surface-muted hover:text-accent-secondary"
          aria-label="Open menu"
        >
          <LuMenu size={20} />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="fixed top-0 left-0 z-40 hidden h-dvh w-60 flex-col border-r border-border bg-background px-5 py-6 md:flex">
        <Logo />
        <nav className="mt-10 flex flex-col gap-1">
          <NavLinks resolvedSection={resolvedSection} />
        </nav>
        <div className="mt-2">
          <CVSection resumeUrl={resumeUrl} />
        </div>
        <div className="mt-auto flex flex-col gap-4">
          <ThemeToggle />
          <SocialLinks contact={contact} />
        </div>
      </aside>

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
              className="fixed top-0 left-0 z-[60] flex h-dvh w-72 flex-col border-r border-border bg-background px-6 py-6"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
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

              <div className="flex flex-1 flex-col gap-3 pt-10">
                <span className="font-heading text-xl text-primary">
                  {renderTextWithAmpersand(fullName)}
                </span>

                <nav className="mt-2 flex flex-col gap-1">
                  <NavLinks resolvedSection={resolvedSection} onLinkClick={closeMenu} />
                </nav>
                <div className="mt-2">
                  <CVSection resumeUrl={resumeUrl} onLinkClick={closeMenu} />
                </div>
              </div>

              <div className="flex flex-col gap-3 pb-6">
                <ThemeToggle />
                <SocialLinks contact={contact} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
