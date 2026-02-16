import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import ListingsService from "@/lib/services/listings";
import SidebarHeader from "@/components/customs/sidebar-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, MapPin, Ruler, Bed, Bath, DollarSign } from "lucide-react";

const breadcrumb = (code: string, title: string) => [
  { title: "Dashboard", href: "/protected" },
  { title: "Listings", href: "/protected/listings" },
  { title: title || code, href: `/protected/listings/${code}` },
];

interface PageProps {
  params: Promise<{ locale: string; code: string }>;
}

export default async function ListingViewPage({ params }: PageProps) {
  const { locale, code } = await params;
  const supabase = await createClient();
  const service = new ListingsService(supabase);

  const raw = await service.getByIdWithImages(code);
  if (!raw) notFound();

  const listing = raw as typeof raw & {
    region?: { name_en?: string; name_mm?: string } | null;
    township?: { name_en?: string; name_mm?: string } | null;
    property_type?: { name_en?: string; name_mm?: string } | null;
    agency?: { display_name?: string } | null;
    images?: { id: string; image_url: string; sort_order: number }[];
  };

  const title = listing.title || listing.listing_code;
  const region = listing.region ?? null;
  const township = listing.township ?? null;
  const propertyType = listing.property_type ?? null;
  const agency = listing.agency ?? null;
  const images = listing.images ?? [];

  return (
    <div className="min-h-screen flex flex-col">
      <SidebarHeader breadcrumb={breadcrumb(code, title)} />
      <div className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-xl font-semibold tracking-tight md:text-2xl truncate">
              {title}
            </h1>
            <Button asChild size="sm">
              <Link href={`/${locale}/protected/listings/${code}/edit`} className="inline-flex items-center gap-2">
                <Pencil className="size-4" />
                Edit
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{listing.listing_code}</Badge>
                <Badge variant="secondary">{listing.kind}</Badge>
                <Badge variant={listing.status === "published" ? "default" : "outline"}>
                  {listing.status}
                </Badge>
                {listing.is_featured && <Badge>Featured</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {listing.description && (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {listing.description}
                </p>
              )}

              <dl className="grid gap-4 sm:grid-cols-2">
                {(region || township || propertyType) && (
                  <div className="flex items-start gap-2">
                    <MapPin className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <dt className="text-xs font-medium text-muted-foreground">Location</dt>
                      <dd className="text-sm">
                        {[region?.name_en ?? region?.name_mm, township?.name_en ?? township?.name_mm, propertyType?.name_en ?? propertyType?.name_mm]
                          .filter(Boolean)
                          .join(" · ") || "—"}
                      </dd>
                    </div>
                  </div>
                )}
                {(listing.bedrooms != null || listing.bathrooms != null) && (
                  <div className="flex items-start gap-2">
                    <Bed className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <dt className="text-xs font-medium text-muted-foreground">Rooms</dt>
                      <dd className="text-sm">
                        {[listing.bedrooms != null && `${listing.bedrooms} bed`, listing.bathrooms != null && `${listing.bathrooms} bath`]
                          .filter(Boolean)
                          .join(", ") || "—"}
                      </dd>
                    </div>
                  </div>
                )}
                {(listing.area_sqft != null || listing.width_ft != null) && (
                  <div className="flex items-start gap-2">
                    <Ruler className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <dt className="text-xs font-medium text-muted-foreground">Size</dt>
                      <dd className="text-sm">
                        {listing.area_sqft != null ? `${listing.area_sqft} sqft` : null}
                        {listing.width_ft != null && listing.length_ft != null
                          ? ` (${listing.width_ft}×${listing.length_ft} ft)`
                          : ""}
                        {listing.area_label ? ` · ${listing.area_label}` : ""}
                        {!listing.area_sqft && !listing.width_ft && !listing.area_label ? "—" : ""}
                      </dd>
                    </div>
                  </div>
                )}
                {(listing.price_amount != null || listing.currency) && (
                  <div className="flex items-start gap-2">
                    <DollarSign className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <dt className="text-xs font-medium text-muted-foreground">Price</dt>
                      <dd className="text-sm">
                        {listing.price_amount != null
                          ? `${listing.currency ?? "MMK"} ${listing.price_amount.toLocaleString()}${listing.price_unit_label ? ` ${listing.price_unit_label}` : ""}`
                          : "—"}
                      </dd>
                    </div>
                  </div>
                )}
                {listing.address_text && (
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-medium text-muted-foreground">Address</dt>
                    <dd className="text-sm">{listing.address_text}</dd>
                  </div>
                )}
                {agency?.display_name && (
                  <div>
                    <dt className="text-xs font-medium text-muted-foreground">Agency</dt>
                    <dd className="text-sm">{agency.display_name}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Views</dt>
                  <dd className="text-sm">{listing.views_count ?? 0}</dd>
                </div>
              </dl>

              {images.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Images</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {images.map((img) => (
                      <div
                        key={img.id}
                        className="relative aspect-video rounded-lg overflow-hidden bg-muted"
                      >
                        <Image
                          src={img.image_url}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, 33vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
