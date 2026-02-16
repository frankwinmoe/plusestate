import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ListingsService from "@/lib/services/listings";
import SidebarHeader from "@/components/customs/sidebar-header";
import { Button } from "@/components/ui/button";
import { ListingEditForm } from "../listing-edit-form";

interface EditPageProps {
  params: Promise<{ locale: string; code: string }>;
}

export default async function ListingEditPage({ params }: EditPageProps) {
  const { locale, code } = await params;
  const supabase = await createClient();
  const service = new ListingsService(supabase);

  const listing = await service.getByIdWithImages(code);
  if (!listing) notFound();

  const breadcrumb = [
    { title: "Dashboard", href: "/protected" },
    { title: "Listings", href: "/protected/listings" },
    { title: listing.title || listing.listing_code, href: `/protected/listings/${code}` },
    { title: "Edit" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SidebarHeader breadcrumb={breadcrumb} />
      <div className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
              Edit listing
            </h1>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/${locale}/protected/listings/${code}`}>
                View listing
              </Link>
            </Button>
          </div>
          <ListingEditForm
            listing={{
              id: listing.id,
              listing_code: listing.listing_code,
              kind: listing.kind,
              status: listing.status,
              is_featured: listing.is_featured,
              title: listing.title,
              description: listing.description,
              region_id: listing.region_id,
              township_id: listing.township_id,
              property_type_id: listing.property_type_id,
              floor_label: listing.floor_label,
              bedrooms: listing.bedrooms,
              bathrooms: listing.bathrooms,
              width_ft: listing.width_ft,
              length_ft: listing.length_ft,
              area_sqft: listing.area_sqft,
              area_label: listing.area_label,
              currency: listing.currency,
              price_amount: listing.price_amount,
              price_unit_label: listing.price_unit_label ?? null,
              price_per_sqft: listing.price_per_sqft,
              address_text: listing.address_text,
              agency_id: listing.agency_id,
            }}
            locale={locale}
          />
        </div>
      </div>
    </div>
  );
}
