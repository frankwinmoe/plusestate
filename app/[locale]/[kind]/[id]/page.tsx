import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Building2, Maximize2, Heart, Phone, MessageCircle, Share2, Flag, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/copy-button";
import { getListingById, incrementListingViews } from "@/lib/db/listings";
import { formatDistanceToNow } from "date-fns";
import { myLocale } from "@/lib/utils/date";

interface PropertyDetailsPageProps {
  params: Promise<{
    kind: string;
    id: string;
  }>;
}

export default async function PropertyDetailsPage({
  params,
}: PropertyDetailsPageProps) {
  const { kind, id } = await params;

  // Find listing by code (format: S-15385164 or just 15385164)
  const listingCode = `${kind.charAt(0).toUpperCase()}-${id}`;

  // Search by listing_code (e.g., S-15385164) or fallback to ID
  const listing = await getListingById(listingCode) || await getListingById(id);

  if (!listing) {
    notFound();
  }

  // Increment view count (fire and forget)
  incrementListingViews(listing.id).catch(console.error);

  const mainImage =
    listing.images && listing.images.length > 0
      ? listing.images[0].image_url
      : "/placeholder-property.jpg";

  const formatPrice = () => {
    if (!listing.price_amount) return "ဈေးနှုန်း မေးမြန်းရန်";
    const formatted = listing.price_amount.toLocaleString("my-MM");
    return `${formatted} ${listing.price_unit_label || "ကျပ်"}`;
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
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        {/* Header Info Bar */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm">
            <div className="flex flex-wrap gap-4 md:gap-6">
              {listing.published_at && (
                <span>
                  <b>{formatDate(listing.published_at)}</b>
                  <span className="text-muted-foreground ml-1">
                    တွင်ကြော်ငြာတင်ခဲ့သည်
                  </span>
                </span>
              )}
              <span>
                <b>{listing.views_count}</b>
                <span className="text-muted-foreground ml-1">
                  ကြိမ် ကြည့်ရှု့ပြီး
                </span>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-muted-foreground">ကြော်ငြာနံပါတ်</span>
                <b id="adNo">{listing.listing_code}</b>
                <CopyButton listingCode={listing.listing_code} />
                <svg
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                    အထူးကြော်ငြာ
                  </Badge>
                )}
              </div>
              {listing.images && listing.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-4">
                  {listing.images.slice(1, 5).map((image) => (
                    <div
                      key={image.id}
                      className="relative aspect-square rounded overflow-hidden bg-muted"
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
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">
                      {listing.township?.name_mm || ""}
                      {listing.township && listing.region && " | "}
                      {listing.region?.name_mm || ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">
                      {listing.property_type?.name_mm || ""}
                      {listing.floor_label && ` | ${listing.floor_label}`}
                    </p>
                  </div>
                </div>

                {(listing.width_ft || listing.length_ft || listing.area_sqft) && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Maximize2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      {listing.width_ft && listing.length_ft && (
                        <p className="font-semibold text-lg mb-1">
                          {listing.width_ft} ပေ x {listing.length_ft} ပေ
                        </p>
                      )}
                      {listing.area_sqft && (
                        <p className="font-semibold text-lg">
                          {listing.area_label || `${listing.area_sqft} စတုရန်းပေ`}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Section */}
              <div className="border-t border-border pt-6 space-y-3">
                <div>
                  <span className="text-muted-foreground text-sm flex items-center gap-2 mb-2">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    ဈေးနှုန်း
                  </span>
                  <p className="text-3xl md:text-4xl font-bold text-primary">
                    {formatPrice()}
                  </p>
                </div>
                {listing.price_per_sqft && (
                  <div>
                    <span className="text-muted-foreground text-sm flex items-center gap-2 mb-2">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      တစ်စတုရန်းပေ ဈေးနှုန်း
                    </span>
                    <p className="text-2xl font-bold text-primary">
                      {listing.price_per_sqft.toFixed(1)} သိန်း (ကျပ်)
                    </p>
                  </div>
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
                အချက်အလက်များ
              </h4>
              <ul className="space-y-2">
                {listing.bedrooms && (
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>အိပ်ခန်း {listing.bedrooms} ခန်း</span>
                  </li>
                )}
                {listing.bathrooms && (
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>ရေချိုးခန်း {listing.bathrooms} ခန်း</span>
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>ဆောက်လုပ်ပြီး</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>အလုံးစုံ ပြင်ဆင်ပြီး</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Actions */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <Button
                className="w-full h-12 text-base font-semibold"
                size="lg"
              >
                <Phone className="h-5 w-5 mr-2" />
                ကြော်ငြာပိုင်ရှင်သို့ ဖုန်းဖြင့် ဆက်သွယ်ရန်
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 text-base font-semibold"
                size="lg"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                ကြော်ငြာပိုင်ရှင်နှင့် Chatting စကားပြောရန်
              </Button>
            </div>

            {/* Agency Info */}
            {listing.agency && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h4 className="font-bold text-lg mb-4">အေဂျင်စီ</h4>
                <div className="flex items-center gap-4">
                  {listing.agency.logo_url && (
                    <Image
                      src={listing.agency.logo_url}
                      alt={listing.agency.display_name}
                      width={80}
                      height={80}
                      className="rounded border border-border"
                    />
                  )}
                  <div>
                    <p className="font-semibold">{listing.agency.display_name}</p>
                    {listing.agency.phone && (
                      <p className="text-sm text-muted-foreground">
                        {listing.agency.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="flex-1 min-w-[120px]">
                  <span className="mr-2">+</span>
                  နှိုင်းယှဥ်ရန်
                </Button>
                <Button variant="outline" size="sm" className="flex-1 min-w-[120px]">
                  <Heart className="h-4 w-4 mr-2" />
                  နှစ်သက်
                </Button>
                <Button variant="outline" size="sm" className="flex-1 min-w-[120px]">
                  <Share2 className="h-4 w-4 mr-2" />
                  မျှဝေရန်
                </Button>
                <Button variant="outline" size="sm" className="flex-1 min-w-[120px]">
                  <Flag className="h-4 w-4 mr-2" />
                  Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

