import type { Metadata } from "next";
import { headers } from 'next/headers';
import { ThemeProvider } from "next-themes";
import "./globals.css";

// Components
import Navbar from "@/components/navbar";

// i18n
import { routing } from '@/i18n/routing';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Generate static params for locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Determine default URL for metadata
const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

// Metadata
export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Plus Estate - Real Estate Platform",
  description: "Discover your dream property with Plus Estate, the ultimate real estate platform for buying, selling, and renting homes worldwide.",
};
// Root layout props
interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export default async function RootLayout({ children, params }: Readonly<RootLayoutProps>) {
  // Validate locale
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  // Load locale messages
  const messages = await getMessages({ locale });

  // Extract the full pathname from headers
  const currentHeaders = headers();
  const referer = (await currentHeaders).get('referer') || defaultUrl;
  const url = new URL(referer);
  const pathname = url.pathname;
  const pathnameList = pathname.split('/');
  const isProtectedRoute = pathnameList.includes("protected");
  console.log(pathnameList)
  console.log("Is protected route:", isProtectedRoute);

  // Render layout
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <main className="min-h-screen flex flex-col items-center">
              <div className="flex-1 w-full flex flex-col items-center">
                {!isProtectedRoute && <Navbar />}
                {children}
              </div>
            </main>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
