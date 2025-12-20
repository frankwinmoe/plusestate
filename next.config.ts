import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  // cacheComponents: true,
  images: {
    domains: [
      'scontent.fbkk12-2.fna.fbcdn.net',
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);

