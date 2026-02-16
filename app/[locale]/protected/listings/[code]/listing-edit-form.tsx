"use client";

import { useEffect, useState, useRef } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  propertyCreateSchema,
  PropertyCreateInput,
} from "@/lib/schemas/property.schema";
import * as select from "@/components/ui/select";
import { useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { FormCombobox } from "@/components/ui/form-combobox";
import {
  ImageUploader,
  type ImageUploaderRef,
} from "@/components/property/ImageUploader";
import Loader from "@/components/customs/loader";
import { toast } from "sonner";

type Region = { id: number; name_mm: string; name_en?: string };
type Township = { id: number; region_id: number; name_mm: string; name_en?: string };
type PropertyType = { id: number; name_mm: string; name_en?: string };

type ListingForEdit = {
  id: string;
  listing_code: string;
  kind: string;
  status: string;
  is_featured: boolean;
  title: string;
  description: string | null;
  region_id: number;
  township_id: number | null;
  property_type_id: number | null;
  floor_label: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  width_ft: number | null;
  length_ft: number | null;
  area_sqft: number | null;
  area_label: string | null;
  currency: string;
  price_amount: number | null;
  price_unit_label: string | null;
  price_per_sqft: number | null;
  address_text: string | null;
  agency_id: string | null;
};

export function ListingEditForm({
  listing,
  locale,
}: {
  listing: ListingForEdit;
  locale: string;
}) {
  const supabase = createClient();
  const localeHook = useLocale();
  const [regions, setRegions] = useState<Region[]>([]);
  const [townships, setTownships] = useState<Township[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const imageUploaderRef = useRef<ImageUploaderRef>(null);

  const form = useForm<PropertyCreateInput>({
    resolver: zodResolver(propertyCreateSchema),
    defaultValues: {
      kind: (listing.kind as PropertyCreateInput["kind"]) ?? "sale",
      status: (listing.status as PropertyCreateInput["status"]) ?? "draft",
      is_featured: listing.is_featured ?? false,
      currency: (listing.currency as PropertyCreateInput["currency"]) ?? "MMK",
      price_unit_label: listing.price_unit_label ?? "Lakh",
      listing_code: listing.listing_code ?? "",
      title: listing.title ?? "",
      description: listing.description ?? "",
      region_id: listing.region_id ?? 0,
      township_id: listing.township_id ?? undefined,
      property_type_id: listing.property_type_id ?? undefined,
      bedrooms: listing.bedrooms ?? null,
      bathrooms: listing.bathrooms ?? null,
      floor_label: listing.floor_label ?? "",
      width_ft: listing.width_ft ?? null,
      length_ft: listing.length_ft ?? null,
      area_sqft: listing.area_sqft ?? null,
      area_label: listing.area_label ?? "",
      price_amount: listing.price_amount ?? null,
      price_per_sqft: listing.price_per_sqft ?? null,
      address_text: listing.address_text ?? "",
      agency_id: listing.agency_id ?? undefined,
    } as Partial<PropertyCreateInput>,
  });

  const regionId = form.watch("region_id");

  useEffect(() => {
    async function loadRefs() {
      const [{ data: r }, { data: p }] = await Promise.all([
        supabase.from("regions").select("id, name_mm, name_en").order("sort_order"),
        supabase.from("property_types").select("id, name_mm, name_en").order("sort_order"),
      ]);
      setRegions(r ?? []);
      setPropertyTypes(p ?? []);
      setLoading(false);
    }
    loadRefs();
  }, [supabase]);

  useEffect(() => {
    if (!regionId) return setTownships([]);
    supabase
      .from("townships")
      .select("id, region_id, name_mm, name_en")
      .eq("region_id", regionId)
      .order("sort_order")
      .then(({ data }) => {
        setTownships(data ?? []);
        if (listing.region_id !== regionId) form.setValue("township_id", undefined);
      });
  }, [regionId, supabase, listing.region_id, form]);

  const onSubmit: SubmitHandler<PropertyCreateInput> = async (values) => {
    try {
      setSubmitting(true);
      const base = `/${locale}/api/listings`;
      const res = await fetch(`${base}/${listing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to update listing");
      }
      const urls = (await imageUploaderRef.current?.upload()) ?? [];
      if (urls.length) {
        const imgRes = await fetch(`${base}/${listing.listing_code}/images`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(urls.map((image_url) => ({ image_url }))),
        });
        if (!imgRes.ok) toast.error("Listing saved but some images failed to save.");
      }
      toast.success("Listing updated");
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  const loc = localeHook ?? locale;

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-3 gap-4">
            <Input placeholder="Listing Code" {...form.register("listing_code")} />
            <Controller
              control={form.control}
              name="kind"
              render={({ field }) => (
                <select.Select value={field.value} onValueChange={field.onChange}>
                  <select.SelectTrigger className="w-full">
                    <select.SelectValue placeholder="Kind" />
                  </select.SelectTrigger>
                  <select.SelectContent>
                    <select.SelectItem value="sale">Sale</select.SelectItem>
                    <select.SelectItem value="rent">Rent</select.SelectItem>
                    <select.SelectItem value="new_launch">New Launch</select.SelectItem>
                    <select.SelectItem value="hostel">Hostel</select.SelectItem>
                  </select.SelectContent>
                </select.Select>
              )}
            />
            <Controller
              control={form.control}
              name="status"
              render={({ field }) => (
                <select.Select value={field.value} onValueChange={field.onChange}>
                  <select.SelectTrigger className="w-full">
                    <select.SelectValue placeholder="Status" />
                  </select.SelectTrigger>
                  <select.SelectContent>
                    <select.SelectItem value="draft">Draft</select.SelectItem>
                    <select.SelectItem value="published">Published</select.SelectItem>
                    <select.SelectItem value="archived">Archived</select.SelectItem>
                  </select.SelectContent>
                </select.Select>
              )}
            />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" {...form.register("is_featured")} />
            Featured
          </label>
          <Input placeholder="Title" {...form.register("title")} />
          <textarea
            placeholder="Description"
            {...form.register("description")}
            className="w-full min-h-[120px] rounded-md border p-3"
          />
          <div className="grid grid-cols-3 gap-4">
            <Controller
              control={form.control}
              name="region_id"
              render={({ field }) => (
                <FormCombobox
                  value={field.value}
                  onChangeAction={field.onChange}
                  placeholder="Region"
                  options={regions.map((r) => ({
                    value: r.id,
                    label: loc === "en" && r.name_en ? r.name_en : r.name_mm,
                  }))}
                />
              )}
            />
            <Controller
              control={form.control}
              name="township_id"
              render={({ field }) => (
                <FormCombobox
                  value={field.value}
                  onChangeAction={field.onChange}
                  disabled={!regionId}
                  placeholder="Township"
                  options={townships.map((t) => ({
                    value: t.id,
                    label: loc === "en" && t.name_en ? t.name_en : t.name_mm,
                  }))}
                />
              )}
            />
            <Controller
              control={form.control}
              name="property_type_id"
              render={({ field }) => (
                <FormCombobox
                  value={field.value}
                  onChangeAction={field.onChange}
                  placeholder="Property type"
                  options={propertyTypes.map((p) => ({
                    value: p.id,
                    label: loc === "en" && p.name_en ? p.name_en : p.name_mm,
                  }))}
                />
              )}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input type="number" placeholder="Bedrooms" {...form.register("bedrooms", { valueAsNumber: true })} />
            <Input type="number" placeholder="Bathrooms" {...form.register("bathrooms", { valueAsNumber: true })} />
            <Input placeholder="Floor" {...form.register("floor_label")} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <Input type="number" placeholder="Width (ft)" {...form.register("width_ft", { valueAsNumber: true })} />
            <Input type="number" placeholder="Length (ft)" {...form.register("length_ft", { valueAsNumber: true })} />
            <Input type="number" placeholder="Area (sqft)" {...form.register("area_sqft", { valueAsNumber: true })} />
            <Input placeholder="Area label" {...form.register("area_label")} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <Controller
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormCombobox
                  value={field.value}
                  onChangeAction={field.onChange}
                  placeholder="Currency"
                  options={[
                    { value: "MMK", label: "MMK" },
                    { value: "USD", label: "USD" },
                    { value: "THB", label: "THB" },
                  ]}
                />
              )}
            />
            <Input type="number" placeholder="Price" {...form.register("price_amount", { valueAsNumber: true })} />
            <Input placeholder="Unit" {...form.register("price_unit_label")} />
            <Input type="number" placeholder="Price/sqft" {...form.register("price_per_sqft", { valueAsNumber: true })} />
          </div>
          <Input placeholder="Address" {...form.register("address_text")} />
          <Input placeholder="Agency ID" {...form.register("agency_id")} />
          <div>
            <p className="text-sm text-muted-foreground mb-2">Add more images</p>
            <ImageUploader ref={imageUploaderRef} folder={listing.listing_code} />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={submitting || imageUploaderRef.current?.uploading}
          >
            {submitting || imageUploaderRef.current?.uploading ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
