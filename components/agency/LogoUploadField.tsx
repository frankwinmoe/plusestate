"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getPresignedUrl } from "@/lib/services/aws/s3Action";
import { X } from "lucide-react";

const UPLOAD_FOLDER = "agencies/logos";

type Props = {
  name: string;
  currentUrl: string | null;
  label?: string;
};

export function LogoUploadField({ name, currentUrl, label = "Logo" }: Props) {
  const [url, setUrl] = useState<string | null>(currentUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const key = `${UPLOAD_FOLDER}/${crypto.randomUUID()}-${file.name}`;
      const { url: signedUrl } = await getPresignedUrl(key, file.type);
      const res = await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!res.ok) throw new Error("Upload failed");
      const publicUrl = signedUrl.split("?")[0];
      setUrl(publicUrl);
    } catch {
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function clearLogo() {
    setUrl(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const value = url ?? currentUrl ?? "";

  return (
    <div className="space-y-2">
      {label ? <Label>{label}</Label> : null}
      <div className="flex flex-wrap items-start gap-4">
        {value ? (
          <div className="relative inline-block">
            <div className="relative h-24 w-24 rounded-lg border bg-muted overflow-hidden">
              <Image
                src={value}
                alt="Agency logo"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="absolute -top-2 -right-2 h-6 w-6"
              onClick={clearLogo}
              aria-label="Remove logo"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : null}
        <div className="flex flex-col gap-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="text-sm file:mr-2 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-primary-foreground"
          />
          {uploading && (
            <span className="text-xs text-muted-foreground">Uploading…</span>
          )}
          {error && (
            <span className="text-xs text-destructive">{error}</span>
          )}
        </div>
      </div>
      <input type="hidden" name={name} value={value} />
    </div>
  );
}
