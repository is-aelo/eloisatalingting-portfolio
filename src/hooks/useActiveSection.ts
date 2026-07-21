"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function useActiveSection(sectionIds: string[]) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length === 0) return;
        const best = intersecting.reduce((a, b) =>
          a.intersectionRatio > b.intersectionRatio ? a : b,
        );
        setActiveSection(best.target.id);
      },
      {
        rootMargin: "-10% 0px -30% 0px",
        threshold: 0.1,
      },
    );

    const elements: Element[] = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        elements.push(el);
      }
    });

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [sectionIds, pathname]);

  return activeSection;
}
