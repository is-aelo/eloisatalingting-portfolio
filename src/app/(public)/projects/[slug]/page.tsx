import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDateLong, formatDateRange } from "@/lib/dates";
import { LuArrowLeft } from "react-icons/lu";

export const dynamic = "force-dynamic";

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!project) notFound();

  const [{ data: tools }, { data: media }, { data: ctas }] = await Promise.all([
    supabase.from("project_tools").select("tool_id, tools(name)").eq("project_id", project.id),
    supabase.from("project_media").select("*").eq("project_id", project.id).order("sort_order", { ascending: true }),
    supabase.from("project_ctas").select("*").eq("project_id", project.id).order("sort_order", { ascending: true }),
  ]);

  const toolNames = tools?.map((t: any) => t.tools?.name).filter(Boolean) ?? [];

  return (
    <article>
      {project.cover_image_url && (
        <div className="relative h-[40vh] overflow-hidden md:h-[60vh]">
          <img src={project.cover_image_url} alt={project.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>
      )}

      <div className="mx-auto max-w-3xl px-6 pb-16 md:pb-24">
        <Link href="/" className="mt-8 inline-flex cursor-pointer items-center gap-1 font-body text-sm text-secondary transition-colors hover:text-accent-secondary">
          <LuArrowLeft size={16} /> Back to home
        </Link>

        <div className="mt-8 space-y-2">
          {project.project_type && (
            <span className="font-body text-xs text-muted uppercase tracking-wider">{project.project_type}</span>
          )}
          <h1 className="font-heading text-3xl text-primary md:text-4xl lg:text-5xl">{project.title}</h1>
        </div>

        {(project.short_description || project.client_name || project.role || project.start_date) && (
          <div className="mt-8 grid gap-4 border-y border-border py-6 sm:grid-cols-3">
            {project.client_name && (
              <div>
                <p className="font-body text-xs text-muted uppercase tracking-wider">Client</p>
                <p className="mt-1 text-sm text-primary">{project.client_name}</p>
              </div>
            )}
            {project.role && (
              <div>
                <p className="font-body text-xs text-muted uppercase tracking-wider">Role</p>
                <p className="mt-1 text-sm text-primary">{project.role}</p>
              </div>
            )}
            {project.start_date && (
              <div>
                <p className="font-body text-xs text-muted uppercase tracking-wider">Timeline</p>
                <p className="mt-1 text-sm text-primary">
                  {project.end_date ? formatDateRange(project.start_date, project.end_date) : formatDateLong(project.start_date)}
                </p>
              </div>
            )}
          </div>
        )}

        {toolNames.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {toolNames.map((name: string) => (
              <span key={name} className="rounded-full bg-surface-muted px-3 py-1 text-xs text-muted">{name}</span>
            ))}
          </div>
        )}

        {project.content_md && (
          <div
            className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-headings:font-heading prose-headings:text-primary prose-p:text-secondary prose-a:text-accent-secondary prose-a:no-underline hover:prose-a:underline prose-strong:text-primary prose-code:text-accent-secondary prose-code:bg-surface-muted prose-code:px-1 prose-code:rounded prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: project.content_md }}
          />
        )}

        {media && media.length > 0 && (
          <div className="mt-12 space-y-6">
            {media.map((m: any) => (
              <div key={m.id} className="overflow-hidden rounded-xl bg-surface-muted">
                {m.media_type === "image" && (
                  <img src={m.media_url} alt={m.alt_text ?? ""} className="w-full" />
                )}
                {m.media_type === "video" && (
                  <video src={m.media_url} controls className="w-full" />
                )}
                {(m.media_type === "youtube" || m.media_type === "vimeo") && (
                  <div className="aspect-video">
                    <iframe src={m.media_url} className="h-full w-full" allowFullScreen />
                  </div>
                )}
                {m.caption && (
                  <p className="px-4 pb-4 pt-2 text-sm text-muted">{m.caption}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {ctas && ctas.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-4">
            {ctas.map((cta: any) => (
              <a
                key={cta.id}
                href={cta.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-accent px-6 py-3 font-body text-background transition-opacity hover:opacity-90"
              >
                {cta.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
