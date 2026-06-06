"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { LuPlus, LuPencil, LuTrash2 } from "react-icons/lu";
import { useToast } from "@/components/ui/Toast";

export default function AdminProjects() {
  const supabase = createClient();
  const { toast } = useToast();
  const [projects, setProjects] = useState<any[]>([]);

  const load = async () => {
    const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    if (data) setProjects(data);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    try {
      const { error: ctaErr } = await supabase.from("project_ctas").delete().eq("project_id", id);
      if (ctaErr) throw ctaErr;
      const { error: meErr } = await supabase.from("project_media").delete().eq("project_id", id);
      if (meErr) throw meErr;
      const { error: tlErr } = await supabase.from("project_tools").delete().eq("project_id", id);
      if (tlErr) throw tlErr;
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      toast("Project deleted");
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to delete", "error");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl text-primary">Projects</h1>
        <Link href="/admin/projects/new" className="flex cursor-pointer items-center gap-2 rounded-lg bg-accent px-4 py-2 font-body text-background transition-opacity hover:opacity-90"><LuPlus size={18} /> New Project</Link>
      </div>
      <div className="mt-6 flex flex-col gap-4">
        {projects.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-xl border border-border bg-surface p-6">
            <div className="flex items-center gap-4">
              {p.thumbnail_url && <img src={p.thumbnail_url} alt="" className="h-14 w-20 rounded-lg object-cover" />}
              <div>
                <h2 className="font-heading text-lg text-primary">{p.title}</h2>
                <p className="text-sm text-muted">/{p.slug} {p.featured && "· Featured"} {!p.display && "· Hidden"}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/projects/${p.id}`} className="cursor-pointer rounded-lg p-2 text-secondary hover:bg-surface-muted"><LuPencil size={18} /></Link>
              <button onClick={() => remove(p.id)} className="cursor-pointer rounded-lg p-2 text-secondary hover:bg-surface-muted hover:text-red-500"><LuTrash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
