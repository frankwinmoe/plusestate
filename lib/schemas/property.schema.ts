import { z } from "zod";

export const propertyCreateSchema = z.object({
  listing_code: z.string().optional(),

  kind: z.enum(["sale", "rent", "new_launch", "hostel"]),
  status: z.enum(["draft", "published", "archived"]),
  is_featured: z.boolean(),

  title: z.string().min(5).optional(),
  description: z.string().optional(),

  region_id: z.number().int().optional(),
  township_id: z.number().int().optional(),
  property_type_id: z.number().int().optional(),

  bedrooms: z.number().int().nullable(),
  bathrooms: z.number().int().nullable(),
  floor_label: z.string().optional(),

  width_ft: z.number().nullable(),
  length_ft: z.number().nullable(),
  area_sqft: z.number().int().nullable(),
  area_label: z.string().optional(),

  currency: z.enum(["MMK", "USD", "THB"]),
  price_amount: z.number().nullable(),
  price_unit_label: z.string(),
  price_per_sqft: z.number().nullable(),

  address_text: z.string().optional(),
  agency_id: z.uuid().optional(),
});

export type PropertyCreateInput = z.infer<typeof propertyCreateSchema>;
