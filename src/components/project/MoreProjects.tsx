import Link from "next/link";
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
    <section className="border-t border-border mt-16 py-16 sm:mt-20 sm:py-20 md:mt-24 md:py-24">
      <div className="mx-auto max-w-5xl px-5 sm:px-6 md:px-8 lg:px-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="font-body text-[10px] text-primary/80 uppercase tracking-widest sm:text-xs">
              Next
            </span>
            <h2 className="mt-1 font-heading text-xl text-primary sm:text-2xl md:text-3xl">
              More Projects
            </h2>
          </div>
          <Link
            href="/#projects"
            className="hidden font-body text-xs text-primary/80 transition-colors hover:text-accent-secondary sm:inline-flex sm:items-center sm:gap-1.5 sm:text-sm"
          >
            View all
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all duration-300 hover:border-accent-secondary/30"
            >
              <div className="aspect-video w-full overflow-hidden bg-surface-muted">
                {project.thumbnail_url ? (
                  <img
                    src={project.thumbnail_url}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="font-heading text-4xl text-muted/20 sm:text-5xl">
                      {project.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4 sm:p-5 md:p-6">
                {project.project_type && (
                  <span className="font-body text-[10px] text-accent-secondary uppercase tracking-wider sm:text-xs">
                    {project.project_type}
                  </span>
                )}
                <h3 className="mt-1.5 font-heading font-bold text-lg text-primary sm:text-xl md:text-2xl">
                  {renderTextWithAmpersand(project.title)}
                </h3>
                {project.short_description && (
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-secondary sm:text-sm">
                    {project.short_description}
                  </p>
                )}
                <div className="mt-auto pt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-accent-secondary transition-colors group-hover:gap-2.5 sm:text-sm">
                    View project
                    <svg className="h-3.5 w-3.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-1.5 font-body text-sm text-primary/80 transition-colors hover:text-accent-secondary"
          >
            View all projects
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
