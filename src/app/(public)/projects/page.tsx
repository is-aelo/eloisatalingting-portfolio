import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDateRange, formatDateLong } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("id, slug, title, short_description, project_type, thumbnail_url, tech_stack_summary, start_date, end_date")
    .eq("display", true)
    .order("created_at", { ascending: false });

  let projectCtas: Record<string, { label: string; url: string } | undefined> = {};
  if (projects && projects.length > 0) {
    const { data: ctas } = await supabase
      .from("project_ctas")
      .select("project_id, label, url")
      .in("project_id", projects.map((p) => p.id))
      .order("sort_order", { ascending: true });

    if (ctas) {
      const seen = new Set<string>();
      for (const cta of ctas) {
        if (!seen.has(cta.project_id)) {
          seen.add(cta.project_id);
          projectCtas[cta.project_id] = { label: cta.label, url: cta.url };
        }
      }
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="mb-12">
        <p className="font-body text-sm text-muted uppercase tracking-wider">Projects</p>
        <h1 className="mt-2 font-heading text-3xl text-primary md:text-4xl">All Projects</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project) => {
          const cta = projectCtas[project.id];
          return (
            <article key={project.id} className="group flex flex-col overflow-hidden rounded-xl bg-surface-muted">
              <Link href={`/projects/${project.slug}`} className="overflow-hidden">
                {project.thumbnail_url ? (
                  <img
                    src={project.thumbnail_url}
                    alt={project.title}
                    className="aspect-video w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-surface-muted">
                    <span className="font-heading text-4xl text-muted">{project.title.charAt(0)}</span>
                  </div>
                )}
              </Link>

              <div className="flex flex-1 flex-col p-5">
                {project.project_type && (
                  <span className="font-body text-xs text-muted uppercase tracking-wider">{project.project_type}</span>
                )}

                <Link href={`/projects/${project.slug}`}>
                  <h2 className="mt-2 font-heading text-xl text-primary transition-colors group-hover:text-accent-secondary">
                    {project.title}
                  </h2>
                </Link>

                {project.short_description && (
                  <p className="mt-2 line-clamp-2 text-sm text-secondary">{project.short_description}</p>
                )}

                {project.start_date && (
                  <p className="mt-3 text-xs text-muted">
                    {project.end_date
                      ? formatDateRange(project.start_date, project.end_date)
                      : formatDateLong(project.start_date)}
                  </p>
                )}

                {project.tech_stack_summary && (
                  <p className="mt-2 text-xs text-muted">{project.tech_stack_summary}</p>
                )}

                <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex cursor-pointer items-center gap-1 font-body text-sm text-accent-secondary transition-opacity hover:opacity-80"
                  >
                    View case study
                  </Link>
                  {cta && (
                    <a
                      href={cta.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-accent px-3 py-1.5 font-body text-xs text-background transition-opacity hover:opacity-90"
                    >
                      {cta.label}
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {(!projects || projects.length === 0) && (
        <p className="text-center text-sm text-muted">No projects yet.</p>
      )}
    </div>
  );
}
