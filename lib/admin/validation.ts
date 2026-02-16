import { z } from "zod";
import type { AdminTableSlug } from "./schema-config";

export const regionSchema = z.object({
  id: z.number().int().optional(),
  name_mm: z.string().min(1),
  name_en: z.string().nullable().optional(),
  sort_order: z.number().int().optional(),
});

export const townshipSchema = z.object({
  region_id: z.number().int(),
  name_mm: z.string().min(1),
  name_en: z.string().nullable().optional(),
  sort_order: z.number().int().optional(),
});

export const propertyTypeSchema = z.object({
  id: z.number().int().optional(),
  name_mm: z.string().min(1),
  name_en: z.string().nullable().optional(),
  sort_order: z.number().int().optional(),
});

export const agencySchema = z.object({
  display_name: z.string().min(1),
  logo_url: z.string().url().nullable().optional().or(z.literal("")),
  phone: z.string().nullable().optional(),
  email: z.string().email().nullable().optional().or(z.literal("")),
});

export const listingSchema = z.object({
  listing_code: z.string().min(1).optional(),
  kind: z.enum(["sale", "rent", "new_launch", "hostel"]),
  status: z.enum(["draft", "published", "archived"]),
  is_featured: z.boolean().optional(),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  region_id: z.number().int(),
  township_id: z.number().int().nullable().optional(),
  property_type_id: z.number().int().nullable().optional(),
  floor_label: z.string().nullable().optional(),
  bedrooms: z.number().int().nullable().optional(),
  bathrooms: z.number().int().nullable().optional(),
  width_ft: z.number().nullable().optional(),
  length_ft: z.number().nullable().optional(),
  area_sqft: z.number().int().nullable().optional(),
  area_label: z.string().nullable().optional(),
  currency: z.enum(["MMK", "USD", "THB"]),
  price_amount: z.number().nullable().optional(),
  price_unit_label: z.string().nullable().optional(),
  price_per_sqft: z.number().nullable().optional(),
  address_text: z.string().nullable().optional(),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
  agency_id: z.string().uuid().nullable().optional().or(z.literal("")),
  owner_user_id: z.string().uuid().nullable().optional().or(z.literal("")),
  views_count: z.number().int().optional(),
  published_at: z.string().nullable().optional().or(z.literal("")),
});

export const listingImageSchema = z.object({
  listing_id: z.string().uuid(),
  image_url: z.string().url().min(1),
  sort_order: z.number().int().optional(),
});

const slugToSchema: Partial<Record<AdminTableSlug, z.ZodType>> = {
  regions: regionSchema,
  townships: townshipSchema,
  "property-types": propertyTypeSchema,
  agencies: agencySchema,
  listings: listingSchema,
  "listing-images": listingImageSchema,
};

export function getValidationSchema(slug: AdminTableSlug): z.ZodType | null {
  return slugToSchema[slug] ?? null;
}

export type ValidateResult<T> =
  | { success: true; data: T }
  | { success: false; error: z.ZodError; message?: string };

export function validateAdminPayload<T>(
  slug: AdminTableSlug,
  payload: unknown
): ValidateResult<T> {
  const schema = getValidationSchema(slug);
  if (!schema) {
    const msg = `No validation schema for table slug: ${slug}`;
    const err = z.object({}).safeParse(undefined);
    const error = err.success ? new z.ZodError([{ code: "custom", path: [], message: msg }]) : err.error;
    return { success: false, error: error, message: msg };
  }
  const result = schema.safeParse(payload);
  if (result.success) return { success: true, data: result.data as T };
  return { success: false, error: result.error };
}
