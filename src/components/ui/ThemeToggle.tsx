"use client";

import { useTheme } from "@/hooks/useTheme";
import { LuSun, LuMoon } from "react-icons/lu";

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

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
