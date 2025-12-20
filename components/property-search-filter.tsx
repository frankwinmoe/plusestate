"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ControllerRenderProps, FieldValues } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
} from "@/components/ui/form";

import { cn } from "@/lib/utils";
import { OutputOption, SETTINGS, toSelectOptions } from "@/lib/types/settings";

import {
  propertySearchSchema,
  PropertySearchForm,
} from "@/lib/validations/property-search";
import { useTranslations } from "@/context/TranslationContext";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./ui/input-group";

interface PropertySearchFilterProps {
  className?: string;
  locale?: "en" | "my";
}

interface SelectOptionElementProps {
  options: OutputOption[];
  field: ControllerRenderProps<PropertySearchForm, keyof PropertySearchForm>;
}

export const SelectOptionElement: React.FC<SelectOptionElementProps> = ({ options, field }) => {
  return (
    <Select value={field.value} onValueChange={field.onChange}>
      <SelectTrigger size="custom">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export function PropertySearchFilter({
  className,
  locale
}: PropertySearchFilterProps) {
  // State for advanced filters
  const [showAdvanced, setShowAdvanced] = React.useState<boolean>(false);
  // Translations
  const translations = useTranslations();
  // Form setup
  const form = useForm<PropertySearchForm>({
    resolver: zodResolver(propertySearchSchema),
    defaultValues: {
      type: "sale",
      // Filters
      region: "all",
      township: "all",
      // Options
      propertyType: "all",
      hostelType: "all",
      hostelFormat: "all",
      // beds
      minBed: "min",
      maxBed: "max",
      // prices
      priceFrom: "0",
      priceTo: "max",
    },
  });

  const type = form.watch("type");
  const isHostel = type === "hostels";

  const propertyTypes = toSelectOptions(SETTINGS.PROPERTY_TYPES, locale ?? "en");
  const hostelTypes = toSelectOptions(SETTINGS.HOSTEL_TYPES, locale ?? "en");
  const hostelFormats = toSelectOptions(SETTINGS.HOSTEL_FORMATS, locale ?? "en");
  const priceOptions = toSelectOptions(SETTINGS.PRICE_OPTIONS, locale ?? "en");
  const regionsOptions = toSelectOptions(SETTINGS.REGION_OPTIONS, locale ?? "en");
  const bedOptions = toSelectOptions(SETTINGS.BED_OPTIONS, locale ?? "en");
  const kindOptions = toSelectOptions(SETTINGS.KIND_OPTIONS, locale ?? "en");
  const townshipOptions = toSelectOptions(SETTINGS.TOWNSHIP_OPTIONS, locale ?? "en");

  const onSubmit = (data: PropertySearchForm) => {
    const params = new URLSearchParams();

    Object.entries(data).forEach(([key, value]) => {
      if (value && value !== "0") {
        params.set(key, value);
      }
    });

    window.location.href = `/search?${params.toString()}`;
  };

  return (
    <div
      className={cn(
        "w-full max-w-7xl mx-auto",
        className
      )}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-card border rounded-2xl shadow-lg"
        >
          {/* ROW 1 */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4 p-4 md:p-6 border-b border-border/50 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Search */}
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem
                  className="col-span-1 md:col-span-2">
                  <FormControl>
                    <InputGroup
                      className="w-full h-12 md:h-14">
                      <InputGroupInput
                        {...field}
                        placeholder={translations ? translations["keywordPlaceholder"] : "Enter keyword or ad number"}
                        className="h-12 md:h-14" />
                      {field.value ?
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            aria-label="Close"
                            title="Close"
                            size="icon-xs"
                            onClick={() => {
                              field.onChange("");
                            }}
                          >
                            <X />
                          </InputGroupButton>
                        </InputGroupAddon> : null}
                    </InputGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="h-12 md:h-14 col-span-1 md:col-span-1">
                  <SelectOptionElement options={kindOptions} field={field} />
                </FormItem>
              )}
            />

            {/* Region */}
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem className="h-12 md:h-14 col-span-1 md:col-span-1">
                  <SelectOptionElement options={regionsOptions} field={field} />
                </FormItem>
              )}
            />

            {/* Township (placeholder) */}
            <FormField
              control={form.control}
              name="township"
              render={({ field }) => (
                <FormItem className="h-12 md:h-14 col-span-1 md:col-span-1">
                  <SelectOptionElement options={townshipOptions} field={field} />
                </FormItem>
              )}
            />
          </div>

          {/* ROW 2 */}
          <div
            className={cn(
              "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 p-4 md:p-6 transition-all duration-500 ease-in-out overflow-hidden",
              showAdvanced
                ? "max-h-[2000px] opacity-100 animate-in slide-in-from-top-2 fade-in"
                : "max-h-0 p-0 md:max-h-[2000px] md:opacity-100 md:animate-in md:slide-in-from-top-2 md:fade-in"
            )}
          >
            {/* Property / Hostel */}
            {isHostel ? (
              <>
                <FormField
                  control={form.control}
                  name="hostelType"
                  render={({ field }) => (
                    <FormItem className="h-12 md:h-14 col-span-1 md:col-span-1">
                      <SelectOptionElement options={hostelTypes} field={field} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hostelFormat"
                  render={({ field }) => (
                    <FormItem className="h-12 md:h-14 col-span-1 md:col-span-1">
                      <SelectOptionElement options={hostelFormats} field={field} />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem className="h-12 md:h-14 col-span-1 md:col-span-1">
                    <SelectOptionElement options={propertyTypes} field={field} />
                  </FormItem>
                )}
              />
            )}

            {!isHostel && (
              <>
                <FormField
                  control={form.control}
                  name="minBed"
                  render={({ field }) => (
                    <FormItem className="h-12 md:h-14 col-span-1 md:col-span-1">
                      <SelectOptionElement
                        options={bedOptions.filter((b) => b.value !== "max")}
                        field={field}
                      />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxBed"
                  render={({ field }) => (
                    <FormItem className="h-12 md:h-14 col-span-1 md:col-span-1">
                      <SelectOptionElement
                        options={bedOptions.filter((b) => b.value !== "min")}
                        field={field}
                      />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="priceFrom"
              render={({ field }) => (
                <FormItem className="h-12 md:h-14 col-span-1 md:col-span-1">
                  <SelectOptionElement
                    options={priceOptions.filter((p) => p.value !== "max")}
                    field={field}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priceTo"
              render={({ field }) => (
                <FormItem className="h-12 md:h-14 col-span-1 md:col-span-1">
                  <SelectOptionElement
                    options={priceOptions.filter((p) => p.value !== "0")}
                    field={field}
                  />
                </FormItem>
              )}
            />
          </div>

          {/* Mobile Advanced Toggle & Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 p-4 md:p-6 border-t border-border/50 bg-muted/30">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="md:hidden w-full sm:w-auto order-2 sm:order-1"
            >
              {showAdvanced ? translations ? translations["hideAdvancedFilters"] : "Hide Advanced Filters" : translations ? translations["showAdvancedFilters"] : "Show Advanced Filters"}
            </Button>
            <Button type="submit" className="w-full h-12 md:h-14">
              <Search className="mr-2 h-5 w-5" />
              {translations ? translations["search"] : "Search"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
