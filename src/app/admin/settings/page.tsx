"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { InputField } from "@/components/admin/AdminFormField";
import { useToast } from "@/components/ui/Toast";

export default function AdminSettings() {
  const supabase = createClient();
  const { toast } = useToast();
  const [data, setData] = useState({
    site_name: "",
    site_description: "",
    favicon_url: "",
    og_image_url: "",
    seo_title_template: "",
  });
  const [id, setId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("site_settings").select("*").maybeSingle().then(({ data: row }) => {
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
        const { error } = await supabase.from("site_settings").update(data).eq("id", id);
        if (error) throw error;
        toast("Settings saved");
      } else {
        const { data: inserted, error } = await supabase.from("site_settings").insert(data).select().single();
        if (error) throw error;
        if (inserted) setId(inserted.id);
        toast("Settings created");
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to save", "error");
    }
    setSaving(false);
  };

  return (
    <div>
      <h1 className="font-heading text-3xl text-primary">Site Settings</h1>
      <div className="mt-6 flex flex-col gap-4 max-w-2xl">
        <InputField label="Site Name" value={data.site_name ?? ""} onChange={(e) => setData({ ...data, site_name: e.target.value })} />
        <InputField label="Site Description" value={data.site_description ?? ""} onChange={(e) => setData({ ...data, site_description: e.target.value })} />
        <InputField label="Favicon URL" value={data.favicon_url ?? ""} onChange={(e) => setData({ ...data, favicon_url: e.target.value })} />
        <InputField label="OG Image URL" value={data.og_image_url ?? ""} onChange={(e) => setData({ ...data, og_image_url: e.target.value })} />
        <InputField label="SEO Title Template" value={data.seo_title_template ?? ""} onChange={(e) => setData({ ...data, seo_title_template: e.target.value })} placeholder="%s — Eloisa Talingting" />
        <button onClick={handleSave} disabled={saving} className="self-start cursor-pointer rounded-lg bg-accent px-6 py-3 font-body text-background transition-opacity hover:opacity-90 disabled:opacity-50">
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
