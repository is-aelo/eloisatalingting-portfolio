import Link from "next/link";
import { LuArrowUpRight } from "react-icons/lu";

type Project = {
  slug: string;
  title: string;
  short_description: string | null;
  project_type: string | null;
  thumbnail_url: string | null;
  tech_stack_summary: string | null;
};

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-body text-sm text-muted uppercase tracking-wider">Projects</p>
            <h2 className="mt-2 font-heading text-3xl text-primary md:text-4xl">Featured Work</h2>
          </div>
          <Link
            href="/projects"
            className="hidden cursor-pointer items-center gap-1 font-body text-sm text-accent-secondary transition-opacity hover:opacity-80 md:inline-flex"
          >
            View all <LuArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      <div className="mt-10 mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-12 md:gap-20">
        {projects.map((project, i) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="group flex flex-col-reverse md:grid md:grid-cols-2 md:gap-12 lg:gap-20"
          >
            <div className={`flex flex-col justify-center py-8 md:py-12 ${
              i % 2 === 1 ? "md:order-2" : "md:order-1"
            }`}>
              {project.project_type && (
                <span className="font-body text-xs text-muted uppercase tracking-wider">{project.project_type}</span>
              )}
              <h3 className="mt-2 font-heading text-2xl text-primary transition-colors group-hover:text-accent-secondary md:text-3xl lg:text-4xl">
                {project.title}
              </h3>
              {project.short_description && (
                <p className="mt-4 text-base leading-relaxed text-secondary md:text-lg">
                  {project.short_description}
                </p>
              )}
              {project.tech_stack_summary && (
                <p className="mt-4 text-sm text-muted">{project.tech_stack_summary}</p>
              )}
              <span className="mt-6 inline-flex items-center gap-1 font-body text-sm text-accent-secondary transition-opacity group-hover:opacity-80">
                View case study <LuArrowUpRight size={16} />
              </span>
            </div>

            <div className={`overflow-hidden bg-surface-muted ${
              i % 2 === 1 ? "md:order-1" : "md:order-2"
            }`}>
              {project.thumbnail_url ? (
                <img
                  src={project.thumbnail_url}
                  alt={project.title}
                  className="min-h-[300px] h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-[300px] items-center justify-center bg-surface-muted">
                  <span className="font-heading text-5xl text-muted">{project.title.charAt(0)}</span>
                </div>
              )}
            </div>
          </Link>
        ))}
        </div>
      </div>

      <div className="mt-12 text-center md:hidden">
        <Link
          href="/projects"
          className="inline-flex cursor-pointer items-center gap-1 font-body text-sm text-accent-secondary transition-opacity hover:opacity-80"
        >
          View all projects <LuArrowUpRight size={16} />
        </Link>
      </div>
    </section>
  );
}
