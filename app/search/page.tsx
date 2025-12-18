import { Suspense } from "react";
import { PropertyGrid } from "@/components/property-grid";
import { searchListings } from "@/lib/db/listings";
import type { ListingKind } from "@/lib/types/database";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    type?: string;
    region?: string;
    township?: string;
    property_type?: string;
    minBed?: string;
    maxBed?: string;
    price_from?: string;
    price_to?: string;
    featured?: string;
  }>;
}

async function SearchResults({ searchParams }: SearchPageProps) {
  const params = await searchParams;

  const listings = await searchListings({
    q: params.q || null,
    kind: (params.type as ListingKind) || null,
    region_id: params.region ? parseInt(params.region) : null,
    township_id: params.township ? parseInt(params.township) : null,
    property_type_id: params.property_type
      ? parseInt(params.property_type)
      : null,
    min_bed: params.minBed ? parseInt(params.minBed) : null,
    max_bed: params.maxBed ? parseInt(params.maxBed) : null,
    price_from: params.price_from ? parseFloat(params.price_from) : null,
    price_to: params.price_to ? parseFloat(params.price_to) : null,
    limit: 24,
  });

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          {params.q
            ? `"${params.q}" အတွက် ရှာဖွေမှု ရလဒ်များ`
            : "ကြော်ငြာများ"}
        </h1>
        {listings.length > 0 && (
          <p className="text-muted-foreground">
            {listings.length} ခု တွေ့ရှိပါသည်
          </p>
        )}
      </div>
      <PropertyGrid listings={listings} />
    </div>
  );
}

export default function SearchPage(props: SearchPageProps) {
  return (
    <Suspense fallback={<PropertyGrid listings={[]} loading />}>
      <SearchResults {...props} />
    </Suspense>
  );
}

