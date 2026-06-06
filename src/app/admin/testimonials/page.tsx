"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { InputField, TextareaField, ToggleField } from "@/components/admin/AdminFormField";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { LuPlus, LuPencil, LuTrash2, LuX } from "react-icons/lu";
import { useToast } from "@/components/ui/Toast";

type TestimonialForm = {
  name: string;
  company: string;
  role: string;
  avatar_url: string;
  testimonial: string;
  display: boolean;
};

const blankTestimonial = (): TestimonialForm => ({
  name: "",
  company: "",
  role: "",
  avatar_url: "",
  testimonial: "",
  display: true,
});

export default function AdminTestimonials() {
  const supabase = createClient();
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [forms, setForms] = useState<TestimonialForm[]>([]);
  const [showBatch, setShowBatch] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<TestimonialForm | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("testimonials").select("*").order("sort_order", { ascending: true });
    if (data) setTestimonials(data);
  };

  useEffect(() => { load(); }, []);

  const openBatch = () => {
    setForms([blankTestimonial()]);
    setShowBatch(true);
  };

  const addBatch = async () => {
    const toInsert = forms.filter((f) => f.name.trim() && f.testimonial.trim());
    if (toInsert.length === 0) return;
    setSaving(true);
    try {
      const baseOrder = testimonials.length;
      for (let i = 0; i < toInsert.length; i++) {
        const { error } = await supabase.from("testimonials").insert({ ...toInsert[i], sort_order: baseOrder + i });
        if (error) throw error;
      }
      toast(`${toInsert.length} testimonial${toInsert.length > 1 ? "s" : ""} added`);
      setShowBatch(false);
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to add testimonials", "error");
    }
    setSaving(false);
  };

  const updateForm = (i: number, patch: Partial<TestimonialForm>) => {
    const f = [...forms];
    f[i] = { ...f[i], ...patch };
    setForms(f);
  };

  const openEdit = (t: any) => {
    setEditingId(t.id);
    setEditForm({ name: t.name, company: t.company ?? "", role: t.role ?? "", avatar_url: t.avatar_url ?? "", testimonial: t.testimonial, display: t.display });
  };

  const saveEdit = async () => {
    if (!editingId || !editForm) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("testimonials").update(editForm).eq("id", editingId);
      if (error) throw error;
      toast("Testimonial saved");
      setEditingId(null);
      setEditForm(null);
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to save", "error");
    }
    setSaving(false);
  };

  const remove = async (id: string) => {
    try {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
      toast("Testimonial deleted");
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to delete", "error");
    }
  };

  if (editingId && editForm) {
    return (
      <div>
        <h1 className="font-heading text-3xl text-primary">Edit Testimonial</h1>
        <div className="mt-6 flex flex-col gap-4 max-w-2xl">
          <div className="flex gap-4">
            <InputField label="Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            <InputField label="Company" value={editForm.company} onChange={(e) => setEditForm({ ...editForm, company: e.target.value })} />
            <InputField label="Role" value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} />
          </div>
          <TextareaField label="Testimonial" value={editForm.testimonial} onChange={(e) => setEditForm({ ...editForm, testimonial: e.target.value })} />
          <ToggleField label="Display on site" checked={editForm.display} onChange={(v) => setEditForm({ ...editForm, display: v })} />
          <div>
            <p className="text-sm text-secondary">Avatar</p>
            <ImageUploader currentUrl={editForm.avatar_url} onUpload={(url) => setEditForm({ ...editForm, avatar_url: url })} />
          </div>
          <div className="flex gap-3">
            <button onClick={saveEdit} disabled={saving} className="cursor-pointer rounded-lg bg-accent px-6 py-3 font-body text-background transition-opacity hover:opacity-90 disabled:opacity-50">{saving ? "Saving..." : "Save"}</button>
            <button onClick={() => { setEditingId(null); setEditForm(null); }} className="cursor-pointer rounded-lg border border-border px-6 py-3 font-body text-secondary transition-colors hover:bg-surface-muted">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  if (showBatch) {
    return (
      <div>
        <h1 className="font-heading text-3xl text-primary">New Testimonials</h1>
        <div className="mt-6 flex flex-col gap-8 max-w-2xl">
          {forms.map((form, i) => (
            <div key={i} className="relative rounded-xl border border-border bg-surface p-6">
              {forms.length > 1 && (
                <button onClick={() => setForms(forms.filter((_, j) => j !== i))} className="absolute top-3 right-3 cursor-pointer text-secondary hover:text-red-500"><LuX size={18} /></button>
              )}
              <p className="mb-4 font-heading text-sm text-secondary">Testimonial {i + 1}</p>
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <InputField label="Name" value={form.name} onChange={(e) => updateForm(i, { name: e.target.value })} />
                  <InputField label="Company" value={form.company} onChange={(e) => updateForm(i, { company: e.target.value })} />
                  <InputField label="Role" value={form.role} onChange={(e) => updateForm(i, { role: e.target.value })} />
                </div>
                <TextareaField label="Testimonial" value={form.testimonial} onChange={(e) => updateForm(i, { testimonial: e.target.value })} />
                <ToggleField label="Display on site" checked={form.display} onChange={(v) => updateForm(i, { display: v })} />
                <div>
                  <p className="text-sm text-secondary">Avatar</p>
                  <ImageUploader currentUrl={form.avatar_url} onUpload={(url) => updateForm(i, { avatar_url: url })} />
                </div>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between">
            <button onClick={() => setForms([...forms, blankTestimonial()])} className="cursor-pointer text-sm text-accent-secondary transition-colors hover:underline">+ Add Another</button>
            <div className="flex gap-3">
              <button onClick={() => setShowBatch(false)} className="cursor-pointer rounded-lg border border-border px-6 py-3 font-body text-secondary transition-colors hover:bg-surface-muted">Cancel</button>
              <button onClick={addBatch} disabled={saving} className="cursor-pointer rounded-lg bg-accent px-6 py-3 font-body text-background transition-opacity hover:opacity-90 disabled:opacity-50">
                {saving ? "Saving..." : `Save All (${forms.filter((f) => f.name.trim() && f.testimonial.trim()).length})`}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl text-primary">Testimonials</h1>
        <button onClick={openBatch} className="flex cursor-pointer items-center gap-2 rounded-lg bg-accent px-4 py-2 font-body text-background transition-opacity hover:opacity-90"><LuPlus size={18} /> Add</button>
      </div>
      <div className="mt-6 flex flex-col gap-4">
        {testimonials.map((t) => (
          <div key={t.id} className="flex items-start justify-between rounded-xl border border-border bg-surface p-6">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                {t.avatar_url && <img src={t.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />}
                <div>
                  <p className="font-heading text-primary">{t.name}</p>
                  <p className="text-xs text-muted">{t.role}{t.company ? ` at ${t.company}` : ""}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-secondary italic">"{t.testimonial}"</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(t)} className="cursor-pointer rounded-lg p-2 text-secondary hover:bg-surface-muted"><LuPencil size={18} /></button>
              <button onClick={() => remove(t.id)} className="cursor-pointer rounded-lg p-2 text-secondary hover:bg-surface-muted hover:text-red-500"><LuTrash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
