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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FormCombobox } from "@/components/ui/form-combobox";

import {
  ImageUploader,
  type ImageUploaderRef,
} from "@/components/property/ImageUploader";
import SidebarHeader from "@/components/customs/sidebar-header";
import Loader from "@/components/customs/loader";
import { toast } from "sonner";

/* ---------------- Types ---------------- */
type Region = { id: number; name_mm: string; name_en?: string };
type Township = {
  id: number;
  region_id: number;
  name_mm: string;
  name_en?: string;
};
type PropertyType = { id: number; name_mm: string; name_en?: string };

/* ---------------- Page ---------------- */
export default function PropertyCreatePage() {
  const supabase = createClient();
  const locale = useLocale();

  const [regions, setRegions] = useState<Region[]>([]);
  const [townships, setTownships] = useState<Township[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [tempListingCode] = useState(
    () => `PROP-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  );

  const imageUploaderRef = useRef<ImageUploaderRef>(null);

  /* ---------- Form ---------- */
  const form = useForm<PropertyCreateInput>({
    resolver: zodResolver(propertyCreateSchema),
    defaultValues: {
      kind: "sale",
      status: "draft",
      is_featured: false,
      currency: "MMK",
      price_unit_label: "Lakh",

      listing_code: "",
      title: "",
      description: "",

      region_id: 0,
      township_id: 0,
      property_type_id: 0,

      bedrooms: null,
      bathrooms: null,
      floor_label: "",

      width_ft: null,
      length_ft: null,
      area_sqft: null,
      area_label: "",

      price_amount: null,
      price_per_sqft: null,

      address_text: "",
      agency_id: "461220a1-58b3-4ff9-9bde-f377b4846110",
    } as Partial<PropertyCreateInput>,
  });

  const regionId = form.watch("region_id");

  /* ---------- Load regions & property types ---------- */
  useEffect(() => {
    async function loadRefs() {
      const [{ data: r }, { data: p }] = await Promise.all([
        supabase
          .from("regions")
          .select("id, name_mm, name_en")
          .order("sort_order"),
        supabase
          .from("property_types")
          .select("id, name_mm, name_en")
          .order("sort_order"),
      ]);
      setRegions(r ?? []);
      setPropertyTypes(p ?? []);
      setLoading(false);
    }
    loadRefs();
  }, [supabase]);

  /* ---------- Load townships when region changes ---------- */
  useEffect(() => {
    if (!regionId) return setTownships([]);
    async function loadTownships() {
      const { data } = await supabase
        .from("townships")
        .select("id, region_id, name_mm, name_en")
        .eq("region_id", regionId)
        .order("sort_order");
      setTownships(data ?? []);
      form.setValue("township_id", undefined);
    }
    loadTownships();
  }, [regionId, supabase, form]);

  /* ---------- Submit ---------- */
  const onSubmit: SubmitHandler<PropertyCreateInput> = async (values) => {
    try {
      setSubmitting(true);

      // 1. Create listing
      const createRes = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!createRes.ok) throw new Error("Failed to create listing");

      const listing = await createRes.json();
      const listing_code = listing.listing_code;
      form.setValue("listing_code", listing_code);

      // 2. Upload images
      if (imageUploaderRef.current?.setFolder) {
        imageUploaderRef.current.setFolder(listing_code);
        console.log("Set image folder to:", listing_code);
      }
      const urls = (await imageUploaderRef.current?.upload()) ?? [];
      const images = urls.map((url) => ({ image_url: url }));

      // 3. Save images to DB
      if (images.length) {
        const imgRes = await fetch(`/api/listings/${listing_code}/images`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(images),
        });
        if (!imgRes.ok) throw new Error("Failed to save images");
      }

      toast.success("Listing created successfully");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  /* ---------- UI ---------- */
  return (
    <div>
      <SidebarHeader
        breadcrumb={[
          { title: "Dashboard", href: "/protected" },
          { title: "Listings", href: "/protected/listings" },
          { title: "Create", href: "/protected/listings/new" },
        ]}
      />

      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <h1 className="text-xl font-bold">Create Property Listing</h1>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* ---------- META ---------- */}
            <div className="grid grid-cols-3 gap-4">
              <Input
                placeholder="Listing Code"
                {...form.register("listing_code")}
              />
              <Controller
                control={form.control}
                name="kind"
                render={({ field }) => (
                  <select.Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <select.SelectTrigger className="w-full">
                      <select.SelectValue placeholder="Select Kind" />
                    </select.SelectTrigger>
                    <select.SelectContent>
                      <select.SelectGroup>
                        <select.SelectLabel>Kind</select.SelectLabel>
                        <select.SelectItem value="sale">Sale</select.SelectItem>
                        <select.SelectItem value="rent">Rent</select.SelectItem>
                        <select.SelectItem value="new_launch">
                          New Launch
                        </select.SelectItem>
                        <select.SelectItem value="hostel">
                          Hostel
                        </select.SelectItem>
                      </select.SelectGroup>
                    </select.SelectContent>
                  </select.Select>
                )}
              />
              <Controller
                control={form.control}
                name="status"
                render={({ field }) => (
                  <select.Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <select.SelectTrigger className="w-full">
                      <select.SelectValue placeholder="Select Status" />
                    </select.SelectTrigger>
                    <select.SelectContent>
                      <select.SelectGroup>
                        <select.SelectLabel>Status</select.SelectLabel>
                        <select.SelectItem value="draft">
                          Draft
                        </select.SelectItem>
                        <select.SelectItem value="published">
                          Published
                        </select.SelectItem>
                        <select.SelectItem value="archived">
                          Archived
                        </select.SelectItem>
                      </select.SelectGroup>
                    </select.SelectContent>
                  </select.Select>
                )}
              />
            </div>

            <label className="flex items-center gap-2">
              <input type="checkbox" {...form.register("is_featured")} />
              Featured Listing
            </label>

            {/* ---------- TITLE & DESC ---------- */}
            <Input placeholder="Title" {...form.register("title")} />
            <textarea
              placeholder="Description"
              {...form.register("description")}
              className="w-full min-h-[120px] rounded-md border p-3"
            />

            {/* ---------- LOCATION ---------- */}
            <div className="grid grid-cols-3 gap-4">
              <Controller
                control={form.control}
                name="region_id"
                render={({ field }) => (
                  <FormCombobox
                    value={field.value}
                    onChangeAction={field.onChange}
                    placeholder="Select Region"
                    options={regions.map((r) => ({
                      value: r.id,
                      label:
                        locale === "en" && r.name_en ? r.name_en : r.name_mm,
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
                    placeholder="Select Township"
                    options={townships.map((t) => ({
                      value: t.id,
                      label:
                        locale === "en" && t.name_en ? t.name_en : t.name_mm,
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
                    placeholder="Property Type"
                    options={propertyTypes.map((p) => ({
                      value: p.id,
                      label:
                        locale === "en" && p.name_en ? p.name_en : p.name_mm,
                    }))}
                  />
                )}
              />
            </div>

            {/* ---------- ROOMS ---------- */}
            <div className="grid grid-cols-3 gap-4">
              <Input
                type="number"
                placeholder="Bedrooms"
                {...form.register("bedrooms", { valueAsNumber: true })}
              />
              <Input
                type="number"
                placeholder="Bathrooms"
                {...form.register("bathrooms", { valueAsNumber: true })}
              />
              <Input
                placeholder="Floor Label"
                {...form.register("floor_label")}
              />
            </div>

            {/* ---------- SIZE ---------- */}
            <div className="grid grid-cols-4 gap-4">
              <Input
                type="number"
                placeholder="Width (ft)"
                {...form.register("width_ft", { valueAsNumber: true })}
              />
              <Input
                type="number"
                placeholder="Length (ft)"
                {...form.register("length_ft", { valueAsNumber: true })}
              />
              <Input
                type="number"
                placeholder="Area (sqft)"
                {...form.register("area_sqft", { valueAsNumber: true })}
              />
              <Input
                placeholder="Area Label"
                {...form.register("area_label")}
              />
            </div>

            {/* ---------- PRICE ---------- */}
            <div className="grid grid-cols-4 gap-4">
              <Controller
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormCombobox
                    value={field.value}
                    onChangeAction={field.onChange}
                    placeholder="Select Currency"
                    options={[
                      { value: "MMK", label: "Myanmar (Kyat)" },
                      { value: "USD", label: "USD" },
                      { value: "THB", label: "THB" },
                    ]}
                  />
                )}
              />
              <Input
                type="number"
                placeholder="Price Amount"
                {...form.register("price_amount", { valueAsNumber: true })}
              />
              <Input
                placeholder="Unit (Lakh)"
                {...form.register("price_unit_label")}
              />
              <Input
                type="number"
                placeholder="Price / sqft"
                {...form.register("price_per_sqft", { valueAsNumber: true })}
              />
            </div>

            {/* ---------- ADDRESS ---------- */}
            <Input
              placeholder="Full Address"
              {...form.register("address_text")}
            />
            <Input
              placeholder="Agency ID (UUID)"
              {...form.register("agency_id")}
            />

            {/* ---------- IMAGES ---------- */}
            <ImageUploader ref={imageUploaderRef} folder={tempListingCode} />

            <Button
              type="submit"
              className="w-full"
              disabled={submitting || imageUploaderRef.current?.uploading}
            >
              {submitting || imageUploaderRef.current?.uploading
                ? "Saving..."
                : "Save Listing"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
