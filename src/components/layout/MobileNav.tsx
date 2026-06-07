"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "@/data/constants";
import { FaLinkedin } from "react-icons/fa6";
import { SiGithub, SiTiktok } from "react-icons/si";
import { LuMail, LuX } from "react-icons/lu";

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
};

export function MobileNav({ open, onClose, fullName, contact }: MobileNavProps) {
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  }, [pathname]);

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
          {/* Backdrop — fullscreen on mobile only */}
          <motion.div
            className="fixed inset-0 z-[60] bg-black/50 md:hidden"
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
              md:top-20 md:right-6 md:w-72 md:rounded-2xl md:bg-surface/95 md:shadow-xl md:ring-1 md:ring-border md:p-6
              items-center justify-center md:items-stretch md:justify-start
              px-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-primary transition-colors hover:bg-surface-muted hover:text-accent-secondary"
              aria-label="Close menu"
            >
              <LuX size={20} />
            </button>

            <motion.div
              className="flex flex-col items-center gap-10 md:gap-6 md:items-stretch"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const, delay: 0.05 }}
            >
              {/* Name — mobile only */}
              <div className="flex items-center gap-3 md:hidden">
                <span className="font-heading text-xl text-primary">{fullName}</span>
              </div>

              <nav className="flex flex-col items-center gap-2 md:items-stretch">
                {NAV_LINKS.map((link, i) => {
                  const isActive = pathname === link.href;
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
                        className={`block rounded-xl px-8 py-3 text-center transition-colors md:px-4 md:text-left md:text-base md:py-2.5 text-lg ${
                          isActive
                            ? "bg-surface-muted font-medium text-primary"
                            : "text-secondary hover:bg-surface-muted hover:text-primary"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {socialLinks.length > 0 && (
                <motion.div
                  className="flex items-center justify-center gap-4 md:justify-start"
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
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-secondary transition-colors hover:bg-surface-muted hover:text-accent-secondary"
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
