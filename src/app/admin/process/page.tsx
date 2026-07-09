"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { InputField, TextareaField } from "@/components/admin/AdminFormField";
import { useToast } from "@/components/ui/Toast";
import { LuPlus, LuTrash2, LuPencil } from "react-icons/lu";
import type { ProcessStepRow } from "@/types/database";

export default function AdminProcess() {
  const supabase = createClient();
  const { toast } = useToast();
  const [items, setItems] = useState<ProcessStepRow[]>([]);
  const [editing, setEditing] = useState<Partial<ProcessStepRow> | null>(null);

  const load = async () => {
    const { data } = await supabase.from("process_steps").select("*").order("sort_order", { ascending: true });
    if (data) setItems(data);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing({ step_number: items.length + 1, title: "", description: "" });
  };

  const openEdit = (item: ProcessStepRow) => {
    setEditing({ ...item });
  };

  const save = async () => {
    if (!editing) return;
    try {
      const payload = {
        step_number: editing.step_number ?? items.length + 1,
        title: editing.title ?? "",
        description: editing.description ?? "",
        sort_order: editing.sort_order ?? items.length,
      };
      if (editing.id) {
        const { error } = await supabase.from("process_steps").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("process_steps").insert(payload);
        if (error) throw error;
      }
      toast("Process step saved");
      setEditing(null);
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : JSON.stringify(err), "error");
    }
  };

  const remove = async (id: string) => {
    try {
      const { error } = await supabase.from("process_steps").delete().eq("id", id);
      if (error) throw error;
      toast("Process step deleted");
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : JSON.stringify(err), "error");
    }
  };

  if (editing) {
    return (
      <div>
        <h1 className="font-heading text-3xl text-primary">{editing.id ? "Edit Process Step" : "New Process Step"}</h1>
        <div className="mt-6 flex flex-col gap-4 max-w-2xl">
          <InputField label="Step Number" type="number" value={String(editing.step_number ?? "")} onChange={(e) => setEditing({ ...editing, step_number: parseInt(e.target.value) || 0 })} />
          <InputField label="Title" value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
          <TextareaField label="Description" value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
          <InputField label="Sort Order" type="number" value={String(editing.sort_order ?? "")} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} />
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
        <h1 className="font-heading text-3xl text-primary">Process</h1>
        <button onClick={openNew} className="flex cursor-pointer items-center gap-2 rounded-lg bg-accent px-4 py-2 font-body text-background transition-opacity hover:opacity-90"><LuPlus size={18} /> Add</button>
      </div>
      <div className="mt-6 flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-xl border border-border bg-surface p-6">
            <div>
              <h2 className="font-heading text-lg text-primary">Step {item.step_number}: {item.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-secondary">{item.description}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(item)} className="cursor-pointer rounded-lg p-2 text-secondary hover:bg-surface-muted"><LuPencil size={18} /></button>
              <button onClick={() => remove(item.id)} className="cursor-pointer rounded-lg p-2 text-secondary hover:bg-surface-muted hover:text-danger"><LuTrash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
