"use client";

import { useRef, useEffect, useState } from "react";
import { useEditor, EditorContent, mergeAttributes } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Node } from "@tiptap/core";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/Toast";
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
  LuVideo,
  LuX,
  LuUpload,
} from "react-icons/lu";

const VideoBlock = Node.create({
  name: "videoBlock",
  group: "block",
  draggable: true,
  atom: true,
  addAttributes() {
    return { src: { default: null } };
  },
  parseHTML() {
    return [{ tag: "video[src]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "video",
      mergeAttributes(HTMLAttributes, {
        controls: "true",
        class: "w-full rounded-xl border border-border",
      }),
    ];
  },
});

const IframeBlock = Node.create({
  name: "iframeBlock",
  group: "block",
  draggable: true,
  atom: true,
  addAttributes() {
    return { src: { default: null } };
  },
  parseHTML() {
    return [{ tag: "iframe[src]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      { class: "aspect-video w-full overflow-hidden rounded-xl border border-border" },
      ["iframe", mergeAttributes(HTMLAttributes, { allowFullScreen: "", class: "h-full w-full" })],
    ];
  },
});

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
  const supabase = createClient();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [prompt, setPrompt] = useState<{ type: "image" | "link" | "video"; value: string } | null>(null);

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("images").upload(path, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(path);
      editor?.chain().focus().setImage({ src: publicUrl }).run();
      setPrompt(null);
      toast("Image added");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to upload image", "error");
    }
    setUploading(false);
  };

  const insertVideoNode = (src: string) => {
    if (!editor) return;
    const node = editor.schema.nodes.videoBlock?.create({ src });
    if (!node) { toast("VideoBlock node not found in schema", "error"); return; }
    editor.chain().focus().insertContent(node).run();
  };

  const insertIframeNode = (src: string) => {
    if (!editor) return;
    const node = editor.schema.nodes.iframeBlock?.create({ src });
    if (!node) { toast("IframeBlock node not found in schema", "error"); return; }
    editor.chain().focus().insertContent(node).run();
  };

  const uploadVideo = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("images").upload(path, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(path);
      insertVideoNode(publicUrl);
      setPrompt(null);
      toast("Video added");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to upload video", "error");
    }
    setUploading(false);
  };

  const convertToEmbedUrl = (url: string): string | null => {
    const youtube = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/
    );
    if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`;

    const vimeo = url.match(/vimeo\.com\/(\d+)/);
    if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;

    return null;
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: { openOnClick: false } }),
      Image,
      VideoBlock,
      IframeBlock,
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  const handlePromptConfirm = () => {
    if (!prompt) return;
    const { value } = prompt;
    if (!value) return;

    if (prompt.type === "image") {
      editor.chain().focus().setImage({ src: value }).run();
    } else if (prompt.type === "video") {
      const embedUrl = convertToEmbedUrl(value);
      if (embedUrl) {
        insertIframeNode(embedUrl);
      } else {
        insertVideoNode(value);
      }
    } else {
      editor.chain().focus().setLink({ href: value }).run();
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
          onClick={() => setPrompt({ type: "video", value: "" })}
          className="cursor-pointer rounded p-1.5 text-secondary hover:bg-surface-muted hover:text-primary"
        >
          <LuVideo size={18} />
        </button>
        <button
          type="button"
          onClick={() => setPrompt({ type: "link", value: "" })}
          className="cursor-pointer rounded p-1.5 text-secondary hover:bg-surface-muted hover:text-primary"
        >
          <LuLink size={18} />
        </button>
      </div>
      <div className="p-4">
        <EditorContent editor={editor} />
      </div>

      {prompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setPrompt(null)}>
          <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg text-primary">{prompt.type === "image" ? "Add Image" : prompt.type === "video" ? "Add Video" : "Link URL"}</h3>
              <button onClick={() => setPrompt(null)} className="cursor-pointer text-secondary hover:text-primary"><LuX size={20} /></button>
            </div>

            {(prompt.type === "image" || prompt.type === "video") && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-surface-muted px-4 py-8 text-secondary transition-colors hover:border-accent-secondary"
                >
                  <LuUpload size={20} />
                  <span className="font-body text-sm">{uploading ? "Uploading..." : `Upload ${prompt.type === "video" ? "video" : "image"} from computer`}</span>
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept={prompt.type === "video" ? "video/*" : "image/*"}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    if (prompt.type === "video") uploadVideo(f);
                    else uploadImage(f);
                  }}
                  className="hidden"
                />
                <div className="my-3 flex items-center gap-3">
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-xs text-muted">or paste URL</span>
                  <span className="h-px flex-1 bg-border" />
                </div>
              </div>
            )}

            <input
              value={prompt.value}
              onChange={(e) => setPrompt({ ...prompt, value: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handlePromptConfirm()}
              placeholder={prompt.type === "image" ? "https://example.com/image.jpg" : prompt.type === "video" ? "https://youtube.com/watch?v=... or https://example.com/video.mp4" : "https://example.com"}
              autoFocus
              className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2 text-primary placeholder:text-muted focus:border-accent-secondary focus:outline-none"
            />
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setPrompt(null)} className="cursor-pointer rounded-lg border border-border px-4 py-2 font-body text-sm text-secondary transition-colors hover:bg-surface-muted">Cancel</button>
              <button onClick={handlePromptConfirm} className="cursor-pointer rounded-lg bg-accent px-4 py-2 font-body text-sm text-background transition-opacity hover:opacity-90">
                {prompt.type === "image" ? "Add Image" : prompt.type === "video" ? "Add Video" : "Add Link"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
