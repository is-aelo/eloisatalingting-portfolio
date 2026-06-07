import { SiFigma, SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiNodedotjs, SiPython, SiDocker, SiFramer, SiMongodb, SiPostgresql, SiSupabase, SiGit, SiGraphql, SiSass, SiJavascript, SiHtml5, SiCss } from "react-icons/si";

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  figma: SiFigma,
  react: SiReact,
  nextjs: SiNextdotjs,
  "next.js": SiNextdotjs,
  typescript: SiTypescript,
  tailwind: SiTailwindcss,
  "tailwind css": SiTailwindcss,
  node: SiNodedotjs,
  "node.js": SiNodedotjs,
  python: SiPython,
  docker: SiDocker,
  framer: SiFramer,
  "framer motion": SiFramer,
  mongodb: SiMongodb,
  postgresql: SiPostgresql,
  postgres: SiPostgresql,
  supabase: SiSupabase,
  git: SiGit,
  graphql: SiGraphql,
  sass: SiSass,
  javascript: SiJavascript,
  html: SiHtml5,
  css: SiCss,
};

type Tool = {
  name: string;
  logo_url: string | null;
  category: string | null;
};

export function ToolsMarquee({ tools }: { tools: Tool[] }) {
  if (!tools.length) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-body text-sm text-muted uppercase tracking-wider">Tools & Tech</p>
        <h2 className="mt-2 font-heading text-3xl text-primary md:text-4xl">Stack I work with</h2>

        <div className="mt-10 flex flex-wrap gap-4">
          {tools.map((tool, i) => {
            const Icon = tool.logo_url ? null : iconMap[tool.name.toLowerCase()];
            return (
              <span key={i} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-secondary transition-colors hover:border-accent-secondary/30">
                {tool.logo_url ? (
                  <img src={tool.logo_url} alt={tool.name} className="h-5 w-5 object-contain" />
                ) : Icon ? (
                  <Icon size={18} />
                ) : null}
                {tool.name}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
