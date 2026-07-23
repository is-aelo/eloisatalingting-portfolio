"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuFolder, LuUser, LuMessageSquare, LuHouse, LuMenu, LuX } from "react-icons/lu";
import gsap from "gsap";
import { NAV_LINKS } from "@/data/constants";
import { useActiveSection } from "@/hooks/useActiveSection";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const sectionIds = ["about", "projects", "contact"];

const navIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  home: LuHouse,
  projects: LuFolder,
  about: LuUser,
  contact: LuMessageSquare,
};

export function Nav() {
  const pathname = usePathname();
  const activeSection = useActiveSection(sectionIds);
  const isHome = pathname === "/";
  const isProjectPage = pathname.startsWith("/projects/");

  const resolvedSection = isProjectPage
    ? "projects"
    : isHome
      ? activeSection
      : "home";
  const [footerVisible, setFooterVisible] = useState(false);
  const [tabsVisible, setTabsVisible] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = document.getElementById("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    gsap.killTweensOf(el);

    if (tabsVisible) {
      gsap.fromTo(
        el,
        { autoAlpha: 0, scaleX: 0.8, transformOrigin: "left center" },
        { autoAlpha: 1, scaleX: 1, duration: 0.25, ease: "power2.out" }
      );
    } else {
      gsap.to(el, {
        autoAlpha: 0,
        scaleX: 0.8,
        transformOrigin: "left center",
        duration: 0.2,
        ease: "power2.in",
      });
    }
  }, [tabsVisible]);

  return (
    <div
      className={`fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1.5 transition-opacity duration-300 ${
        footerVisible ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <button
        onClick={() => setTabsVisible((v) => !v)}
        className="flex items-center justify-center rounded-full border border-border bg-background p-2.5 text-primary transition-colors hover:text-accent"
        aria-label={tabsVisible ? "Hide navigation" : "Show navigation"}
      >
        {tabsVisible ? <LuX size={18} /> : <LuMenu size={18} />}
      </button>

      <div
        ref={contentRef}
        className="flex items-center gap-0.5 rounded-sm border border-border bg-background px-1.5 py-1 sm:gap-2 sm:px-3 sm:py-2"
      >
        {NAV_LINKS.filter((link) => {
          if (link.href === "/#home") return !isHome;
          return isHome;
        }).map((link) => {
          const sectionId = link.href.replace("/#", "");
          const isActive = resolvedSection === sectionId;
          const Icon = navIcons[sectionId];
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center justify-center rounded-sm p-2 font-body text-[10px] uppercase tracking-wider transition-colors sm:gap-1.5 sm:px-4 sm:py-1.5 sm:text-xs ${
                isActive
                  ? "bg-accent/10 text-accent font-medium"
                  : "text-secondary hover:text-accent"
              }`}
            >
              {Icon && <Icon size={17} />}
              <span className="hidden sm:inline">{link.label}</span>
            </Link>
          );
        })}
        <div className="ml-0.5 border-l border-border pl-1.5 sm:ml-2 sm:pl-3">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}