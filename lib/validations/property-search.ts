import { z } from "zod";

export const propertySearchSchema = z.object({
    query: z.string().optional(),
    type: z.enum(["sale", "rent", "new_launch", "hostels"]),
    // Filters
    region: z.string(),
    township: z.string(),
    // Options
    propertyType: z.string().optional(),
    hostelType: z.string().optional(),
    hostelFormat: z.string().optional(),
    // Beds
    minBed: z.string().optional(),
    maxBed: z.string().optional(),
    // Price options
    priceFrom: z.string().optional(),
    priceTo: z.string().optional(),
});

export type PropertySearchForm = z.infer<typeof propertySearchSchema>;
