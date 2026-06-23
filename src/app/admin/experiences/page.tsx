"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { InputField, TextareaField, ToggleField } from "@/components/admin/AdminFormField";
import { useToast } from "@/components/ui/Toast";
import { LuPlus, LuTrash2, LuPencil } from "react-icons/lu";

export default function AdminExperiences() {
  const supabase = createClient();
  const { toast } = useToast();
  const [experiences, setExperiences] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [tasks, setTasks] = useState<string[]>([]);

  const load = async () => {
    const { data } = await supabase.from("experiences").select("*").order("sort_order", { ascending: true });
    if (data) setExperiences(data);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing({ company_name: "", role_title: "", start_date: "", end_date: "", currently_working: false, company_url: "", summary: "" });
    setTasks([]);
  };

  const openEdit = (exp: any) => {
    setEditing(exp);
    supabase.from("experience_tasks").select("*").eq("experience_id", exp.id).order("sort_order").then(({ data }) => {
      setTasks(data?.map((t) => t.task) ?? []);
    });
  };

  const save = async () => {
    if (!editing) return;
    try {
      if (editing.id) {
        const { error } = await supabase.from("experiences").update(editing).eq("id", editing.id);
        if (error) throw error;
        await supabase.from("experience_tasks").delete().eq("experience_id", editing.id);
      } else {
        const { data, error } = await supabase.from("experiences").insert(editing).select().single();
        if (error) throw error;
        if (data) editing.id = data.id;
      }
      for (let i = 0; i < tasks.length; i++) {
        const { error } = await supabase.from("experience_tasks").insert({ experience_id: editing.id, task: tasks[i], sort_order: i });
        if (error) throw error;
      }
      toast("Experience saved");
      setEditing(null);
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to save", "error");
    }
  };

  const remove = async (id: string) => {
    try {
      const { error: tasksErr } = await supabase.from("experience_tasks").delete().eq("experience_id", id);
      if (tasksErr) throw tasksErr;
      const { error } = await supabase.from("experiences").delete().eq("id", id);
      if (error) throw error;
      toast("Experience deleted");
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to delete", "error");
    }
  };

  if (editing) {
    return (
      <div>
        <h1 className="font-heading text-3xl text-primary">{editing.id ? "Edit Experience" : "New Experience"}</h1>
        <div className="mt-6 flex flex-col gap-4 max-w-2xl">
          <InputField label="Company" value={editing.company_name} onChange={(e) => setEditing({ ...editing, company_name: e.target.value })} />
          <InputField label="Role" value={editing.role_title} onChange={(e) => setEditing({ ...editing, role_title: e.target.value })} />
          <InputField label="Start Date" type="date" value={editing.start_date} onChange={(e) => setEditing({ ...editing, start_date: e.target.value })} />
          <InputField label="End Date" type="date" value={editing.end_date ?? ""} disabled={editing.currently_working} onChange={(e) => setEditing({ ...editing, end_date: e.target.value })} />
          <ToggleField label="Currently working here" checked={editing.currently_working} onChange={(v) => setEditing({ ...editing, currently_working: v, end_date: v ? null : editing.end_date })} />
          <InputField label="Company URL" value={editing.company_url ?? ""} onChange={(e) => setEditing({ ...editing, company_url: e.target.value })} />
          <TextareaField label="Summary" value={editing.summary ?? ""} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} />
          <div>
            <p className="text-sm text-secondary">Key Tasks</p>
            {tasks.map((t, i) => (
              <div key={i} className="mt-2 flex gap-2">
                <input value={t} onChange={(e) => { const t2 = [...tasks]; t2[i] = e.target.value; setTasks(t2); }} className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-primary focus:border-accent-secondary focus:outline-none" />
                <button onClick={() => setTasks(tasks.filter((_, j) => j !== i))} className="cursor-pointer text-muted hover:text-danger"><LuTrash2 size={18} /></button>
              </div>
            ))}
            <button onClick={() => setTasks([...tasks, ""])} className="mt-2 cursor-pointer text-sm text-accent-secondary hover:underline">+ Add task</button>
          </div>
          <div className="flex gap-3">
            <button onClick={save} className="cursor-pointer rounded-lg bg-accent px-6 py-3 font-body text-background transition-opacity hover:opacity-90">Save</button>
            <button onClick={() => setEditing(null)} className="cursor-pointer rounded-lg border border-border px-6 py-3 font-body text-secondary transition-colors hover:bg-surface-muted">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl text-primary">Experience</h1>
        <button onClick={openNew} className="flex cursor-pointer items-center gap-2 rounded-lg bg-accent px-4 py-2 font-body text-background transition-opacity hover:opacity-90"><LuPlus size={18} /> Add</button>
      </div>
      <div className="mt-6 flex flex-col gap-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="flex items-center justify-between rounded-xl border border-border bg-surface p-6">
            <div>
              <h2 className="font-heading text-lg text-primary">{exp.role_title}</h2>
              <p className="text-sm text-secondary">{exp.company_name} · {exp.start_date} - {exp.currently_working ? "Present" : exp.end_date}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(exp)} className="cursor-pointer rounded-lg p-2 text-secondary hover:bg-surface-muted"><LuPencil size={18} /></button>
              <button onClick={() => remove(exp.id)} className="cursor-pointer rounded-lg p-2 text-secondary hover:bg-surface-muted hover:text-danger"><LuTrash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
