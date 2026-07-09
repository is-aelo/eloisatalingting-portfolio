"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { renderTextWithAmpersand } from "@/lib/text";

gsap.registerPlugin(ScrollTrigger);

type SkillGroup = {
  category: string;
  items: string[];
};

type Tool = {
  name: string;
  logo_url: string | null;
  category: string | null;
};

type Education = {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string | null;
  start_date: string;
  end_date: string | null;
};

type Experience = {
  id: string;
  company_name: string;
  role_title: string;
  start_date: string;
  end_date: string | null;
  currently_working: boolean;
  summary: string | null;
};

type Props = {
  skillGroups: SkillGroup[];
  tools: Tool[];
  education: Education[];
  experiences: Experience[];
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmtMY = (s: string) => {
  const [y, m] = s.split("-");
  return m ? `${months[parseInt(m) - 1]} ${y}` : y;
};
const fmtY = (s: string) => s.split("-")[0];

export function AboutSection({ skillGroups, tools, education, experiences }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll<HTMLElement>("[data-reveal]");
      if (cards?.length) {
        gsap.fromTo(
          cards,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              once: true,
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section id="about" ref={sectionRef} className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-14 lg:gap-16">

          {/* Left: Experience + Education */}
          <div data-reveal>
            {experiences.length > 0 && (
              <div>
                <p className="font-body text-xs text-primary/80 uppercase tracking-wider">Experience</p>
                <div className="relative mt-5 space-y-7 sm:mt-6 sm:space-y-8">
                  <div className="absolute left-[5px] top-2 bottom-2 w-px bg-border" />
                  {experiences.slice(0, 3).map((exp) => (
                    <div key={exp.id} className="relative pl-7 sm:pl-8">
                      <div className="absolute left-0 top-1.5 h-[10px] w-[10px] rounded-full border-2 border-accent-secondary bg-background" />
                      <p className="font-heading text-sm sm:text-base font-medium text-primary">
                        {renderTextWithAmpersand(exp.role_title)}
                      </p>
                      <p className="mt-0.5 text-xs sm:text-sm text-secondary">{exp.company_name}</p>
                      <p className="mt-1 text-[10px] sm:text-xs text-primary/80">
                        {fmtMY(exp.start_date)} — {exp.currently_working ? "Present" : exp.end_date ? fmtMY(exp.end_date) : ""}
                      </p>
                      {exp.summary && (
                        <p className="mt-1 text-xs sm:text-sm text-secondary leading-relaxed">
                          {exp.summary}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {education.length > 0 && (
              <div className="mt-10">
                <p className="font-body text-xs text-primary/80 uppercase tracking-wider">Education</p>
                <div className="relative mt-5 space-y-7 sm:mt-6 sm:space-y-8">
                  <div className="absolute left-[5px] top-2 bottom-2 w-px bg-border" />
                  {education.slice(0, 3).map((edu) => (
                    <div key={edu.id} className="relative pl-7 sm:pl-8">
                      <div className="absolute left-0 top-1.5 h-[10px] w-[10px] rounded-full border-2 border-accent-tertiary bg-background" />
                      <p className="font-heading text-sm sm:text-base font-medium text-primary">
                        {renderTextWithAmpersand(edu.degree)}
                      </p>
                      <p className="mt-0.5 text-xs sm:text-sm text-secondary">{edu.institution}</p>
                      <p className="mt-1 text-[10px] sm:text-xs text-primary/80">
                        {fmtY(edu.start_date)} — {edu.end_date ? fmtY(edu.end_date) : "Present"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Skills & Technologies + Tools */}
          <div data-reveal>
            <p className="font-body text-xs text-primary/80 uppercase tracking-wider">Skills &amp; Technologies</p>

            {skillGroups.length > 0 && (
              <div className="mt-6 space-y-6">
                {skillGroups.map((group) => (
                  <div key={group.category}>
                    <div className="flex items-center gap-3">
                      <p className="font-heading text-sm sm:text-base font-medium text-primary">
                        {renderTextWithAmpersand(group.category)}
                      </p>
                      <div className="h-px flex-1 bg-accent-secondary/20" />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
                      {group.items.map((skill) => (
                        <span
                          key={skill}
                          className="inline-block rounded-full bg-surface-muted px-2 py-0.5 font-body text-[10px] text-secondary transition-colors hover:bg-accent-secondary/10 hover:text-accent-secondary sm:px-2.5 sm:py-1 sm:text-[11px] md:px-3 md:py-1 md:text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tools.length > 0 && (
              <div className="mt-10">
                <div className="flex items-center gap-4">
                  <span className="font-body text-[10px] text-accent-secondary uppercase tracking-widest font-medium">
                    Tools
                  </span>
                  <div className="h-px flex-1 bg-accent-secondary/20" />
                </div>
                <div className="mt-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
                  <div className="flex w-fit gap-3 animate-[marquee_30s_linear_infinite]">
                    {[...tools, ...tools].map((tool, i) => (
                      <span
                        key={`${tool.name}-${i}`}
                        className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border/50 bg-surface/80 px-4 py-1.5 font-body text-xs text-secondary backdrop-blur-sm transition-colors hover:border-accent-secondary/30 hover:text-accent-secondary md:text-sm"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-accent-secondary/40" />
                        {tool.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
