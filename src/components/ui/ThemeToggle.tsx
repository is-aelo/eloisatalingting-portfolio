"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { LuSun, LuMoon } from "react-icons/lu";

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className="text-primary transition-colors cursor-pointer"
      >
        <span className="inline-block h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="text-primary hover:text-accent-secondary transition-colors cursor-pointer"
    >
      {isDark ? <LuSun size={20} /> : <LuMoon size={20} />}
    </button>
  );
}
