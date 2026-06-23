"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LuPlus, LuTrash2, LuGrip } from "react-icons/lu";
import { useToast } from "@/components/ui/Toast";

export default function AdminTools() {
  const supabase = createClient();
  const { toast } = useToast();
  const batchRef = useRef<HTMLDivElement>(null);
  const [tools, setTools] = useState<any[]>([]);
  const [entries, setEntries] = useState<{ name: string; category: string }[]>([{ name: "", category: "" }]);
  const [adding, setAdding] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("tools").select("*").order("sort_order", { ascending: true });
    if (data) setTools(data);
  };

  useEffect(() => { load(); }, []);

  const addBatch = async () => {
    const toInsert = entries.filter((e) => e.name.trim());
    if (toInsert.length === 0) return;
    setAdding(true);
    try {
      const baseOrder = tools.length;
      for (let i = 0; i < toInsert.length; i++) {
        const { error } = await supabase.from("tools").insert({ name: toInsert[i].name, category: toInsert[i].category || null, sort_order: baseOrder + i });
        if (error) throw error;
      }
      toast(`${toInsert.length} tool${toInsert.length > 1 ? "s" : ""} added`);
      setEntries([{ name: "", category: "" }]);
      setAdding(false);
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to add tools", "error");
      setAdding(false);
    }
  };

  const removeTool = async (id: string) => {
    try {
      const { error } = await supabase.from("tools").delete().eq("id", id);
      if (error) throw error;
      toast("Tool removed");
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to remove tool", "error");
    }
  };

  return (
    <div>
      <h1 className="font-heading text-3xl text-primary">Tools</h1>

      <div ref={batchRef} className="mt-6 flex max-w-lg flex-col gap-3">
        {entries.map((entry, i) => (
          <div key={i} className="flex gap-2">
            <input value={entry.name} onChange={(e) => { const e2 = [...entries]; e2[i] = { ...e2[i], name: e.target.value }; setEntries(e2); }} placeholder="Tool name" className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-primary placeholder:text-muted focus:border-accent-secondary focus:outline-none" />
            <input value={entry.category} onChange={(e) => { const e2 = [...entries]; e2[i] = { ...e2[i], category: e.target.value }; setEntries(e2); }} placeholder="Category (optional)" className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-primary placeholder:text-muted focus:border-accent-secondary focus:outline-none" />
            <button onClick={() => setEntries(entries.filter((_, j) => j !== i))} className="cursor-pointer text-secondary hover:text-danger"><LuTrash2 size={18} /></button>
          </div>
        ))}
        <div className="flex gap-2">
          <button onClick={() => setEntries([...entries, { name: "", category: "" }])} className="cursor-pointer text-sm text-accent-secondary transition-colors hover:underline">+ Add Another</button>
          <button onClick={addBatch} disabled={adding} className="cursor-pointer rounded-lg bg-accent px-4 py-2 font-body text-sm text-background transition-opacity hover:opacity-90 disabled:opacity-50">{adding ? "Adding..." : `Add All (${entries.filter((e) => e.name.trim()).length})`}</button>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-2 max-w-lg">
        {tools.map((tool) => (
          <div key={tool.id} className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3">
            <LuGrip size={16} className="text-muted" />
            <span className="flex-1 text-primary">{tool.name}</span>
            {tool.category && <span className="text-xs text-muted">{tool.category}</span>}
            <button onClick={() => removeTool(tool.id)} className="cursor-pointer text-muted hover:text-danger"><LuTrash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
