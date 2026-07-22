import Link from "next/link";
import { LuArrowUpRight } from "react-icons/lu";
import { renderTextWithAmpersand } from "@/lib/text";

type Project = {
  slug: string;
  title: string;
  short_description: string | null;
  thumbnail_url: string | null;
  project_type: string | null;
  tech_stack_summary: string | null;
};

export function MoreProjects({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;

  return (
    <section className="border-t border-border mt-12 py-12 sm:mt-16 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="font-body text-[10px] text-primary/80 uppercase tracking-widest sm:text-xs">
              Next
            </span>
            <h2 className="mt-1 font-heading text-lg text-primary sm:text-xl">
              More Projects
            </h2>
          </div>
          <Link
            href="/#projects"
            className="hidden font-body text-xs text-primary/80 transition-colors hover:text-accent sm:inline-flex sm:items-center sm:gap-1.5 sm:text-sm"
          >
            View all
            <LuArrowUpRight size={14} />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group flex flex-col border border-border bg-background transition-colors hover:border-accent"
            >
              <div className="relative overflow-hidden bg-surface-muted leading-0">
                {project.thumbnail_url ? (
                  <img
                    src={project.thumbnail_url}
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
                <h3 className="min-w-0 truncate font-heading text-xs text-primary sm:text-sm">
                  {renderTextWithAmpersand(project.title)}
                </h3>
                <LuArrowUpRight size={13} className="shrink-0 text-secondary transition-colors group-hover:text-accent" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-1.5 font-body text-sm text-primary/80 transition-colors hover:text-accent"
          >
            View all projects
            <LuArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}