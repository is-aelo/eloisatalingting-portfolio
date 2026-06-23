"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { InputField, TextareaField, ToggleField } from "@/components/admin/AdminFormField";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { EditorShell } from "@/components/admin/EditorShell";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { useToast } from "@/components/ui/Toast";

type ProjectFormProps = {
  projectId?: string;
};

export function ProjectForm({ projectId }: ProjectFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();
  const [tools, setTools] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    slug: "",
    title: "",
    short_description: "",
    client_name: "",
    project_type: "",
    role: "",
    start_date: "",
    end_date: "",
    featured: false,
    display: true,
    thumbnail_url: "",
    cover_image_url: "",
    tech_stack_summary: "",
    content_md: "",
  });
  const [media, setMedia] = useState<any[]>([]);
  const [ctas, setCtas] = useState<any[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  useEffect(() => {
    supabase.from("tools").select("*").order("name").then(({ data: t }) => {
      if (t) setTools(t);
    });
    if (projectId) {
      supabase.from("projects").select("*").eq("id", projectId).single().then(({ data: p }) => {
        if (p) setData(p);
      });
      supabase.from("project_media").select("*").eq("project_id", projectId).order("sort_order").then(({ data: m }) => {
        if (m) setMedia(m);
      });
      supabase.from("project_ctas").select("*").eq("project_id", projectId).order("sort_order").then(({ data: c }) => {
        if (c) setCtas(c);
      });
      supabase.from("project_tools").select("tool_id").eq("project_id", projectId).then(({ data: t }) => {
        if (t) setSelectedTools(t.map((r) => r.tool_id));
      });
    }
  }, [projectId]);

  const saveFields = [
    "slug", "title", "short_description", "client_name", "project_type",
    "role", "start_date", "end_date", "featured", "display",
    "thumbnail_url", "cover_image_url", "tech_stack_summary", "content_md",
  ];

  const savePayload = saveFields.reduce((acc, field) => {
    (acc as Record<string, unknown>)[field] = (data as Record<string, unknown>)[field];
    return acc;
  }, {} as Partial<typeof data>);

  const save = async () => {
    setSaving(true);
    try {
      let id = projectId;

      if (id) {
        const { error } = await supabase.from("projects").update(savePayload).eq("id", id);
        if (error) throw error;
      } else {
        const { data: inserted, error } = await supabase.from("projects").insert(savePayload).select().single();
        if (error) throw error;
        if (inserted) id = inserted.id;
      }

      if (id) {
        const { error: meErr } = await supabase.from("project_media").delete().eq("project_id", id);
        if (meErr) throw meErr;
        for (let i = 0; i < media.length; i++) {
          const { error } = await supabase.from("project_media").insert({ ...media[i], project_id: id, sort_order: i });
          if (error) throw error;
        }

        const { error: ctErr } = await supabase.from("project_ctas").delete().eq("project_id", id);
        if (ctErr) throw ctErr;
        for (let i = 0; i < ctas.length; i++) {
          const { error } = await supabase.from("project_ctas").insert({ ...ctas[i], project_id: id, sort_order: i });
          if (error) throw error;
        }

        const { error: tlErr } = await supabase.from("project_tools").delete().eq("project_id", id);
        if (tlErr) throw tlErr;
        for (const toolId of selectedTools) {
          const { error } = await supabase.from("project_tools").insert({ project_id: id, tool_id: toolId });
          if (error) throw error;
        }
      }

      toast(projectId ? "Project saved" : "Project created");
      router.push("/admin/projects");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to save", "error");
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="font-heading text-3xl text-primary">{projectId ? "Edit Project" : "New Project"}</h1>
      <div className="mt-6 flex flex-col gap-4 max-w-3xl">
        <InputField label="Title" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
        <InputField label="Slug" value={data.slug} onChange={(e) => setData({ ...data, slug: e.target.value })} placeholder="my-project-name" />
        <TextareaField label="Short Description" value={data.short_description ?? ""} onChange={(e) => setData({ ...data, short_description: e.target.value })} />
        <InputField label="Client Name" value={data.client_name ?? ""} onChange={(e) => setData({ ...data, client_name: e.target.value })} />
        <InputField label="Project Type" value={data.project_type ?? ""} onChange={(e) => setData({ ...data, project_type: e.target.value })} placeholder="Web App, Mobile, Branding..." />
        <InputField label="Role" value={data.role ?? ""} onChange={(e) => setData({ ...data, role: e.target.value })} placeholder="Product Designer, Frontend Dev..." />
        <div className="flex gap-4">
          <InputField label="Start Date" type="date" value={data.start_date ?? ""} onChange={(e) => setData({ ...data, start_date: e.target.value })} />
          <InputField label="End Date" type="date" value={data.end_date ?? ""} onChange={(e) => setData({ ...data, end_date: e.target.value })} />
        </div>
        <InputField label="Tech Stack Summary" value={data.tech_stack_summary ?? ""} onChange={(e) => setData({ ...data, tech_stack_summary: e.target.value })} placeholder="React, TypeScript, Tailwind..." />
        <div className="flex gap-6">
          <ToggleField label="Featured" checked={data.featured} onChange={(v) => setData({ ...data, featured: v })} />
          <ToggleField label="Display on site" checked={data.display} onChange={(v) => setData({ ...data, display: v })} />
        </div>
        <div>
          <p className="text-sm text-secondary">Thumbnail</p>
          <ImageUploader currentUrl={data.thumbnail_url} onUpload={(url) => setData({ ...data, thumbnail_url: url })} />
        </div>
        <div>
          <p className="text-sm text-secondary">Cover Image</p>
          <ImageUploader currentUrl={data.cover_image_url} onUpload={(url) => setData({ ...data, cover_image_url: url })} />
        </div>

        <div>
          <p className="mb-2 text-sm text-secondary">Content</p>
          <EditorShell content={data.content_md ?? ""} onChange={(html) => setData({ ...data, content_md: html })} placeholder="Write the case study content..." />
        </div>

        <div>
          <p className="text-sm text-secondary">Project Media</p>
          {media.map((m, i) => (
            <div key={i} className="mt-3 flex flex-wrap items-start gap-3 rounded-lg border border-border bg-surface p-3">
              <ImageUploader
                currentUrl={m.media_url}
                onUpload={(url) => {
                  const m2 = [...media];
                  m2[i] = { ...m2[i], media_url: url };
                  setMedia(m2);
                }}
              />
              <div className="flex flex-1 flex-col gap-2 min-w-[200px]">
                <input
                  value={m.alt_text ?? ""}
                  onChange={(e) => {
                    const m2 = [...media];
                    m2[i] = { ...m2[i], alt_text: e.target.value };
                    setMedia(m2);
                  }}
                  placeholder="Alt text"
                  className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-primary focus:border-accent-secondary focus:outline-none"
                />
                <button
                  onClick={() => setMedia(media.filter((_, j) => j !== i))}
                  className="self-start cursor-pointer text-sm text-muted hover:text-danger"
                >
                  <LuTrash2 size={16} className="inline" /> Remove
                </button>
              </div>
            </div>
          ))}
          <button onClick={() => setMedia([...media, { media_type: "image", media_url: "", alt_text: "", caption: "" }])} className="mt-3 cursor-pointer text-sm text-accent-secondary hover:underline"><LuPlus size={14} className="inline" /> Add media</button>
        </div>

        <div>
          <p className="text-sm text-secondary">CTA Buttons</p>
          {ctas.map((c, i) => (
            <div key={i} className="mt-2 flex gap-2">
              <input value={c.label} onChange={(e) => { const c2 = [...ctas]; c2[i] = { ...c2[i], label: e.target.value }; setCtas(c2); }} placeholder="Label" className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-primary focus:border-accent-secondary focus:outline-none" />
              <input value={c.url} onChange={(e) => { const c2 = [...ctas]; c2[i] = { ...c2[i], url: e.target.value }; setCtas(c2); }} placeholder="URL" className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-primary focus:border-accent-secondary focus:outline-none" />
              <button onClick={() => setCtas(ctas.filter((_, j) => j !== i))} className="cursor-pointer text-muted hover:text-danger"><LuTrash2 size={18} /></button>
            </div>
          ))}
          <button onClick={() => setCtas([...ctas, { label: "", url: "" }])} className="mt-2 cursor-pointer text-sm text-accent-secondary hover:underline"><LuPlus size={14} className="inline" /> Add CTA</button>
        </div>

        <div>
          <p className="text-sm text-secondary">Tools Used</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {tools.map((tool) => (
              <label key={tool.id} className={`cursor-pointer rounded-full border px-3 py-1 text-sm transition-colors ${selectedTools.includes(tool.id) ? "border-accent-secondary bg-accent-secondary/10 text-accent-secondary" : "border-border text-secondary hover:border-accent-secondary/50"}`}>
                <input type="checkbox" checked={selectedTools.includes(tool.id)} onChange={() => setSelectedTools((prev) => prev.includes(tool.id) ? prev.filter((id) => id !== tool.id) : [...prev, tool.id])} className="hidden" />
                {tool.name}
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pb-12">
          <button onClick={save} disabled={saving} className="cursor-pointer rounded-lg bg-accent px-6 py-3 font-body text-background transition-opacity hover:opacity-90 disabled:opacity-50">
            {saving ? "Saving..." : "Save Project"}
          </button>
        </div>
      </div>
    </div>
  );
}
