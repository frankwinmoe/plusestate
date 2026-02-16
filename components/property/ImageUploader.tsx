"use client";

import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { getPresignedUrl } from "@/lib/services/aws/s3Action";
import Image from "next/image";

export type ImageUploaderRef = {
  upload: () => Promise<string[]>;
  uploading?: boolean;
  setFolder: (folder: string) => void;
};

type PreviewFile = {
  file: File;
  preview: string;
};

type Props = {
  folder: string;
};

export const ImageUploader = forwardRef<ImageUploaderRef, Props>(
  ({ folder: initialFolder }, ref) => {
    const [items, setItems] = useState<PreviewFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [folder, setFolder] = useState(initialFolder);

    /* ---------- expose upload() ---------- */
    useImperativeHandle(ref, () => ({
      uploading,
      setFolder, // expose setter to parent
      async upload() {
        if (!items.length) return [];

        setUploading(true);
        const uploadedUrls: string[] = [];

        for (const { file } of items) {
          const key = `${folder}/${crypto.randomUUID()}-${file.name}`;
          const { url } = await getPresignedUrl(key, file.type);

          const res = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
          });

          if (!res.ok) {
            setUploading(false);
            throw new Error("Image upload failed");
          }

          uploadedUrls.push(url.split("?")[0]);
        }

        setUploading(false);
        return uploadedUrls;
      },
    }));

    /* ---------- handle select ---------- */
    const onSelectFiles = (files: FileList | null) => {
      if (!files) return;

      const next = Array.from(files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      setItems((prev) => [...prev, ...next]);
    };

    /* ---------- remove image ---------- */
    const removeImage = (index: number) => {
      setItems((prev) => {
        const item = prev[index];
        if (item) URL.revokeObjectURL(item.preview);
        return prev.filter((_, i) => i !== index);
      });
    };

    /* ---------- cleanup ---------- */
    useEffect(() => {
      return () => {
        items.forEach((i) => URL.revokeObjectURL(i.preview));
      };
    }, [items]);

    return (
      <div className="space-y-3">
        <Input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => onSelectFiles(e.target.files)}
        />

        {/* ---------- thumbnails ---------- */}
        {items.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="relative group rounded-lg border overflow-hidden"
              >
                <Image
                  src={item.preview}
                  alt="Preview"
                  className="h-32 w-full object-cover"
                  width={300}
                  height={300}
                />

                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {uploading && (
          <p className="text-sm text-muted-foreground">Uploading images…</p>
        )}
      </div>
    );
  },
);

ImageUploader.displayName = "ImageUploader";
