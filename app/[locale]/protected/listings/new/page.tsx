"use client";

import { useEffect, useState, useRef } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  propertyCreateSchema,
  PropertyCreateInput,
} from "@/lib/schemas/property.schema";

import * as select from "@/components/ui/select";

import { useLocale, useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
type Agency = { id: string; display_name: string };

/* ---------------- Page ---------------- */
export default function PropertyCreatePage() {
  const supabase = createClient();
  const locale = useLocale();
  const t = useTranslations("listings");
  const tCommon = useTranslations("common");
  const tManage = useTranslations("manage");

  const [regions, setRegions] = useState<Region[]>([]);
  const [townships, setTownships] = useState<Township[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
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
      agency_id: undefined,
    } as Partial<PropertyCreateInput>,
  });

  const regionId = form.watch("region_id");

  /* ---------- Load regions, property types, agencies & user's default agency ---------- */
  useEffect(() => {
    async function loadRefs() {
      const [
        { data: r },
        { data: p },
        { data: a },
        { data: { user } },
      ] = await Promise.all([
        supabase.from("regions").select("id, name_mm, name_en").order("sort_order"),
        supabase.from("property_types").select("id, name_mm, name_en").order("sort_order"),
        supabase.from("agencies").select("id, display_name").order("display_name"),
        supabase.auth.getUser(),
      ]);
      setRegions(r ?? []);
      setPropertyTypes(p ?? []);
      setAgencies(a ?? []);

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("agency_id")
          .eq("id", user.id)
          .single();
        if (profile?.agency_id) {
          form.setValue("agency_id", profile.agency_id);
        }
      }
      setLoading(false);
    }
    loadRefs();
  }, [supabase, form]);

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
      const base = `/${locale}/api/listings`;

      // 1. Create listing
      const createRes = await fetch(`${base}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!createRes.ok) throw new Error("Failed to create listing");

      const listing = await createRes.json();
      const listing_code = listing.listing_code;
      form.setValue("listing_code", listing_code);

      // 2. Upload images to S3 and get URLs
      if (imageUploaderRef.current?.setFolder) {
        imageUploaderRef.current.setFolder(listing_code);
      }
      const urls = (await imageUploaderRef.current?.upload()) ?? [];

      // 3. Save listing images to DB (listing_images table)
      if (urls.length > 0) {
        const images = urls.map((url, i) => ({ image_url: url, sort_order: i }));
        const imgRes = await fetch(`${base}/${listing_code}/images`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(images),
        });
        if (!imgRes.ok) throw new Error("Failed to save images");
      }

      toast.success(t("listingCreated"));
    } catch (err) {
      console.error(err);
      toast.error(t("createFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen flex flex-col">
      <SidebarHeader
        breadcrumb={[
          { title: tCommon("dashboard"), href: "/protected" },
          { title: t("title"), href: "/protected/listings" },
          { title: t("create"), href: "/protected/listings/new" },
        ]}
      />
      <div className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold">{t("createPropertyListing")}</h1>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* ---------- META ---------- */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">{t("listingType")}</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="listing_code">{t("listingCode")}</Label>
                  <Input
                    id="listing_code"
                    placeholder={t("listingCodePlaceholder")}
                    {...form.register("listing_code")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kind">{t("kind")}</Label>
                  <Controller
                    control={form.control}
                    name="kind"
                    render={({ field }) => (
                      <select.Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <select.SelectTrigger id="kind" className="w-full">
                          <select.SelectValue placeholder={tManage("selectPlaceholder", { label: t("kind") })} />
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">{t("status")}</Label>
                  <Controller
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <select.Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <select.SelectTrigger id="status" className="w-full">
                          <select.SelectValue placeholder={tManage("selectPlaceholder", { label: t("status") })} />
                        </select.SelectTrigger>
                        <select.SelectContent>
                          <select.SelectItem value="draft">{t("statusDraft")}</select.SelectItem>
                          <select.SelectItem value="published">{t("statusPublished")}</select.SelectItem>
                          <select.SelectItem value="archived">{t("statusArchived")}</select.SelectItem>
                        </select.SelectContent>
                      </select.Select>
                    )}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-1">
                <Controller
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <Checkbox
                      id="is_featured"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="is_featured" className="font-normal cursor-pointer">
                  {t("featuredListing")}
                </Label>
              </div>
            </div>

            {/* ---------- TITLE & DESC ---------- */}
            <div className="space-y-2">
              <Label htmlFor="title">{t("titleLabel")}</Label>
              <Input
                id="title"
                placeholder={t("titlePlaceholder")}
                {...form.register("title")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t("description")}</Label>
              <textarea
                id="description"
                placeholder={t("descriptionPlaceholder")}
                {...form.register("description")}
                className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            {/* ---------- LOCATION ---------- */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">{t("location")}</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>{t("region")}</Label>
                  <Controller
                    control={form.control}
                    name="region_id"
                    render={({ field }) => (
                      <FormCombobox
                        value={field.value}
                        onChangeAction={field.onChange}
                        placeholder={tManage("selectPlaceholder", { label: t("region") })}
                        options={regions.map((r) => ({
                          value: r.id,
                          label: locale === "en" && r.name_en ? r.name_en : r.name_mm,
                        }))}
                      />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("township")}</Label>
                  <Controller
                    control={form.control}
                    name="township_id"
                    render={({ field }) => (
                      <FormCombobox
                        value={field.value}
                        onChangeAction={field.onChange}
                        disabled={!regionId}
                        placeholder={tManage("selectPlaceholder", { label: t("township") })}
                        options={townships.map((tw) => ({
                          value: tw.id,
                          label: locale === "en" && tw.name_en ? tw.name_en : tw.name_mm,
                        }))}
                      />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("propertyType")}</Label>
                  <Controller
                    control={form.control}
                    name="property_type_id"
                    render={({ field }) => (
                      <FormCombobox
                        value={field.value}
                        onChangeAction={field.onChange}
                        placeholder={tManage("selectPlaceholder", { label: t("propertyType") })}
                        options={propertyTypes.map((p) => ({
                          value: p.id,
                          label: locale === "en" && p.name_en ? p.name_en : p.name_mm,
                        }))}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* ---------- ROOMS ---------- */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">{t("roomsFloor")}</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">{t("bedrooms")}</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    placeholder="—"
                    {...form.register("bedrooms", { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">{t("bathrooms")}</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    placeholder="—"
                    {...form.register("bathrooms", { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="floor_label">{t("floor")}</Label>
                  <Input
                    id="floor_label"
                    placeholder={t("floorPlaceholder")}
                    {...form.register("floor_label")}
                  />
                </div>
              </div>
            </div>

            {/* ---------- SIZE ---------- */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">{t("size")}</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="width_ft">{t("widthFt")}</Label>
                  <Input
                    id="width_ft"
                    type="number"
                    placeholder="—"
                    {...form.register("width_ft", { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="length_ft">{t("lengthFt")}</Label>
                  <Input
                    id="length_ft"
                    type="number"
                    placeholder="—"
                    {...form.register("length_ft", { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area_sqft">{t("areaSqft")}</Label>
                  <Input
                    id="area_sqft"
                    type="number"
                    placeholder="—"
                    {...form.register("area_sqft", { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area_label">{t("areaLabel")}</Label>
                  <Input
                    id="area_label"
                    placeholder="—"
                    {...form.register("area_label")}
                  />
                </div>
              </div>
            </div>

            {/* ---------- PRICE ---------- */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">{t("price")}</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label>{t("currency")}</Label>
                  <Controller
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormCombobox
                        value={field.value}
                        onChangeAction={field.onChange}
                        placeholder={t("currency")}
                        options={[
                          { value: "MMK", label: "Myanmar (Kyat)" },
                          { value: "USD", label: "USD" },
                          { value: "THB", label: "THB" },
                        ]}
                      />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price_amount">{t("amount")}</Label>
                  <Input
                    id="price_amount"
                    type="number"
                    placeholder="—"
                    {...form.register("price_amount", { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price_unit_label">{t("unit")}</Label>
                  <Input
                    id="price_unit_label"
                    placeholder="Lakh"
                    {...form.register("price_unit_label")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price_per_sqft">{t("pricePerSqft")}</Label>
                  <Input
                    id="price_per_sqft"
                    type="number"
                    placeholder="—"
                    {...form.register("price_per_sqft", { valueAsNumber: true })}
                  />
                </div>
              </div>
            </div>

            {/* ---------- ADDRESS & AGENCY ---------- */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address_text">{t("fullAddress")}</Label>
                <Input
                  id="address_text"
                  placeholder={t("addressPlaceholder")}
                  {...form.register("address_text")}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("agency")}</Label>
                <Controller
                  control={form.control}
                  name="agency_id"
                  render={({ field }) => (
                    <FormCombobox
                      value={field.value}
                      onChangeAction={field.onChange}
                      placeholder={t("agencyPlaceholder")}
                      options={agencies.map((ag) => ({
                        value: ag.id,
                        label: ag.display_name,
                      }))}
                    />
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  {t("agencyHint")}
                </p>
              </div>
            </div>

            {/* ---------- IMAGES (listing-images upload) ---------- */}
            <div className="space-y-2">
              <Label>{t("listingImages")}</Label>
              <p className="text-xs text-muted-foreground">
                {t("listingImagesHint")}
              </p>
              <ImageUploader ref={imageUploaderRef} folder={tempListingCode} />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={submitting || imageUploaderRef.current?.uploading}
            >
              {submitting || imageUploaderRef.current?.uploading
                ? t("saving")
                : t("saveListing")}
            </Button>
          </form>
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  );
}
