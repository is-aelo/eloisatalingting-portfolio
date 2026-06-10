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
    <section className="border-t border-border py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 md:px-8 lg:px-6">
        <h2 className="font-heading text-xl text-primary sm:text-2xl md:text-3xl">
          More Projects
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:mt-8 sm:grid-cols-2 sm:gap-6">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-accent-secondary/30"
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
                    <span className="font-heading text-3xl text-muted sm:text-4xl">
                      {project.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-3.5 sm:p-4 md:p-5">
                {project.project_type && (
                  <span className="font-body text-[10px] text-muted uppercase tracking-wider sm:text-xs">
                    {project.project_type}
                  </span>
                )}
                <h3 className="mt-1 font-heading text-base text-primary sm:text-lg md:text-xl">
                  {renderTextWithAmpersand(project.title)}
                </h3>
                {project.short_description && (
                  <p className="mt-1.5 line-clamp-2 font-body text-xs leading-relaxed text-secondary sm:mt-2 sm:text-sm">
                    {project.short_description}
                  </p>
                )}
                {project.tech_stack_summary && (
                  <p className="mt-auto pt-2.5 font-body text-[10px] text-accent-tertiary sm:pt-3 sm:text-xs">
                    {project.tech_stack_summary}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
