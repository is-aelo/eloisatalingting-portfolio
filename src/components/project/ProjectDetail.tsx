import Link from "next/link";
import type { ProjectRow, ProjectMediaRow, ProjectCTARow, ToolRow } from "@/types/database";
import { renderTextWithAmpersand } from "@/lib/text";

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

export function ProjectDetail({ project, tools }: { project: ProjectWithRelations; tools: ToolRow[] }) {
  const startDate = formatDate(project.start_date);
  const endDate = project.end_date ? formatDate(project.end_date) : "Present";
  const dateRange = startDate && endDate ? `${startDate} — ${endDate}` : startDate ?? endDate ?? null;

  const sortedMedia = [...project.project_media].sort((a, b) => a.sort_order - b.sort_order);
  const sortedCtas = [...project.project_ctas].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <article>
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6 md:px-8 lg:px-6 pt-6 sm:pt-8 md:pt-12">
        <nav className="mb-5 font-body text-xs text-muted md:mb-8 md:text-sm">
          <Link href="/#projects" className="transition-colors hover:text-accent-secondary">Projects</Link>
          <span className="mx-2">/</span>
          <span className="text-primary">{project.title}</span>
        </nav>
        {project.cover_image_url ? (
          <div className="-mx-5 overflow-hidden sm:-mx-6 md:mx-0 md:rounded-xl">
            <img
              src={project.cover_image_url}
              alt={project.title}
              className="w-full object-cover md:h-[67.5rem]"
            />
          </div>
        ) : (
          <div className="-mx-5 flex h-40 items-center justify-center sm:-mx-6 sm:h-48 md:mx-0 md:rounded-xl bg-surface-muted">
            <span className="font-heading text-5xl text-muted md:text-6xl">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6 md:px-8 lg:px-6 pt-6 pb-8 sm:pt-8 sm:pb-10 md:pt-12 md:pb-16">

        <div className="mb-3 md:mb-6">
          {project.project_type && (
            <p className="font-body text-[10px] text-muted uppercase tracking-wider sm:text-xs">
              {project.project_type}
            </p>
          )}
          <h1 className="mt-1.5 font-heading text-xl uppercase text-primary sm:text-2xl md:mt-2 md:text-4xl lg:text-5xl">
            {renderTextWithAmpersand(project.title)}
          </h1>
        </div>

        {project.short_description && (
          <p className="mb-8 text-xs italic leading-relaxed text-secondary sm:mb-10 sm:text-sm md:mb-12 md:text-lg">
            {project.short_description}
          </p>
        )}

        <div className="grid gap-8 sm:gap-10 md:grid-cols-3">
          <aside className="md:col-span-1">
            <div className="space-y-6 sm:space-y-8 md:sticky md:top-24">
              {project.role && (
                <div>
                  <h3 className="font-body text-[10px] text-muted uppercase tracking-wider sm:text-xs">
                    Role
                  </h3>
                    <p className="mt-1 font-body text-[11px] text-primary sm:text-xs">
                    {project.role}
                  </p>
                </div>
              )}

              {project.client_name && (
                <div>
                  <h3 className="font-body text-[10px] text-muted uppercase tracking-wider sm:text-xs">
                    Client
                  </h3>
                  <p className="mt-1 font-body text-[11px] text-primary sm:text-xs">
                    {project.client_name}
                  </p>
                </div>
              )}

              {dateRange && (
                <div>
                  <h3 className="font-body text-[10px] text-muted uppercase tracking-wider sm:text-xs">
                    Date
                  </h3>
                  <p className="mt-1 font-body text-[11px] text-primary sm:text-xs">
                    {dateRange}
                  </p>
                </div>
              )}

              {tools.length > 0 && (
                <div>
                  <h3 className="font-body text-[10px] text-muted uppercase tracking-wider sm:text-xs">
                    Tools Used
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-2">
                    {tools.map((tool) => (
                      <span
                        key={tool.id}
                        className="inline-flex items-center gap-1.5 rounded-full bg-accent-tertiary/10 px-2 py-0.5 font-body text-[10px] text-accent-tertiary sm:px-3 sm:py-1 sm:text-xs"
                      >
                        {tool.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {sortedCtas.length > 0 && (
                <div className="flex flex-col gap-2">
                    {sortedCtas.map((cta) => (
                      <a
                        key={cta.id}
                        href={cta.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-body text-sm text-background transition-opacity hover:opacity-90 sm:px-6 sm:py-3 md:text-base"
                      >
                        {cta.label}
                      </a>
                    ))}
                </div>
              )}
            </div>
          </aside>

          <div className="md:col-span-2 md:col-start-2">
            {project.content_md && (
              <div
                className="prose prose-neutral prose-xs mt-6 max-w-none dark:prose-invert sm:mt-8 md:prose-base prose-p:text-[13px] md:prose-p:text-base prose-headings:font-heading prose-headings:text-primary prose-p:text-secondary prose-p:leading-relaxed prose-a:text-accent-secondary prose-a:no-underline hover:prose-a:underline prose-strong:text-primary prose-code:text-accent-tertiary prose-li:text-secondary"
                dangerouslySetInnerHTML={{ __html: project.content_md }}
              />
            )}

            {sortedMedia.length > 0 && (
              <div className="mt-10 space-y-6 sm:mt-12 sm:space-y-8">
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
                      <figcaption className="mt-2 text-center text-xs text-muted sm:mt-3 sm:text-sm">
                        {media.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            )}

            {sortedCtas.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-3 sm:mt-12 sm:gap-4 md:hidden">
                {sortedCtas.map((cta) => (
                  <a
                    key={cta.id}
                    href={cta.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-body text-sm text-background transition-opacity hover:opacity-90 sm:px-6 sm:py-3"
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
