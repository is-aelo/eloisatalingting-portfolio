"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LuLayoutDashboard, LuUser, LuBriefcase, LuCode, LuWrench, LuFolderOpen, LuMessageSquare, LuSettings, LuLogOut, LuLink, LuGraduationCap, LuGitBranch } from "react-icons/lu";

const links = [
  { href: "/admin", label: "Dashboard", icon: LuLayoutDashboard },
  { href: "/admin/hero", label: "Hero", icon: LuFolderOpen },
  { href: "/admin/about", label: "About", icon: LuUser },
  { href: "/admin/skills", label: "Skills", icon: LuCode },
  { href: "/admin/tools", label: "Tools", icon: LuWrench },
  { href: "/admin/experiences", label: "Experience", icon: LuBriefcase },
  { href: "/admin/education", label: "Education", icon: LuGraduationCap },
  { href: "/admin/projects", label: "Projects", icon: LuFolderOpen },
  { href: "/admin/process", label: "Process", icon: LuGitBranch },
  { href: "/admin/testimonials", label: "Testimonials", icon: LuMessageSquare },
  { href: "/admin/contact", label: "Contact", icon: LuLink },
  { href: "/admin/settings", label: "Settings", icon: LuSettings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  if (pathname === "/admin/login") return null;

  return (
    <aside className="flex w-64 flex-col border-r border-border bg-surface">
      <div className="flex items-center gap-2 border-b border-border px-6 py-4">
        <span className="font-heading text-lg text-primary">Portfolio</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "font-medium text-accent-secondary"
                  : "text-secondary hover:text-accent-secondary"
              }`}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <button
          onClick={handleLogout}
          className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-secondary transition-colors hover:bg-surface-muted hover:text-primary"
        >
          <LuLogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
