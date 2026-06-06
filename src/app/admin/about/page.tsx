"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { InputField, TextareaField } from "@/components/admin/AdminFormField";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useToast } from "@/components/ui/Toast";

export default function AdminAbout() {
  const supabase = createClient();
  const { toast } = useToast();
  const [data, setData] = useState({
    full_name: "",
    title: "",
    location: "",
    summary: "",
    profile_image_url: "",
    resume_url: "",
  });
  const [id, setId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("about").select("*").maybeSingle().then(({ data: row }) => {
      if (row) {
        setData(row);
        setId(row.id);
      }
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (id) {
        const { error } = await supabase.from("about").update(data).eq("id", id);
        if (error) throw error;
        toast("About saved");
      } else {
        const { data: inserted, error } = await supabase.from("about").insert(data).select().single();
        if (error) throw error;
        if (inserted) setId(inserted.id);
        toast("About created");
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to save", "error");
    }
    setSaving(false);
  };

  return (
    <div>
      <h1 className="font-heading text-3xl text-primary">About</h1>
      <div className="mt-6 flex flex-col gap-4 max-w-2xl">
        <InputField label="Full Name" value={data.full_name} onChange={(e) => setData({ ...data, full_name: e.target.value })} />
        <InputField label="Title" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
        <InputField label="Location" value={data.location ?? ""} onChange={(e) => setData({ ...data, location: e.target.value })} />
        <TextareaField label="Summary" value={data.summary ?? ""} onChange={(e) => setData({ ...data, summary: e.target.value })} />
        <InputField label="Resume URL" value={data.resume_url ?? ""} onChange={(e) => setData({ ...data, resume_url: e.target.value })} />
        <div>
          <p className="text-sm text-secondary">Profile Image</p>
          <ImageUploader currentUrl={data.profile_image_url} onUpload={(url) => setData({ ...data, profile_image_url: url })} />
        </div>
        <button onClick={handleSave} disabled={saving} className="self-start cursor-pointer rounded-lg bg-accent px-6 py-3 font-body text-background transition-opacity hover:opacity-90 disabled:opacity-50">
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
