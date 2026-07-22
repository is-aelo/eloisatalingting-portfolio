"use client";

import { useState } from "react";
import Link from "next/link";
import { LuArrowUpRight } from "react-icons/lu";
import { SiGithub } from "react-icons/si";
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

const inner = "mx-auto w-full max-w-5xl px-3 sm:px-6 lg:px-8";

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

  const dateDisplay = project.end_date ? formatDate(project.end_date) : "Present";

  const sortedMedia = [...project.project_media].sort((a, b) => a.sort_order - b.sort_order);
  const sortedCtas = [...project.project_ctas].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <article>
      {/* Breadcrumb */}
        <div className={`${inner} pt-4 sm:pt-6`}>
        <nav className="font-body text-xs text-primary sm:text-sm">
          <Link href="/#projects" className="transition-colors hover:text-accent">
            Projects
          </Link>
          <span className="mx-2 text-border">/</span>
          <span className="text-secondary">{project.title}</span>
        </nav>
      </div>

      {/* Cover Image */}
      <div className={`${inner} mt-3 sm:mt-4`}>
        <div className="border border-border">
          {(project.cover_image_url || project.thumbnail_url) ? (
            <div
              className="cursor-zoom-in"
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
                className="w-full object-cover md:h-[32rem]"
              />
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center bg-surface-muted sm:h-64 md:h-80">
              <span className="font-heading text-6xl text-muted/30 md:text-8xl">
                {project.title.charAt(0)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Title & Meta */}
      <div className={`${inner} mt-4 sm:mt-6`}>
        {project.project_type && (
          <span className="inline-block font-body text-[10px] text-accent uppercase tracking-widest sm:text-xs">
            {project.project_type}
          </span>
        )}
        <h1 className="font-heading text-lg uppercase tracking-tight text-primary sm:text-xl">
          {renderTextWithAmpersand(project.title)}
        </h1>
        {project.short_description && (
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-secondary">
            {project.short_description}
          </p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-primary">
          {project.role && <span>{project.role}</span>}
          {project.role && project.client_name && <span className="text-border">|</span>}
          {project.client_name && <span>{project.client_name}</span>}
              {(project.role || project.client_name) && dateDisplay && <span className="text-border">|</span>}
              {dateDisplay && <span>{dateDisplay}</span>}
        </div>

        {project.github_url && (
          <div className="mt-2">
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex cursor-pointer items-center gap-2 font-body text-xs text-secondary transition-colors hover:text-accent sm:text-sm"
            >
              <SiGithub size={14} />
              View on GitHub
            </a>
          </div>
        )}

        {sortedCtas.length > 0 && (
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:gap-3">
            {sortedCtas.map((cta) => (
              <a
                key={cta.id}
                href={cta.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex cursor-pointer items-center justify-center gap-2 border border-accent bg-accent px-4 py-2 font-body text-xs text-background uppercase tracking-wider transition-opacity hover:opacity-90 sm:px-6 sm:text-sm"
              >
                {cta.label}
                <LuArrowUpRight size={14} />
              </a>
            ))}
          </div>
        )}

        {tools.length > 0 && (
          <div className="mt-4 border-t border-border pt-4">
            <h3 className="font-body text-[10px] text-primary uppercase tracking-wider sm:text-xs">
              Tools Used
            </h3>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {tools.map((tool) => (
                <span
                  key={tool.id}
                  className="inline-flex items-center border border-border bg-surface px-2.5 py-0.5 font-body text-xs text-secondary sm:px-3 sm:py-1"
                >
                  {tool.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-3xl px-3 sm:px-6 lg:px-8 mt-4 sm:mt-6">
        {project.content_md && (
          <div
            className="prose prose-neutral dark:prose-invert prose-p:text-primary prose-p:text-xs prose-p:leading-relaxed sm:prose-p:text-sm prose-headings:font-heading prose-headings:text-primary prose-headings:tracking-tight prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-strong:text-primary prose-code:bg-primary/10 prose-code:px-1 prose-code:text-accent prose-code:text-xs prose-code:font-mono prose-li:text-primary prose-img:border prose-img:border-border prose-video:border prose-video:border-border prose-pre:border prose-pre:border-border prose-pre:bg-primary prose-pre:text-background prose-pre:text-xs prose-pre:font-mono prose-pre:leading-relaxed prose-pre:p-3 sm:prose-pre:p-4 [&_pre_code]:text-inherit [&_pre_code]:bg-transparent [&_pre_code]:px-0 [&_img]:cursor-zoom-in max-w-none"
            dangerouslySetInnerHTML={{ __html: project.content_md }}
            onClick={handleContentClick}
          />
        )}

        {sortedMedia.length > 0 && (
          <div className="mt-6 space-y-4 sm:mt-8 sm:space-y-6">
            {sortedMedia.map((media) => (
              <figure key={media.id}>
                {media.media_type === "image" || media.media_type === "gif" ? (
                  <div
                    className="cursor-zoom-in border border-border"
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
                      className="w-full"
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full border border-border">
                    <iframe
                      src={media.media_url}
                      title={media.alt_text ?? ""}
                      className="h-full w-full"
                      allowFullScreen
                    />
                  </div>
                )}
                {media.caption && (
                  <figcaption className="mt-2 text-center text-xs text-primary sm:text-sm">
                    {media.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}

        {sortedCtas.length > 0 && (
          <div className="mt-6 flex flex-col gap-2 sm:mt-8">
            {sortedCtas.map((cta) => (
              <a
                key={cta.id}
                href={cta.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full cursor-pointer items-center justify-center gap-2 border border-accent bg-accent px-4 py-3 font-body text-xs text-background uppercase tracking-wider transition-opacity hover:opacity-90 sm:py-3 sm:text-sm"
              >
                {cta.label}
                <LuArrowUpRight size={14} />
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