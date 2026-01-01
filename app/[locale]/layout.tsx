import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { notFound } from "next/navigation";
import "./globals.css";

// i18n
import { routing } from "@/i18n/routing";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";

// Context
import { AppContextProvider } from "@/context/AppContext";

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
  description:
    "Discover your dream property with Plus Estate, the ultimate real estate platform for buying, selling, and renting homes worldwide.",
};

// Root layout props
interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({
  children,
  params,
}: Readonly<RootLayoutProps>) {
  // Validate locale
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Load locale messages
  const messages = await getMessages({ locale });

  // Render layout
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AppContextProvider>{children}</AppContextProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
