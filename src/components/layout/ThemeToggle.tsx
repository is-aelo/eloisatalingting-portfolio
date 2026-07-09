"use client";

import { useTheme } from "@/providers/ThemeProvider";
import { LuMonitor, LuMoon, LuSun } from "react-icons/lu";

const modes = [
  { key: "system" as const, Icon: LuMonitor, label: "System" },
  { key: "light" as const, Icon: LuSun, label: "Light" },
  { key: "dark" as const, Icon: LuMoon, label: "Dark" },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-center rounded-lg border border-border p-0.5">
      {modes.map(({ key, Icon, label }) => (
        <button
          key={key}
          onClick={() => setTheme(key)}
          className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors ${
            theme === key
              ? "bg-background text-accent-secondary shadow-sm"
              : "text-secondary hover:text-accent-secondary"
          }`}
          aria-label={label}
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  );
}
