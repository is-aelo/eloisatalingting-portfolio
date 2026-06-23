"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { LuUpload, LuX, LuCheck } from "react-icons/lu";

type ImageUploaderProps = {
  bucket?: string;
  onUpload: (url: string) => void;
  currentUrl?: string | null;
};

export function ImageUploader({
  bucket = "images",
  onUpload,
  currentUrl,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);

    if (error) {
      console.error(error);
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    setPreview(publicUrl);
    onUpload(publicUrl);
    setUploading(false);
  };

  const handleRemove = () => {
    setPreview(null);
    onUpload("");
  };

  return (
    <div>
      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="h-32 w-48 rounded-lg object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -right-2 -top-2 cursor-pointer rounded-full bg-danger p-1 text-white"
          >
            <LuX size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-32 w-48 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-surface-muted text-secondary transition-colors hover:border-accent-secondary"
        >
          {uploading ? <LuCheck size={24} /> : <LuUpload size={24} />}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}
