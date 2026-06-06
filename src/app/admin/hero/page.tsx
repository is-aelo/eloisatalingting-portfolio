"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { InputField, TextareaField, ToggleField } from "@/components/admin/AdminFormField";
import { useToast } from "@/components/ui/Toast";

export default function AdminHero() {
  const supabase = createClient();
  const { toast } = useToast();
  const [data, setData] = useState({
    headline: "",
    subheadline: "",
    cta_primary_label: "",
    cta_primary_url: "",
    cta_secondary_label: "",
    cta_secondary_url: "",
    display: true,
  });
  const [id, setId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from("hero_content")
      .select("*")
      .maybeSingle()
      .then(({ data: row }) => {
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
        const { error } = await supabase.from("hero_content").update(data).eq("id", id);
        if (error) throw error;
        toast("Hero section saved");
      } else {
        const { data: inserted, error } = await supabase.from("hero_content").insert(data).select().single();
        if (error) throw error;
        if (inserted) setId(inserted.id);
        toast("Hero section created");
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to save", "error");
    }
    setSaving(false);
  };

  return (
    <div>
      <h1 className="font-heading text-3xl text-primary">Hero Section</h1>
      <div className="mt-6 flex flex-col gap-4 max-w-2xl">
        <InputField label="Headline" value={data.headline} onChange={(e) => setData({ ...data, headline: e.target.value })} />
        <TextareaField label="Subheadline" value={data.subheadline ?? ""} onChange={(e) => setData({ ...data, subheadline: e.target.value })} />
        <InputField label="CTA Primary Label" value={data.cta_primary_label ?? ""} onChange={(e) => setData({ ...data, cta_primary_label: e.target.value })} />
        <InputField label="CTA Primary URL" value={data.cta_primary_url ?? ""} onChange={(e) => setData({ ...data, cta_primary_url: e.target.value })} />
        <InputField label="CTA Secondary Label" value={data.cta_secondary_label ?? ""} onChange={(e) => setData({ ...data, cta_secondary_label: e.target.value })} />
        <InputField label="CTA Secondary URL" value={data.cta_secondary_url ?? ""} onChange={(e) => setData({ ...data, cta_secondary_url: e.target.value })} />
        <ToggleField label="Display on site" checked={data.display} onChange={(v) => setData({ ...data, display: v })} />
        <button onClick={handleSave} disabled={saving} className="self-start cursor-pointer rounded-lg bg-accent px-6 py-3 font-body text-background transition-opacity hover:opacity-90 disabled:opacity-50">
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
