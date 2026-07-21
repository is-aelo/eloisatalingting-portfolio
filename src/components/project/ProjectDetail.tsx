"use client";

import { useState } from "react";
import Link from "next/link";
import type { ProjectRow, ProjectMediaRow, ProjectCTARow, ToolRow } from "@/types/database";
import { renderTextWithAmpersand } from "@/lib/text";
import { ZoomViewer } from "@/components/ui/ZoomViewer";

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
  const [zoomImage, setZoomImage] = useState<{ src: string; alt: string; isVideo: boolean } | null>(null);

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "IMG") {
      const img = target as HTMLImageElement;
      setZoomImage({
        src: img.src,
        alt: img.alt || project.title,
        isVideo: false,
      });
    }
  };

  const startDate = formatDate(project.start_date);
  const endDate = project.end_date ? formatDate(project.end_date) : "Present";
  const dateRange = startDate && endDate ? `${startDate} — ${endDate}` : startDate ?? endDate ?? null;

  const sortedMedia = [...project.project_media].sort((a, b) => a.sort_order - b.sort_order);
  const sortedCtas = [...project.project_ctas].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <article>
      {/* Breadcrumb */}
      <div className="mx-auto w-full max-w-5xl px-5 sm:px-6 md:px-8 lg:px-6 pt-6 sm:pt-8 md:pt-10">
        <nav className="font-body text-xs text-primary md:text-sm">
          <Link href="/#projects" className="transition-colors hover:text-accent-secondary">
            Projects
          </Link>
          <span className="mx-2 text-border">/</span>
          <span className="text-secondary">{project.title}</span>
        </nav>
      </div>

      {/* Cover Image */}
      <div className="mx-auto w-full max-w-5xl px-5 sm:px-6 md:px-8 lg:px-6 mt-5 sm:mt-6 md:mt-8">
        {(project.cover_image_url || project.thumbnail_url) ? (
          <div
            className="overflow-hidden rounded-xl border border-border cursor-zoom-in"
            onClick={() =>
              setZoomImage({
                src: project.cover_image_url || project.thumbnail_url || "",
                alt: project.title,
                isVideo: false,
              })
            }
          >
            <img
              src={project.cover_image_url || project.thumbnail_url || undefined}
              alt={project.title}
              className="w-full object-cover md:h-[40rem]"
            />
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center rounded-xl border border-border bg-surface-muted sm:h-64 md:h-80">
            <span className="font-heading text-6xl text-muted/30 md:text-8xl">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Title & Meta */}
      <div className="mx-auto w-full max-w-5xl px-5 sm:px-6 md:px-8 lg:px-6 mt-8 sm:mt-10 md:mt-14">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <div className="flex-1">
            {project.project_type && (
              <span className="inline-block font-body text-[10px] text-accent-secondary uppercase tracking-widest sm:text-xs">
                {project.project_type}
              </span>
            )}
            <h1 className="mt-2 font-heading font-bold text-xl uppercase tracking-tight text-primary sm:text-2xl md:text-3xl lg:text-4xl">
              {renderTextWithAmpersand(project.title)}
            </h1>
            {project.short_description && (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-secondary sm:mt-4 sm:text-base md:text-lg">
                {project.short_description}
              </p>
            )}

            {/* Inline meta */}
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-primary sm:mt-5 sm:gap-x-4 sm:text-sm">
              {project.role && <span>{project.role}</span>}
              {project.role && project.client_name && <span className="text-border">|</span>}
              {project.client_name && <span>{project.client_name}</span>}
              {(project.role || project.client_name) && dateRange && <span className="text-border">|</span>}
              {dateRange && <span>{dateRange}</span>}
            </div>

            {/* GitHub link */}
            {project.github_url && (
              <div className="mt-4">
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex cursor-pointer items-center gap-2 font-body text-xs text-accent-secondary transition-colors hover:underline sm:text-sm"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  View on GitHub
                </a>
              </div>
            )}

            {/* Top CTAs */}
            {sortedCtas.length > 0 && (
              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4">
                {sortedCtas.map((cta) => (
                  <a
                    key={cta.id}
                    href={cta.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-accent-secondary px-6 py-3 font-body text-sm text-white transition-all hover:opacity-90 hover:shadow-lg sm:w-auto sm:px-8 sm:py-3.5 sm:text-base"
                  >
                    {cta.label}
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tools */}
        {tools.length > 0 && (
          <div className="mt-8 border-t border-border pt-8 sm:mt-10 sm:pt-10">
            <h3 className="font-body text-[10px] text-primary uppercase tracking-wider sm:text-xs">
              Tools Used
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {tools.map((tool) => (
                <span
                  key={tool.id}
                  className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 font-body text-xs text-secondary transition-colors hover:border-accent-secondary/30 hover:text-accent-secondary sm:px-4 sm:py-1.5 sm:text-sm"
                >
                  {tool.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-3xl px-5 sm:px-6 md:px-8 lg:px-6 mt-10 sm:mt-14 md:mt-16">
        {project.content_md && (
          <div
            className="prose prose-neutral dark:prose-invert prose-p:text-primary prose-p:text-xs prose-p:leading-relaxed sm:prose-p:text-sm md:prose-p:text-sm prose-headings:font-heading prose-headings:text-primary prose-headings:tracking-tight prose-a:text-accent-secondary prose-a:no-underline hover:prose-a:underline prose-strong:text-primary prose-code:text-accent-tertiary prose-code:text-xs prose-code:font-body prose-li:text-primary prose-img:rounded-xl prose-img:border prose-img:border-border prose-video:rounded-xl prose-video:border prose-video:border-border [&_img]:cursor-zoom-in"
            dangerouslySetInnerHTML={{ __html: project.content_md }}
            onClick={handleContentClick}
          />
        )}

        {/* Media Gallery */}
        {sortedMedia.length > 0 && (
          <div className="mt-12 space-y-8 sm:mt-16 sm:space-y-10">
            {sortedMedia.map((media) => (
              <figure key={media.id} className="group">
                {media.media_type === "image" || media.media_type === "gif" ? (
                  <div
                    className="overflow-hidden rounded-xl border border-border cursor-zoom-in"
                    onClick={() =>
                      setZoomImage({
                        src: media.media_url,
                        alt: media.alt_text ?? "",
                        isVideo: false,
                      })
                    }
                  >
                    <img
                      src={media.media_url}
                      alt={media.alt_text ?? ""}
                      className="w-full transition-transform duration-500 group-hover:scale-[1.01]"
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full overflow-hidden rounded-xl border border-border">
                    <iframe
                      src={media.media_url}
                      title={media.alt_text ?? ""}
                      className="h-full w-full"
                      allowFullScreen
                    />
                  </div>
                )}
                {media.caption && (
                  <figcaption className="mt-3 text-center text-xs text-primary sm:text-sm">
                    {media.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}

        {/* Bottom CTAs - full width */}
        {sortedCtas.length > 0 && (
          <div className="mt-12 flex flex-col gap-3 sm:mt-16">
            {sortedCtas.map((cta) => (
              <a
                key={cta.id}
                href={cta.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-accent-secondary px-6 py-4 font-body text-sm text-white transition-all hover:opacity-90 hover:shadow-lg sm:text-base"
              >
                {cta.label}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            ))}
          </div>
        )}
      </div>

      {zoomImage && (
        <ZoomViewer
          src={zoomImage.src}
          alt={zoomImage.alt}
          isVideo={zoomImage.isVideo}
          onClose={() => setZoomImage(null)}
        />
      )}
    </article>
  );
}
