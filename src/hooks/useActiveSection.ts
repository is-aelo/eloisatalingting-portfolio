"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function useActiveSection(sectionIds: string[]) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const offset = 120;
      let current = "";
      let closestTop = -Infinity;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= offset && rect.top > closestTop) {
          closestTop = rect.top;
          current = id;
        }
      }

      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds, pathname]);

  return activeSection;
}
