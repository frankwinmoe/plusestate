import { Suspense } from "react";
import { PropertyGrid } from "@/components/property-grid";
import { searchListings } from "@/lib/db/listings";
import type { CurrencyCode, ListingKind, ListingStatus } from "@/lib/types/database";
import { TranslationProvider } from "@/context/TranslationContext";
import { getLocale, getMessages } from "next-intl/server";

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
  // Determine locale and translations
  const locale = await getLocale();
  const translations = await getMessages({ locale });

  const params = await searchParams;

  const searchResults = await searchListings({
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

  const listings = searchResults.map((result) => ({
    ...result,
    kind: (result.kind as ListingKind) || "defaultKind" as ListingKind, // Ensure kind is cast to ListingKind
    status: (result.status as ListingStatus) || "defaultStatus" as ListingStatus,
    description: result.description || "",
    bedrooms: result.bedrooms || 0,
    bathrooms: result.bathrooms || 0,
    width_ft: result.width_ft || 0,
    length_ft: result.length_ft || 0,
    area_label: result.area_label || "defaultAreaLabel",
    price: result.price || 0,
    created_at: result.created_at || new Date().toISOString(),
    updated_at: result.updated_at || new Date().toISOString(),
    currency: (result.currency as CurrencyCode) || "USD" as CurrencyCode, // Ensure currency is cast to CurrencyCode
    price_per_sqft: result.price_per_sqft || 0,
    address_text: result.address_text || "Unknown Address",
    lat: result.lat || 0,
    lng: result.lng || 0,
    owner_id: result.owner_id || null,
    owner_name: result.owner_name || "Unknown Owner",
    agency_id: result.agency_id || null, // Provide default or mapped value
    owner_user_id: result.owner_user_id || null, // Provide default or mapped value
  }));
  console.log("Listings:", listings);

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
      <TranslationProvider translations={translations['featuredListingComponent']}>
        <PropertyGrid listings={listings} />
      </TranslationProvider>
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

