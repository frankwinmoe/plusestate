// libraries
import { ArrowRight } from "lucide-react";
import { getLocale, getMessages } from "next-intl/server";

// components
import { PropertySearchFilter } from "@/components/forms/property-search-filter";
import { PropertyGrid } from "@/components/customs/property-grid";

// @ libraries
import { Link } from "@/i18n/navigation";
import { getRecentListings, getFeaturedListings } from "@/lib/db/listings";
import { TranslationProvider } from "@/context/TranslationContext";

export default async function Home() {
  // Determine locale and translations
  const locale = await getLocale();
  const translations = await getMessages({ locale });

  // Fetch listings for homepage
  const [featuredListings, recentListings] = await Promise.all([
    getFeaturedListings(6),
    getRecentListings(12),
  ]);

  return (
    <div className="w-full">
      <div className="flex-1 flex flex-col gap-12 md:gap-20 w-full">
        {/* Search Filter */}
        <TranslationProvider
          translations={translations["propertySearchFilterComponent"]}
        >
          <div
            className="relative flex-1 w-full flex flex-col gap-12 md:gap-10 items-center py-40 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/hero.jpg')" }}
          >
            {/* overlay */}
            <div className="absolute inset-0 bg-black/50" />
            {/* Content */}
            <div className="relative z-10 text-center px-4 md:px-0">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-10">
                {
                  translations.propertySearchFilterComponent
                    .findYourDreamProperty
                }
              </h3>
              <PropertySearchFilter locale={locale as "en" | "my"} />
            </div>
          </div>
        </TranslationProvider>

        {/* Featured Listings */}
        <div className="p-4 md:p-6">
          <div className="flex-1 w-full flex flex-col gap-12 md:gap-20 items-center py-13">
            <TranslationProvider
              translations={translations["propertyDetailsPage"]}
            >
              {featuredListings.length > 0 && (
                <section className="w-full max-w-7xl mx-auto">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold">
                      {
                        translations["featuredListingComponent"][
                          "featuredListings"
                        ]
                      }
                    </h2>
                    <Link
                      href="/search?featured=true"
                      className="text-primary hover:underline text-sm md:text-base flex justify-center items-center gap-2"
                    >
                      <span>
                        {translations["featuredListingComponent"]["viewAll"]}
                      </span>{" "}
                      <ArrowRight size="15" />
                    </Link>
                  </div>
                  <PropertyGrid listings={featuredListings} />
                </section>
              )}
            </TranslationProvider>
          </div>
        </div>

        {/* Recent Listings */}
        <div className="p-4 md:p-6">
          <div className="flex-1 w-full flex flex-col gap-12 md:gap-20 items-center py-13">
            <TranslationProvider
              translations={translations["propertyDetailsPage"]}
            >
              {recentListings.length > 0 && (
                <section className="w-full max-w-7xl mx-auto">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold">
                      {
                        translations["featuredListingComponent"][
                          "recentListings"
                        ]
                      }
                    </h2>
                    <Link
                      href="/search"
                      className="text-primary hover:underline text-sm md:text-base flex justify-center items-center gap-2"
                    >
                      <span>
                        {translations["featuredListingComponent"]["viewAll"]}
                      </span>{" "}
                      <ArrowRight size="15" />
                    </Link>
                  </div>
                  <PropertyGrid listings={recentListings} />
                </section>
              )}
            </TranslationProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
