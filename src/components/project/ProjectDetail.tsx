import type { ProjectRow, ProjectMediaRow, ProjectCTARow } from "@/types/database";

interface ProjectWithRelations extends ProjectRow {
  project_media: ProjectMediaRow[];
  project_ctas: ProjectCTARow[];
}

function formatDate(date: string | null): string | null {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

export function ProjectDetail({ project }: { project: ProjectWithRelations }) {
  const startDate = formatDate(project.start_date);
  const endDate = project.end_date ? formatDate(project.end_date) : "Present";
  const dateRange = startDate && endDate ? `${startDate} — ${endDate}` : startDate ?? endDate ?? null;

  const sortedMedia = [...project.project_media].sort((a, b) => a.sort_order - b.sort_order);
  const sortedCtas = [...project.project_ctas].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <article>
      <div className="mx-auto w-full max-w-6xl px-6 pt-8 md:pt-12">
        {project.cover_image_url ? (
          <div className="overflow-hidden rounded-xl">
            <img
              src={project.cover_image_url}
              alt={project.title}
              className="w-full object-cover md:h-[67.5rem]"
            />
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center rounded-xl bg-surface-muted">
            <span className="font-heading text-6xl text-muted">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 pt-8 pb-10 md:pt-12 md:pb-16">
        <div className="mb-10 md:mb-12">
          {project.project_type && (
            <p className="font-body text-xs text-muted uppercase tracking-wider">
              {project.project_type}
            </p>
          )}
          <h1 className="mt-2 font-heading text-3xl text-primary md:text-5xl">
            {project.title}
          </h1>
        </div>

        {project.short_description && (
          <p className="mb-10 text-base italic leading-relaxed text-secondary md:mb-12 md:text-lg">
            {project.short_description}
          </p>
        )}

        <div className="grid gap-10 md:grid-cols-3">
          <aside className="md:col-span-1">
            <div className="space-y-8 md:sticky md:top-24">
              {project.role && (
                <div>
                  <h3 className="font-heading text-xs text-muted uppercase tracking-wider">
                    Role
                  </h3>
                    <p className="mt-1 font-body text-xs text-primary">
                    {project.role}
                  </p>
                </div>
              )}

              {project.client_name && (
                <div>
                  <h3 className="font-heading text-xs text-muted uppercase tracking-wider">
                    Client
                  </h3>
                  <p className="mt-1 font-body text-xs text-primary">
                    {project.client_name}
                  </p>
                </div>
              )}

              {dateRange && (
                <div>
                  <h3 className="font-heading text-xs text-muted uppercase tracking-wider">
                    Date
                  </h3>
                  <p className="mt-1 font-body text-xs text-primary">
                    {dateRange}
                  </p>
                </div>
              )}

              {project.tech_stack_summary && (
                <div>
                  <h3 className="font-heading text-xs text-muted uppercase tracking-wider">
                    Tech Stack
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.tech_stack_summary.split(",").map((tech) => (
                      <span
                        key={tech.trim()}
                        className="rounded-full bg-accent-tertiary/10 px-3 py-1 font-body text-xs text-accent-tertiary"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          <div className="md:col-span-2 md:col-start-2">
            {project.content_md && (
              <div
                className="prose prose-neutral mt-8 max-w-none dark:prose-invert prose-headings:font-heading prose-headings:text-primary prose-p:text-secondary prose-p:leading-relaxed prose-a:text-accent-secondary prose-a:no-underline hover:prose-a:underline prose-strong:text-primary prose-code:text-accent-tertiary prose-li:text-secondary"
                dangerouslySetInnerHTML={{ __html: project.content_md }}
              />
            )}

            {sortedMedia.length > 0 && (
              <div className="mt-12 space-y-8">
                {sortedMedia.map((media) => (
                  <figure key={media.id}>
                    {media.media_type === "image" || media.media_type === "gif" ? (
                      <img
                        src={media.media_url}
                        alt={media.alt_text ?? ""}
                        className="w-full rounded-xl"
                      />
                    ) : (
                      <div className="aspect-video w-full overflow-hidden rounded-xl">
                        <iframe
                          src={media.media_url}
                          title={media.alt_text ?? ""}
                          className="h-full w-full"
                          allowFullScreen
                        />
                      </div>
                    )}
                    {media.caption && (
                      <figcaption className="mt-3 text-center text-sm text-muted">
                        {media.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            )}

            {sortedCtas.length > 0 && (
              <div className="mt-12 flex flex-wrap gap-4">
                {sortedCtas.map((cta) => (
                  <a
                    key={cta.id}
                    href={cta.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-accent px-6 py-3 font-body text-sm text-background transition-opacity hover:opacity-90"
                  >
                    {cta.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
