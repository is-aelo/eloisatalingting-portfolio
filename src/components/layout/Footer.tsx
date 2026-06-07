import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NAV_LINKS } from "@/data/constants";
import { FaLinkedin } from "react-icons/fa6";
import { SiGithub, SiTiktok } from "react-icons/si";
import { LuMail } from "react-icons/lu";

export async function Footer() {
  const supabase = await createClient();
  const [{ data: about }, { data: contact }] = await Promise.all([
    supabase.from("about").select("full_name").maybeSingle(),
    supabase.from("contact").select("*").maybeSingle(),
  ]);

  const name = about?.full_name ?? "Portfolio";

  const socialLinks = [];
  if (contact?.email) socialLinks.push({ href: `mailto:${contact.email}`, icon: LuMail, label: "Email" });
  if (contact?.linkedin_url) socialLinks.push({ href: contact.linkedin_url, icon: FaLinkedin, label: "LinkedIn" });
  if (contact?.github_url) socialLinks.push({ href: contact.github_url, icon: SiGithub, label: "GitHub" });
  if (contact?.tiktok_url) socialLinks.push({ href: contact.tiktok_url, icon: SiTiktok, label: "TikTok" });

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div>
            <Link href="/" className="font-heading text-lg text-primary transition-colors hover:text-accent-secondary">
              {name}
            </Link>
          </div>

          <nav className="flex gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-secondary transition-colors hover:text-accent-secondary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {socialLinks.length > 0 && (
            <div className="flex gap-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="text-secondary transition-colors hover:text-accent-secondary"
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-xs text-muted">
          &copy; {new Date().getFullYear()} {name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
