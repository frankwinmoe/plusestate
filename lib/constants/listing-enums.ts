// lib/constants/listing-enums.ts

export const LISTING_KINDS = [
    "sale",
    "rent",
    "new_launch",
    "hostel",
] as const;

export const LISTING_STATUSES = [
    "draft",
    "published",
    "archived",
] as const;

export const CURRENCY_CODES = [
    "MMK",
    "USD",
    "THB",
] as const;

export type ListingKind = typeof LISTING_KINDS[number];
export type ListingStatus = typeof LISTING_STATUSES[number];
export type CurrencyCode = typeof CURRENCY_CODES[number];
