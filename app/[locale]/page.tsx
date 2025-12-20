import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
// import { ThemeSwitcher } from "@/components/theme-switcher";
import { PropertySearchFilter } from "@/components/property-search-filter";
import { PropertyGrid } from "@/components/property-grid";
import { getRecentListings, getFeaturedListings } from "@/lib/db/listings";
import { hasEnvVars } from "@/lib/utils";
import { Suspense } from "react";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { TranslationProvider } from "@/context/TranslationContext";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";


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
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-bold text-lg">
              <Link href={"/"}>PlusEstate</Link>
            </div>
            {!hasEnvVars ? (
              <EnvVarWarning />
            ) : (
              <Suspense>
                <AuthButton />
              </Suspense>
            )}
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-12 md:gap-20 w-full">
          {/* Search Filter */}
          <TranslationProvider translations={translations['propertySearchFilterComponent']}>
            <div className="flex-1 w-full flex flex-col gap-12 md:gap-20 items-center bg-amber-200 py-13">
              <PropertySearchFilter locale={locale as "en" | "my"} />
            </div>
          </TranslationProvider>

          {/* Featured Listings */}
          <div className="p-4 md:p-6">
            <div className="flex-1 w-full flex flex-col gap-12 md:gap-20 items-center py-13">
              <TranslationProvider translations={translations['featuredListingComponent']}>
                {featuredListings.length > 0 && (
                  <section className="w-full max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl md:text-3xl font-bold">{translations['featuredListingComponent']['featuredListings']}</h2>
                      <Link href="/search?featured=true" className="text-primary hover:underline text-sm md:text-base flex justify-center items-center gap-2">
                        <span>{translations['featuredListingComponent']['viewAll']}</span> <ArrowRight size="15" />
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
              <TranslationProvider translations={translations['featuredListingComponent']}>
                {recentListings.length > 0 && (
                  <section className="w-full max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl md:text-3xl font-bold">{translations['featuredListingComponent']['recentListings']}</h2>
                      <Link href="/search" className="text-primary hover:underline text-sm md:text-base flex justify-center items-center gap-2">
                        <span>{translations['featuredListingComponent']['viewAll']}</span> <ArrowRight size="15" />
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
    </main>
  );
}
