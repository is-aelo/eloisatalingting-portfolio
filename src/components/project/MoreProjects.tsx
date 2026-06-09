import Link from "next/link";

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
    <section className="border-t border-border py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-heading text-2xl text-primary md:text-3xl">
          More Projects
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                    <span className="font-heading text-4xl text-muted">
                      {project.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4 md:p-5">
                {project.project_type && (
                  <span className="font-body text-xs text-muted uppercase tracking-wider">
                    {project.project_type}
                  </span>
                )}
                <h3 className="mt-1 font-heading text-lg text-primary md:text-xl">
                  {project.title}
                </h3>
                {project.short_description && (
                  <p className="mt-2 line-clamp-2 font-body text-sm leading-relaxed text-secondary">
                    {project.short_description}
                  </p>
                )}
                {project.tech_stack_summary && (
                  <p className="mt-auto pt-3 font-body text-xs text-accent-tertiary">
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
