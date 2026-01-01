"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageItem {
  id: string;
  image_url: string;
}

interface Props {
  images: ImageItem[];
  title: string;
  featuredLabel?: string;
}

export default function PropertyImageGallery({
  images,
  title,
  featuredLabel,
}: Props) {
  const [active, setActive] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Main image */}
      <div className="relative aspect-video bg-muted">
        <Image
          src={images[active].image_url}
          alt={title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 66vw"
        />

        {/* Featured badge */}
        {featuredLabel && (
          <span className="absolute top-3 left-3 bg-destructive text-white text-xs px-2 py-1 rounded">
            {featuredLabel}
          </span>
        )}

        {/* Mobile carousel controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setActive((prev) => (prev === 0 ? images.length - 1 : prev - 1))
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full md:hidden"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setActive((prev) => (prev + 1) % images.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full md:hidden"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails (desktop + tablet) */}
      {images.length > 1 && (
        <div className="hidden md:grid grid-cols-5 gap-2 p-3">
          {images.slice(0, 5).map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded border",
                i === active
                  ? "border-primary"
                  : "border-border opacity-80 hover:opacity-100",
              )}
            >
              <Image
                src={img.image_url}
                alt={`${title} ${i + 1}`}
                fill
                className="object-cover"
                sizes="120px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Mobile dots */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 py-3 md:hidden">
          {images.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-2 w-2 rounded-full",
                i === active ? "bg-primary" : "bg-muted-foreground/40",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
