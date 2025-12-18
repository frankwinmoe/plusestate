import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { PropertySearchFilter } from "@/components/property-search-filter";
import { PropertyGrid } from "@/components/property-grid";
import { getRecentListings, getFeaturedListings } from "@/lib/db/listings";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";

export default async function Home() {
  // Fetch listings for homepage
  const [featuredListings, recentListings] = await Promise.all([
    getFeaturedListings(6),
    getRecentListings(12),
  ]);

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-12 md:gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>PlusEstate</Link>
              <div className="flex items-center gap-2">
                <DeployButton />
              </div>
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
        <div className="flex-1 flex flex-col gap-12 md:gap-16 w-full p-4 md:p-6 max-w-7xl">
          {/* Search Filter */}
          <div className="w-full">
            <PropertySearchFilter />
          </div>

          {/* Featured Listings */}
          {featuredListings.length > 0 && (
            <section className="w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">အထူးကြော်ငြာများ</h2>
                <Link
                  href="/search?featured=true"
                  className="text-primary hover:underline text-sm md:text-base"
                >
                  အားလုံးကြည့်ရန် →
                </Link>
              </div>
              <PropertyGrid listings={featuredListings} />
            </section>
          )}

          {/* Recent Listings */}
          {recentListings.length > 0 && (
            <section className="w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">နောက်ဆုံးကြော်ငြာများ</h2>
                <Link
                  href="/search"
                  className="text-primary hover:underline text-sm md:text-base"
                >
                  အားလုံးကြည့်ရန် →
                </Link>
              </div>
              <PropertyGrid listings={recentListings} />
            </section>
          )}

          {/* Tutorial Section (only if no listings) */}
          {featuredListings.length === 0 && recentListings.length === 0 && (
            <div className="flex-1 flex flex-col gap-20 max-w-5xl w-full">
              <Hero />
              <main className="flex-1 flex flex-col gap-6 px-4">
                <h2 className="font-medium text-xl mb-4">Next steps</h2>
                {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
              </main>
            </div>
          )}
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
