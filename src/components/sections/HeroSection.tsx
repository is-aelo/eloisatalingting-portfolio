"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaLinkedin } from "react-icons/fa6";
import { SiBehance, SiGithub } from "react-icons/si";
import { LuArrowUpRight } from "react-icons/lu";
import { renderTextWithAmpersand } from "@/lib/text";
import { normalizeUrl } from "@/lib/url";

type Project = {
  slug: string;
  title: string;
  short_description: string | null;
  thumbnail_url: string | null;
  cover_image_url: string | null;
  project_type: string | null;
  tech_stack_summary: string | null;
  project_ctas: { label: string; url: string }[] | null;
  github_url: string | null;
};

type ContactLink = {
  email?: string | null;
  linkedin_url?: string | null;
  behance_url?: string | null;
};

type Props = {
  hero?: { headline: string; subheadline?: string | null; cta_primary_label?: string | null; cta_primary_url?: string | null; cta_secondary_label?: string | null; cta_secondary_url?: string | null; display?: boolean } | null;
  tools: { name: string; logo_url: string | null; category: string | null }[];
  fullName: string;
  role: string | null;
  location: string | null;
  summary: string | null;
  projects: Project[];
  contact?: ContactLink | null;
  resumeUrl?: string | null;
};

function useCurrentTime() {
  const [time, setTime] = useState("");

  useEffect(() => {
    function update() {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      setTime(formatter.format(now));
    }
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  return time;
}

export function HeroSection({ fullName, role, location, summary, projects, contact }: Props) {
  const currentTime = useCurrentTime();
  const hasProjects = projects.length > 0;

  return (
    <>
      <div className="sticky top-0 z-40 bg-background mt-8 sm:mt-12">
        <div className="mx-auto max-w-5xl border border-border">
          <div className="flex items-stretch divide-x divide-border">
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 bg-accent" />
                <span className="font-body text-[9px] text-accent uppercase tracking-wider sm:text-[10px]">
                  Open For Remote Opportunities
                </span>
              </div>
              {fullName && (
                <h1 className="truncate font-heading text-xs text-primary sm:text-sm">
                  {fullName}
                </h1>
              )}
            </div>

            <div className="hidden divide-x divide-border md:flex">
              {role && (
                <div className="flex flex-col justify-center gap-1 px-4 py-3 sm:px-6">
                  <span className="font-body text-[9px] text-secondary uppercase tracking-wider">
                    Role
                  </span>
                  <span className="font-heading text-xs text-primary sm:text-sm">
                    {role}
                  </span>
                </div>
              )}

              {location && (
                <div className="flex flex-col justify-center gap-1 px-4 py-3 sm:px-6">
                  <span className="font-body text-[9px] text-secondary uppercase tracking-wider">
                    Based In
                  </span>
                  <span className="font-heading text-xs text-primary sm:text-sm">
                    {location}
                  </span>
                </div>
              )}

              {currentTime && (
                <div className="flex flex-col justify-center gap-1 px-4 py-3 sm:px-6">
                  <span className="font-body text-[9px] text-secondary uppercase tracking-wider">
                    Local Time
                  </span>
                  <span className="font-heading text-xs text-primary sm:text-sm">
                    {currentTime}
                  </span>
                </div>
              )}

              {contact?.linkedin_url && (
                <a
                  href={normalizeUrl(contact.linkedin_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex w-12 items-center justify-center text-secondary transition-colors hover:text-accent"
                >
                  <FaLinkedin size={16} />
                </a>
              )}

              {contact?.behance_url && (
                <a
                  href={normalizeUrl(contact.behance_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Behance"
                  className="flex w-12 items-center justify-center text-secondary transition-colors hover:text-accent"
                >
                  <SiBehance size={15} />
                </a>
              )}
            </div>

            <a
              href={contact?.email ? `mailto:${contact.email}` : "#"}
              className="flex shrink-0 items-center gap-1.5 whitespace-nowrap bg-primary px-4 font-body text-[9px] text-background uppercase tracking-wider transition-opacity hover:opacity-90 sm:px-6 sm:text-[10px] md:text-xs lg:px-8"
            >
              Work With Me
              <LuArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </div>

      <div id="projects" className="scroll-mt-24">
      {summary && (
        <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
          <p className="text-sm leading-relaxed text-secondary sm:text-base">
            {summary}
          </p>
        </div>
      )}

      {hasProjects && (
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="font-body text-xs text-primary/80 uppercase tracking-wider">
            Selected Projects
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group flex flex-col border border-border bg-background transition-colors hover:border-accent"
              >
                <div className="relative overflow-hidden bg-surface-muted leading-0">
                  {project.cover_image_url || project.thumbnail_url ? (
                    <img
                      src={project.cover_image_url || project.thumbnail_url || undefined}
                      alt={project.title}
                      className="block w-full object-cover"
                      style={{ aspectRatio: "4/3" }}
                    />
                  ) : (
                    <div className="flex items-center justify-center bg-surface-muted" style={{ aspectRatio: "4/3" }}>
                      <span className="font-heading text-4xl text-muted">
                        {project.title.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-border px-3 py-2 sm:px-4 sm:py-3">
                  <h2 className="min-w-0 truncate font-heading text-xs text-primary sm:text-sm">
                    {renderTextWithAmpersand(project.title)}
                  </h2>

                  <div className="flex shrink-0 items-center gap-3">
                    {project.project_ctas?.[0]?.url && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          window.open(project.project_ctas![0].url, "_blank", "noopener");
                        }}
                        className="flex cursor-pointer items-center justify-center rounded-full border border-border p-1.5 text-secondary transition-colors hover:border-accent hover:text-accent"
                        aria-label="View live project"
                      >
                        <LuArrowUpRight size={13} />
                      </span>
                    )}
                    {project.github_url && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          window.open(project.github_url!, "_blank", "noopener");
                        }}
                        className="flex cursor-pointer items-center justify-center rounded-full border border-border p-1.5 text-secondary transition-colors hover:border-accent hover:text-accent"
                        aria-label="View source on GitHub"
                      >
                        <SiGithub size={12} />
                      </span>
                    )}
                    <span className="flex cursor-pointer items-center rounded-sm border border-accent bg-accent px-3 py-1.5 font-body text-[9px] text-background uppercase tracking-wider transition-opacity hover:opacity-90 sm:px-4 sm:text-[10px]">
                      Process
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
      </div>
    </>
  );
}