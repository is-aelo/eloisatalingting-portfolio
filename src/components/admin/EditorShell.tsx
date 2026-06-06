"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  LuBold,
  LuItalic,
  LuHeading,
  LuList,
  LuListOrdered,
  LuQuote,
  LuCode,
  LuImage,
  LuLink,
  LuX,
} from "react-icons/lu";

type EditorShellProps = {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

export function EditorShell({
  content,
  onChange,
  placeholder = "Start writing...",
}: EditorShellProps) {
  const [prompt, setPrompt] = useState<{ type: "image" | "link"; value: string } | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
      LinkExtension.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  const handlePromptConfirm = () => {
    if (!prompt) return;
    if (prompt.type === "image") {
      if (prompt.value) editor.chain().focus().setImage({ src: prompt.value }).run();
    } else {
      if (prompt.value) editor.chain().focus().setLink({ href: prompt.value }).run();
    }
    setPrompt(null);
  };

  const tools = [
    { icon: LuBold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
    { icon: LuItalic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
    { icon: LuHeading, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
    { icon: LuList, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList") },
    { icon: LuListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList") },
    { icon: LuQuote, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive("blockquote") },
    { icon: LuCode, action: () => editor.chain().focus().toggleCodeBlock().run(), active: editor.isActive("codeBlock") },
  ];

  return (
    <div className="rounded-xl border border-border bg-background">
      <div className="flex flex-wrap gap-1 border-b border-border px-3 py-2">
        {tools.map((tool, i) => {
          const Icon = tool.icon;
          return (
            <button
              key={i}
              type="button"
              onClick={tool.action}
              className={`cursor-pointer rounded p-1.5 transition-colors ${
                tool.active
                  ? "bg-accent-secondary/10 text-accent-secondary"
                  : "text-secondary hover:bg-surface-muted hover:text-primary"
              }`}
            >
              <Icon size={18} />
            </button>
          );
        })}
        <span className="mx-1 w-px bg-border" />
        <button
          type="button"
          onClick={() => setPrompt({ type: "image", value: "" })}
          className="cursor-pointer rounded p-1.5 text-secondary hover:bg-surface-muted hover:text-primary"
        >
          <LuImage size={18} />
        </button>
        <button
          type="button"
          onClick={() => setPrompt({ type: "link", value: "" })}
          className="cursor-pointer rounded p-1.5 text-secondary hover:bg-surface-muted hover:text-primary"
        >
          <LuLink size={18} />
        </button>
      </div>
      <div className="prose prose-sm max-w-none p-4 text-primary [&_.ProseMirror-pgh]:text-muted [&_.ProseMirror:focus]:outline-none">
        <EditorContent editor={editor} />
      </div>

      {prompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setPrompt(null)}>
          <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg text-primary">{prompt.type === "image" ? "Image URL" : "Link URL"}</h3>
              <button onClick={() => setPrompt(null)} className="cursor-pointer text-secondary hover:text-primary"><LuX size={20} /></button>
            </div>
            <input
              value={prompt.value}
              onChange={(e) => setPrompt({ ...prompt, value: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handlePromptConfirm()}
              placeholder={prompt.type === "image" ? "https://example.com/image.jpg" : "https://example.com"}
              autoFocus
              className="mt-4 w-full rounded-lg border border-border bg-background px-4 py-2 text-primary placeholder:text-muted focus:border-accent-secondary focus:outline-none"
            />
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setPrompt(null)} className="cursor-pointer rounded-lg border border-border px-4 py-2 font-body text-sm text-secondary transition-colors hover:bg-surface-muted">Cancel</button>
              <button onClick={handlePromptConfirm} className="cursor-pointer rounded-lg bg-accent px-4 py-2 font-body text-sm text-background transition-opacity hover:opacity-90">
                {prompt.type === "image" ? "Add Image" : "Add Link"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
