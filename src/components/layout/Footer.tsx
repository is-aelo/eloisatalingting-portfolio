import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NAV_LINKS } from "@/data/constants";
import { FaLinkedin } from "react-icons/fa6";
import { SiGithub, SiTiktok } from "react-icons/si";
import { LuMail } from "react-icons/lu";
import { renderTextWithAmpersand } from "@/lib/text";
import { normalizeUrl } from "@/lib/url";

export async function Footer() {
  const supabase = await createClient();
  const [{ data: about }, { data: contact }] = await Promise.all([
    supabase.from("about").select("full_name").maybeSingle(),
    supabase.from("contact").select("*").maybeSingle(),
  ]);

  const name = about?.full_name ?? "Portfolio";

  const socialLinks = [];
  if (contact?.email) socialLinks.push({ href: `mailto:${contact.email}`, icon: LuMail, label: "Email" });
  if (contact?.linkedin_url) socialLinks.push({ href: normalizeUrl(contact.linkedin_url), icon: FaLinkedin, label: "LinkedIn" });
  if (contact?.github_url) socialLinks.push({ href: normalizeUrl(contact.github_url), icon: SiGithub, label: "GitHub" });
  if (contact?.tiktok_url) socialLinks.push({ href: normalizeUrl(contact.tiktok_url), icon: SiTiktok, label: "TikTok" });

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 md:px-8 lg:px-6 py-10 sm:py-12">
        <div className="flex flex-col items-center justify-between gap-6 sm:gap-8 md:flex-row">
          <div>
            <Link href="/" className="font-heading text-base sm:text-lg font-medium text-primary transition-colors hover:text-accent-secondary">
              {renderTextWithAmpersand(name)}
            </Link>
          </div>

          <nav className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-secondary transition-colors hover:text-accent-secondary sm:text-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {socialLinks.length > 0 && (
            <div className="flex gap-2.5 sm:gap-3">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-secondary transition-colors hover:bg-surface-muted hover:text-accent-secondary sm:h-9 sm:w-9"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-[10px] text-primary/80 sm:mt-8 sm:text-xs">
          &copy; {new Date().getFullYear()} {name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
