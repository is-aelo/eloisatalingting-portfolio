"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { InputField } from "@/components/admin/AdminFormField";
import { useToast } from "@/components/ui/Toast";

export default function AdminContact() {
  const supabase = createClient();
  const { toast } = useToast();
  const [data, setData] = useState({
    email: "",
    linkedin_url: "",
    github_url: "",
    tiktok_url: "",
  });
  const [id, setId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("contact").select("*").maybeSingle().then(({ data: row }) => {
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
        const { error } = await supabase.from("contact").update(data).eq("id", id);
        if (error) throw error;
        toast("Contact saved");
      } else {
        const { data: inserted, error } = await supabase.from("contact").insert(data).select().single();
        if (error) throw error;
        if (inserted) setId(inserted.id);
        toast("Contact created");
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to save", "error");
    }
    setSaving(false);
  };

  return (
    <div>
      <h1 className="font-heading text-3xl text-primary">Contact</h1>
      <div className="mt-6 flex flex-col gap-4 max-w-2xl">
        <InputField label="Email" type="email" value={data.email ?? ""} onChange={(e) => setData({ ...data, email: e.target.value })} />
        <InputField label="LinkedIn URL" value={data.linkedin_url ?? ""} onChange={(e) => setData({ ...data, linkedin_url: e.target.value })} placeholder="https://linkedin.com/in/..." />
        <InputField label="GitHub URL" value={data.github_url ?? ""} onChange={(e) => setData({ ...data, github_url: e.target.value })} placeholder="https://github.com/..." />
        <InputField label="TikTok URL" value={data.tiktok_url ?? ""} onChange={(e) => setData({ ...data, tiktok_url: e.target.value })} placeholder="https://tiktok.com/..." />
        <button onClick={handleSave} disabled={saving} className="self-start cursor-pointer rounded-lg bg-accent px-6 py-3 font-body text-background transition-opacity hover:opacity-90 disabled:opacity-50">
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
