"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { InputField, TextareaField } from "@/components/admin/AdminFormField";
import { useToast } from "@/components/ui/Toast";
import { LuPlus, LuTrash2, LuPencil } from "react-icons/lu";
import type { EducationRow } from "@/types/database";

export default function AdminEducation() {
  const supabase = createClient();
  const { toast } = useToast();
  const [items, setItems] = useState<EducationRow[]>([]);
  const [editing, setEditing] = useState<Partial<EducationRow> | null>(null);

  const load = async () => {
    const { data } = await supabase.from("education").select("*").order("order_index", { ascending: true });
    if (data) setItems(data);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing({ institution: "", degree: "", field_of_study: "", start_date: "", end_date: null, gpa: "", description: "" });
  };

  const openEdit = (item: EducationRow) => {
    setEditing({ ...item });
  };

  const save = async () => {
    if (!editing) return;
    try {
      const payload = {
        institution: editing.institution,
        degree: editing.degree,
        field_of_study: editing.field_of_study || null,
        start_date: editing.start_date,
        end_date: editing.end_date || null,
        gpa: editing.gpa || null,
        description: editing.description || null,
      };
      if (editing.id) {
        const { error } = await supabase.from("education").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("education").insert({ ...payload, order_index: items.length });
        if (error) throw error;
      }
      toast("Education saved");
      setEditing(null);
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : JSON.stringify(err), "error");
    }
  };

  const remove = async (id: string) => {
    try {
      const { error } = await supabase.from("education").delete().eq("id", id);
      if (error) throw error;
      toast("Education deleted");
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : JSON.stringify(err), "error");
    }
  };

  if (editing) {
    return (
      <div>
        <h1 className="font-heading text-3xl text-primary">{editing.id ? "Edit Education" : "New Education"}</h1>
        <div className="mt-6 flex flex-col gap-4 max-w-2xl">
          <InputField label="Institution" value={editing.institution ?? ""} onChange={(e) => setEditing({ ...editing, institution: e.target.value })} />
          <InputField label="Degree" value={editing.degree ?? ""} onChange={(e) => setEditing({ ...editing, degree: e.target.value })} />
          <InputField label="Field of Study" value={editing.field_of_study ?? ""} onChange={(e) => setEditing({ ...editing, field_of_study: e.target.value })} />
          <InputField label="Start Date" type="date" value={editing.start_date ?? ""} onChange={(e) => setEditing({ ...editing, start_date: e.target.value })} />
          <InputField label="End Date" type="date" value={editing.end_date ?? ""} onChange={(e) => setEditing({ ...editing, end_date: e.target.value })} />
          <InputField label="GPA" value={editing.gpa ?? ""} onChange={(e) => setEditing({ ...editing, gpa: e.target.value })} />
          <TextareaField label="Description" value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
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
        <h1 className="font-heading text-3xl text-primary">Education</h1>
        <button onClick={openNew} className="flex cursor-pointer items-center gap-2 rounded-lg bg-accent px-4 py-2 font-body text-background transition-opacity hover:opacity-90"><LuPlus size={18} /> Add</button>
      </div>
      <div className="mt-6 flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-xl border border-border bg-surface p-6">
            <div>
              <h2 className="font-heading text-lg text-primary">{item.degree} at {item.institution}</h2>
              <p className="text-sm text-secondary">{item.field_of_study ? `${item.field_of_study} · ` : ""}{item.start_date} - {item.end_date ?? "Present"}{item.gpa ? ` · GPA: ${item.gpa}` : ""}</p>
              {item.description && <p className="mt-1 text-sm text-muted">{item.description}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(item)} className="cursor-pointer rounded-lg p-2 text-secondary hover:bg-surface-muted"><LuPencil size={18} /></button>
              <button onClick={() => remove(item.id)} className="cursor-pointer rounded-lg p-2 text-secondary hover:bg-surface-muted hover:text-danger"><LuTrash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
