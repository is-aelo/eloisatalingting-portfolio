"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "@/data/constants";
import { useActiveSection } from "@/hooks/useActiveSection";
import { FaLinkedin } from "react-icons/fa6";
import { SiGithub, SiTiktok } from "react-icons/si";
import { LuDownload, LuFolderKanban, LuMail, LuUser, LuX } from "react-icons/lu";
import { renderTextWithAmpersand } from "@/lib/text";

type ContactLink = {
  email?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  tiktok_url?: string | null;
};

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
  fullName: string;
  contact?: ContactLink | null;
  resumeUrl?: string | null;
};

const navIcons: Record<string, React.ReactNode> = {
  LuFolderKanban: <LuFolderKanban size={18} />,
  LuUser: <LuUser size={18} />,
  LuMail: <LuMail size={18} />,
};

const sectionIds = ["about", "projects", "contact"];

export function MobileNav({ open, onClose, fullName, contact, resumeUrl }: MobileNavProps) {
  const activeSection = useActiveSection(sectionIds);

  useEffect(() => {
    if (open && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const socialLinks = [];
  if (contact?.email) socialLinks.push({ href: `mailto:${contact.email}`, icon: LuMail, label: "Email" });
  if (contact?.linkedin_url) socialLinks.push({ href: contact.linkedin_url, icon: FaLinkedin, label: "LinkedIn" });
  if (contact?.github_url) socialLinks.push({ href: contact.github_url, icon: SiGithub, label: "GitHub" });
  if (contact?.tiktok_url) socialLinks.push({ href: contact.tiktok_url, icon: SiTiktok, label: "TikTok" });

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60] bg-black/50 md:bg-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed z-[60] flex flex-col
              inset-0 md:inset-auto
              bg-background/70 backdrop-blur-xl
              md:top-20 md:right-4 md:w-72 md:rounded-2xl md:bg-surface/95 md:shadow-xl md:ring-1 md:ring-border md:p-6
              lg:right-6 lg:w-80
              items-start justify-start
              px-6 pt-20 md:pt-14"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-muted hover:text-accent-secondary"
              aria-label="Close menu"
            >
              <LuX size={20} />
            </button>

            <motion.div
              className="flex w-full flex-col items-stretch gap-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const, delay: 0.05 }}
            >
              {/* Name — mobile only */}
              <div className="flex items-center gap-3 md:hidden">
                <span className="font-heading text-xl text-primary">{renderTextWithAmpersand(fullName)}</span>
              </div>

              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => {
                  const sectionId = link.href.replace("/#", "");
                  const isActive = activeSection === sectionId;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const, delay: 0.1 + i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className={`flex items-center gap-4 rounded-full px-4 py-2.5 text-base transition-colors sm:gap-5 sm:px-5 sm:py-3 lg:text-lg ${
                          isActive
                            ? "bg-accent-secondary/10 font-medium text-accent-secondary"
                            : "text-secondary hover:bg-surface-muted hover:text-primary"
                        }`}
                      >
                        {navIcons[link.icon]}
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const, delay: 0.1 + NAV_LINKS.length * 0.05 }}
                >
                  <a
                    href={resumeUrl ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="flex items-center gap-4 rounded-full px-4 py-2.5 text-base text-secondary transition-colors hover:bg-surface-muted hover:text-primary sm:gap-5 sm:px-5 sm:py-3 lg:text-lg"
                  >
                    <LuDownload size={18} />
                    Download Resume
                  </a>
                </motion.div>
              </nav>

              {socialLinks.length > 0 && (
                <motion.div
                  className="flex items-center gap-4 px-4"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const, delay: 0.3 + (NAV_LINKS.length - 1) * 0.05 }}
                >
                  {socialLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.label}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-secondary transition-colors hover:bg-surface-muted hover:text-accent-secondary"
                      >
                        <Icon size={20} />
                      </a>
                    );
                  })}
                </motion.div>
              )}

            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
