"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Building2,
  Maximize2,
  Heart,
  Search,
  PlusIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ListingWithRelations } from "@/lib/types/database";
import { useTranslations } from "@/context/TranslationContext";
import { useLocale } from "next-intl";
import { usePriceFormatter } from "@/hooks/usePriceFormatter";
import { ButtonGroup } from "@/components/ui/button-group";

interface PropertyCardProps {
  listing: ListingWithRelations;
  className?: string;
}

export function PropertyCard({ listing, className }: PropertyCardProps) {
  const { formatPrice } = usePriceFormatter();
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [formattedPrice, setFormattedPrice] = React.useState<string | null>(
    null,
  );
  const [imageError, setImageError] = React.useState(false);

  const locale = useLocale();
  const translations = useTranslations();

  const mainImage =
    listing.images && listing.images.length > 0
      ? listing.images[0].image_url
      : "/placeholder-property.jpg";

  React.useEffect(() => {
    setFormattedPrice(
      formatPrice(
        listing.price_amount as number,
        listing.price_unit_label as string,
      ),
    );
  }, [formatPrice, listing.price_amount, listing.price_unit_label]);

  const listingUrl = `/${listing.kind}/${listing.listing_code.replace(/^[A-Z]-/, "")}`;

  return (
    <div
      className={cn(
        "group bg-card border border-border rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4",
        className,
      )}
    >
      {/* Image Section */}
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        {listing.is_featured && (
          <Badge
            variant="destructive"
            className="absolute top-3 left-3 z-10 font-semibold"
          >
            {translations ? translations["featured"] : "Featured"}
          </Badge>
        )}
        {!imageError ? (
          <Image
            src={mainImage}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
            <Building2 className="h-12 w-12" />
          </div>
        )}
        {/* Agency Logo - Mobile */}
        {listing.agency?.logo_url && (
          <div className="absolute bottom-3 right-3 md:hidden">
            <Image
              src={listing.agency.logo_url}
              alt={listing.agency.display_name}
              width={50}
              height={50}
              className="rounded border-2 border-background"
            />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 md:p-5">
        {/* Title */}
        <h3 className="font-bold text-lg md:text-xl mb-3 line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors">
          <Link href={listingUrl} className="hover:underline">
            {listing.title}
          </Link>
        </h3>

        {/* Location & Property Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
            <span className="line-clamp-1">
              {locale === "en"
                ? listing.township?.name_en || ""
                : listing.township?.name_mm || ""}
              {listing.township && listing.region && " | "}
              {locale === "en"
                ? listing.region?.name_en || ""
                : listing.region?.name_mm || ""}
            </span>
          </div>

          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
            <span>
              {locale === "en"
                ? listing.property_type?.name_en || ""
                : listing.property_type?.name_mm || ""}
              {listing.floor_label && ` | ${listing.floor_label}`}
            </span>
          </div>

          {listing.area_sqft && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Maximize2 className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
              <span>
                {translations["squareFeet"].replace(
                  "{area_sqft}",
                  listing.area_sqft.toString(),
                )}
              </span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="mb-4 pb-2">
          <p className="text-xl md:text-2xl font-bold text-primary">
            {formattedPrice || "Loading..."}{" "}
          </p>
          {listing.price_per_sqft && listing.area_sqft ? (
            <p className="text-sm text-muted-foreground mt-4">
              {translations["pricePerSquareFoot"]}{" "}
              {translations["pricePerSquareFootValue"].replace(
                "{value}",
                formatPrice(listing.price_per_sqft / listing.area_sqft),
              )}
            </p>
          ) : null}
        </div>

        {/* Agency Logo - Desktop */}
        {listing.agency?.logo_url && (
          <div className="hidden md:block border-t border-border">
            <Link
              href={`/agency/${listing.agency.id}`}
              className="inline-block"
            >
              <Image
                src={listing.agency.logo_url}
                alt={listing.agency.display_name}
                width={100}
                height={100}
                className="rounded border border-border hover:border-primary transition-colors"
              />
            </Link>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-border flex-wrap">
          <ButtonGroup className="w-full">
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
              }}
              className="flex-1"
            >
              <PlusIcon className="h-4 w-4 mr-2 transition-colors" />
              <span>{translations ? translations["compare"] : "Compare"}</span>
            </Button>
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                setIsFavorite(!isFavorite);
              }}
              className="flex-1"
            >
              <Heart
                className={cn(
                  "h-4 w-4 mr-2 transition-colors",
                  isFavorite && "fill-destructive text-destructive",
                )}
              />
              <span>
                {translations ? translations["favorite"] : "Favorite"}
              </span>
            </Button>
          </ButtonGroup>
          <Button className="flex-1 bg-primary hover:bg-primary/90" asChild>
            <Link href={listingUrl}>
              <Search className="h-4 w-4 mr-2" />
              <span>
                {translations ? translations["priceInquiry"] : "Price Inquiry"}
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
