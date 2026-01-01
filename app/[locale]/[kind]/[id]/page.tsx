import { notFound } from "next/navigation";
import Image from "next/image";
import {
  MapPin,
  Building2,
  Maximize2,
  Heart,
  Phone,
  MessageCircle,
  Share2,
  Flag,
  CheckCircle2,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/copy-button";
import { getListingById, incrementListingViews } from "@/lib/db/listings";
import { formatDistanceToNow } from "date-fns";
import { getLocale, getMessages } from "next-intl/server";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";

interface PropertyDetailsPageProps {
  params: Promise<{
    kind: string;
    id: string;
  }>;
}

export default async function PropertyDetailsPage({
  params,
}: PropertyDetailsPageProps) {
  // Extract kind and id from params
  const { kind, id } = await params;

  // set translation
  const locale = await getLocale();
  const translations = await getMessages({ locale });
  const pageTranslations = translations["propertyDetailsPage"];

  // Find listing by code (format: S-15385164 or just 15385164)
  const listingCode = `${kind.charAt(0).toUpperCase()}-${id}`;
  // Search by listing_code (e.g., S-15385164) or fallback to ID
  const listing =
    (await getListingById(listingCode)) || (await getListingById(id));

  if (!listing) {
    notFound();
  }

  // Increment view count (fire and forget)
  incrementListingViews(listing.id).catch(console.error);
  // set main image
  const mainImage =
    listing.images && listing.images.length > 0
      ? listing.images[0].image_url
      : "/placeholder-property.jpg";

  const formatPrice = () => {
    if (!listing.price_amount) return pageTranslations["priceInquiry"];
    // local formatting for Myanmar Kyat
    let formatUnit = "en-US";
    if (locale === "my") formatUnit = "my-MM";
    // format price with locale
    const formatted = listing.price_amount.toLocaleString(formatUnit);
    if (!listing.price_unit_label) {
      return `${formatted} ${pageTranslations["currencyUnit"]}`;
    }
    // if price unit label is lakhs or crores, convert to Myanmar language
    // e.g., lakhs -> သိန်း, crores -> ကျပ်သောင်း
    if (listing.price_unit_label === "Lakhs") {
      return `${locale === "my" ? "သိန်း" : "Lakhs"} ${formatted}`;
    }

    return `${formatted} ${pageTranslations["currencyUnit"]}`;
  };

  const formatPricePerSqft = () => {
    if (!listing.price_per_sqft) return "";
    // local formatting for Myanmar Kyat
    let formatUnit = "en-US";
    if (locale === "my") formatUnit = "my-MM";
    // format price with locale
    const formatted = listing.price_per_sqft.toLocaleString(formatUnit);
    return formatted;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
      });
    } catch {
      return new Date(dateString).toLocaleDateString("my-MM");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 max-w-7xl">
        {/* Header Info Bar */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6 w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm">
            <div className="flex flex-wrap gap-4 md:gap-6">
              {listing.published_at && (
                <span>
                  <b>{formatDate(listing.published_at)}</b>
                  <span className="text-muted-foreground ml-1">
                    {pageTranslations["postedAgo"]}
                  </span>
                </span>
              )}
              <span>
                <b>{listing.views_count}</b>
                <span className="text-muted-foreground ml-1">
                  {pageTranslations["viewed"]}
                </span>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-muted-foreground">
                  {pageTranslations["advertisementNo"]}
                </span>
                <b id="adNo">{listing.listing_code}</b>
                <CopyButton listingCode={listing.listing_code} />
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 w-full">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="relative aspect-video bg-muted">
                <Image
                  src={mainImage}
                  alt={listing.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
                {listing.is_featured && (
                  <Badge
                    variant="destructive"
                    className="absolute top-4 left-4 font-semibold"
                  >
                    {pageTranslations["featured"]}
                  </Badge>
                )}
              </div>
              {listing.images && listing.images.length > 1 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-3 sm:p-4">
                  {listing.images.slice(1, 5).map((image) => (
                    <div
                      key={image.id}
                      className="relative aspect-square rounded-md overflow-hidden bg-muted"
                    >
                      <Image
                        src={image.image_url}
                        alt={`${listing.title} - Image ${image.sort_order}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 25vw, 16vw"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Property Info */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-1 rounded-full bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      {locale == "my"
                        ? listing.township?.name_mm
                        : listing.township?.name_en || ""}
                      {listing.township && listing.region && " | "}
                      {locale == "my"
                        ? listing.region?.name_mm
                        : listing.region?.name_en || ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-1 rounded-full bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      {locale == "my"
                        ? listing.property_type?.name_mm
                        : listing.property_type?.name_en || ""}
                      {listing.floor_label && ` | ${listing.floor_label}`}
                    </p>
                  </div>
                </div>

                {(listing.width_ft ||
                  listing.length_ft ||
                  listing.area_sqft) && (
                  <div className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-primary/10">
                      <Maximize2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      {listing.width_ft && listing.length_ft && (
                        <p className="font-semibold text-sm mb-1">
                          {pageTranslations["widthxlengthFt"]
                            .replace("{width_ft}", listing.width_ft)
                            .replace("{length_ft}", listing.length_ft)}
                        </p>
                      )}
                      {listing.area_sqft && (
                        <p className="font-semibold text-sm">
                          {listing.area_label ||
                            pageTranslations["squareFeet"].replace(
                              "{area_sqft}",
                              listing.area_sqft,
                            )}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Section */}
              <div className="border-t border-border pt-6 space-y-3">
                <Item variant={"muted"}>
                  <ItemContent className="p-0 m-0">
                    <ItemTitle>
                      <span className="text-muted-foreground text-sm flex items-center gap-2 mb-2">
                        <Tag className="h-5 w-5 text-primary" />
                        {pageTranslations["price"]}
                      </span>
                    </ItemTitle>
                    <ItemDescription className="text-xl font-bold text-primary min-h-[44px] leading-[1.2] flex items-center">
                      {formatPrice()}
                    </ItemDescription>
                  </ItemContent>
                </Item>

                {listing.price_per_sqft && (
                  <Item variant={"muted"}>
                    <ItemContent className="p-0 m-0">
                      <ItemTitle>
                        <span className="text-muted-foreground text-sm flex items-center gap-2 mb-2">
                          <Tag className="h-5 w-5 text-primary" />
                          {pageTranslations["pricePerSquareFoot"]}
                        </span>
                      </ItemTitle>
                      <ItemDescription className="text-xl font-bold text-primary min-h-[44px] leading-[1.2] flex items-center">
                        {pageTranslations["pricePerSquareFootValue"].replace(
                          "{value}",
                          formatPricePerSqft(),
                        )}
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                )}
              </div>
            </div>

            {/* Description */}
            {listing.description && (
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="relative">
                  <p className="text-base leading-relaxed whitespace-pre-line">
                    {listing.description}
                  </p>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="font-bold text-lg mb-4 border-b border-border pb-4">
                {pageTranslations["informations"]}
              </h4>
              <ul className="space-y-2">
                {listing.bedrooms && (
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>
                      {pageTranslations["bedrooms"]} {listing.bedrooms}{" "}
                      {pageTranslations["rooms"]}
                    </span>
                  </li>
                )}
                {listing.bathrooms && (
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>
                      {pageTranslations["bathrooms"]} {listing.bathrooms}{" "}
                      {pageTranslations["rooms"]}
                    </span>
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>{pageTranslations["constructed"]}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>{pageTranslations["renovated"]}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 w-full">
            {/* Contact Actions */}
            <div className="bg-card border border-border rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4 sticky bottom-0 lg:static z-20">
              <Button className="w-full h-12 text-base font-semibold" size="lg">
                <Phone className="h-5 w-5 mr-2" />
                {pageTranslations["contactOwner"]}
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 text-base font-semibold"
                size="lg"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                {pageTranslations["chatWithOwner"]}
              </Button>
            </div>

            {/* Agency Info */}
            {listing.agency && (
              <Item variant={"outline"}>
                <ItemContent className="p-0 m-0">
                  <ItemTitle>
                    <span className="text-muted-foreground text-sm flex items-center gap-2 mb-2">
                      {pageTranslations["agency"]}
                    </span>
                  </ItemTitle>
                  <ItemDescription className="text-xl font-bold text-primary flex items-center gap-2">
                    {listing.agency.logo_url && (
                      <Image
                        src={listing.agency.logo_url}
                        alt={listing.agency.display_name}
                        width={80}
                        height={80}
                        className="rounded border border-border"
                      />
                    )}
                    <p className="font-semibold flex flex-col gap-1">
                      {listing.agency.display_name}
                      {listing.agency.phone && (
                        <p className="text-sm text-muted-foreground">
                          {listing.agency.phone}
                        </p>
                      )}
                    </p>
                  </ItemDescription>
                </ItemContent>
              </Item>
            )}

            {/* Action Buttons */}
            <div className="bg-card border border-border rounded-lg p-[16px]">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="flex-1 min-w-[120px] hover:bg-blue-500 hover:text-white"
                >
                  <span className="mr-2">+</span>
                  {pageTranslations["compare"]}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 min-w-[120px] hover:bg-red-500 hover:text-white"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  {pageTranslations["favorite"]}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 min-w-[120px] hover:bg-green-500 hover:text-white"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  {pageTranslations["share"]}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 min-w-[120px] hover:bg-amber-700 hover:text-white"
                >
                  <Flag className="h-4 w-4 mr-2" />
                  {pageTranslations["report"]}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
