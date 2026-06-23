"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { InputField } from "@/components/admin/AdminFormField";
import { LuPlus, LuTrash2, LuX } from "react-icons/lu";
import { useToast } from "@/components/ui/Toast";

export default function AdminSkills() {
  const supabase = createClient();
  const { toast } = useToast();
  const catRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [skillModal, setSkillModal] = useState<{ categoryId: string; names: string[] } | null>(null);

  const load = useCallback(async () => {
    const { data: cats } = await supabase
      .from("skill_categories")
      .select("*, skills(*)")
      .order("sort_order", { ascending: true });
    if (cats) setCategories(cats);
  }, []);

  useEffect(() => { load(); }, [load]);

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const { error } = await supabase.from("skill_categories").insert({ name: newCategory, sort_order: categories.length });
      if (error) throw error;
      toast("Category added");
      setNewCategory("");
      catRef.current?.focus();
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to add category", "error");
    }
  };

  const addSkillsBatch = async () => {
    if (!skillModal) return;
    const toInsert = skillModal.names.filter((n) => n.trim());
    if (toInsert.length === 0) return;
    try {
      const cat = categories.find((c) => c.id === skillModal.categoryId);
      const baseOrder = cat?.skills?.length ?? 0;
      for (let i = 0; i < toInsert.length; i++) {
        const { error } = await supabase.from("skills").insert({ name: toInsert[i], category_id: skillModal.categoryId, sort_order: baseOrder + i });
        if (error) throw error;
      }
      toast(`${toInsert.length} skill${toInsert.length > 1 ? "s" : ""} added`);
      setSkillModal(null);
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to add skills", "error");
    }
  };

  const removeCategory = async (id: string) => {
    try {
      const { error: skillsErr } = await supabase.from("skills").delete().eq("category_id", id);
      if (skillsErr) throw skillsErr;
      const { error } = await supabase.from("skill_categories").delete().eq("id", id);
      if (error) throw error;
      toast("Category deleted");
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to delete category", "error");
    }
  };

  const removeSkill = async (id: string) => {
    try {
      const { error } = await supabase.from("skills").delete().eq("id", id);
      if (error) throw error;
      toast("Skill removed");
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to remove skill", "error");
    }
  };

  return (
    <div>
      <h1 className="font-heading text-3xl text-primary">Skills</h1>

      <div className="mt-6 flex max-w-sm gap-2">
        <input ref={catRef} value={newCategory} onChange={(e) => setNewCategory(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCategory()} placeholder="New category name" className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-primary placeholder:text-muted focus:border-accent-secondary focus:outline-none" />
        <button onClick={addCategory} className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-background transition-opacity hover:opacity-90"><LuPlus size={18} /></button>
      </div>

      <div className="mt-8 flex flex-col gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="rounded-xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg text-primary">{cat.name}</h2>
              <button onClick={() => removeCategory(cat.id)} className="cursor-pointer rounded-lg p-2 text-secondary hover:bg-surface-muted hover:text-danger" title="Delete category">
                <LuTrash2 size={16} />
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {cat.skills?.map((skill: any) => (
                <span key={skill.id} className="flex items-center gap-2 rounded-full bg-surface-muted px-3 py-1 text-sm text-secondary">
                  {skill.name}
                  <button onClick={() => removeSkill(skill.id)} className="cursor-pointer text-muted hover:text-danger"><LuTrash2 size={14} /></button>
                </span>
              ))}
            </div>
            <button onClick={() => setSkillModal({ categoryId: cat.id, names: [""] })} className="mt-3 cursor-pointer text-sm text-accent-secondary transition-colors hover:underline">+ Add skill</button>
          </div>
        ))}
      </div>

      {skillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSkillModal(null)}>
          <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg text-primary">Add Skills</h3>
              <button onClick={() => setSkillModal(null)} className="cursor-pointer text-secondary hover:text-primary"><LuX size={20} /></button>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              {skillModal.names.map((name, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={name}
                    onChange={(e) => {
                      const n = [...skillModal.names];
                      n[i] = e.target.value;
                      setSkillModal({ ...skillModal, names: n });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && i === skillModal.names.length - 1) {
                        setSkillModal({ ...skillModal, names: [...skillModal.names, ""] });
                      }
                    }}
                    placeholder={`Skill ${i + 1}`}
                    autoFocus={i === 0}
                    className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-primary placeholder:text-muted focus:border-accent-secondary focus:outline-none"
                  />
                  <button onClick={() => setSkillModal({ ...skillModal, names: skillModal.names.filter((_, j) => j !== i) })} className="cursor-pointer text-secondary hover:text-danger"><LuTrash2 size={18} /></button>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between">
              <button onClick={() => setSkillModal({ ...skillModal, names: [...skillModal.names, ""] })} className="cursor-pointer text-sm text-accent-secondary transition-colors hover:underline">+ Add Another</button>
              <div className="flex gap-3">
                <button onClick={() => setSkillModal(null)} className="cursor-pointer rounded-lg border border-border px-4 py-2 font-body text-sm text-secondary transition-colors hover:bg-surface-muted">Cancel</button>
                <button onClick={addSkillsBatch} className="cursor-pointer rounded-lg bg-accent px-4 py-2 font-body text-sm text-background transition-opacity hover:opacity-90">Add All</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
