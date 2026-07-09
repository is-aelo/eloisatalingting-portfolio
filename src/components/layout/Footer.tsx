import { Logo } from "@/components/ui/Logo";
import { createClient } from "@/lib/supabase/server";
import { FaLinkedin } from "react-icons/fa6";
import { SiGithub, SiTiktok } from "react-icons/si";
import { LuMail } from "react-icons/lu";
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
        <div className="flex flex-col items-center gap-6 sm:gap-8 md:flex-row">
          <div className="flex flex-1 items-center justify-center md:justify-start">
            <Logo />
          </div>

          {socialLinks.length > 0 ? (
            <div className="flex items-center gap-2.5 sm:gap-3">
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
          ) : null}
        </div>

        <div className="mt-6 flex flex-col items-center md:flex-row md:justify-end sm:mt-8">
          <p className="text-[10px] text-primary/80 sm:text-xs">
            &copy; {new Date().getFullYear()} {name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
