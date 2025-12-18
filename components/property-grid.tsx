"use client";


import { PropertyCard } from "./property-card";
import type { ListingWithRelations } from "@/lib/types/database";
import { cn } from "@/lib/utils";

interface PropertyGridProps {
  listings: ListingWithRelations[];
  className?: string;
  loading?: boolean;
}

export function PropertyGrid({
  listings,
  className,
  loading = false,
}: PropertyGridProps) {
  if (loading) {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6", className)}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-xl aspect-4/3 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <p className="text-muted-foreground text-lg">
          ကြော်ငြာများ မတွေ့ရှိပါ
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6",
        className
      )}
    >
      {listings.map((listing) => (
        <PropertyCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}

