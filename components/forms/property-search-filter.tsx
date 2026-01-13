"use client";

import { Search, X } from "lucide-react";
import * as React from "react";
import type { ControllerRenderProps } from "react-hook-form";
import { useForm } from "react-hook-form";

// components
import { Button } from "@/components/ui/button";
import * as form_1 from "@/components/ui/form";
import * as select from "@/components/ui/select";
import * as inputGroup from "../ui/input-group";

// lib & hooks
import * as settings from "@/lib/types/settings";
import { cn } from "@/lib/utils";
import * as propertySearch from "@/lib/validations/property-search";
import { zodResolver } from "@hookform/resolvers/zod";

// context
import { useTranslations } from "@/context/TranslationContext";
import { useRouter } from "@/i18n/navigation";
import { Township } from "@/lib/services/township";

// Props
interface PropertySearchFilterProps {
  className?: string;
  locale?: "en" | "my";
}

interface SelectOptionElementProps {
  options: settings.OutputOption[];
  field: ControllerRenderProps<
    propertySearch.PropertySearchForm,
    keyof propertySearch.PropertySearchForm
  >;
}

// Select Option Element
export const SelectOptionElement: React.FC<SelectOptionElementProps> = ({
  options,
  field,
}) => {
  return (
    <select.Select value={field.value} onValueChange={field.onChange}>
      <select.SelectTrigger size="custom">
        <select.SelectValue />
      </select.SelectTrigger>
      <select.SelectContent>
        {options.map((option) => (
          <select.SelectItem key={option.value} value={option.value}>
            {option.label}
          </select.SelectItem>
        ))}
      </select.SelectContent>
    </select.Select>
  );
};

// Property Search Filter Component
export function PropertySearchFilter({
  className,
  locale,
}: PropertySearchFilterProps) {
  // variables
  const translations = useTranslations();
  const [showAdvanced, setShowAdvanced] = React.useState<boolean>(false);

  const [townshipOptions, setTownshipOptions] = React.useState<
    settings.OutputOption[]
  >([]);
  const [loadingTownships, setLoadingTownships] = React.useState(false);

  const router = useRouter();

  // Form setup
  const form = useForm<propertySearch.PropertySearchForm>({
    resolver: zodResolver(propertySearch.propertySearchSchema),
    defaultValues: {
      type: "sale",
      region: "0",
      township: "0",
      propertyType: "0",
      hostelType: "0",
      hostelFormat: "0",
      minBed: "0",
      maxBed: "0",
      priceFrom: "0",
      priceTo: "0",
      q: "",
    },
  });

  const selectedRegion = form.watch("region");

  // Watch type to conditionally render fields
  const type = form.watch("type");
  const isHostel = type === "hostels";

  // Select options
  const propertyTypes = settings.toSelectOptions(
    settings.SETTINGS.PROPERTY_TYPES,
    locale ?? "en",
  );
  const hostelTypes = settings.toSelectOptions(
    settings.SETTINGS.HOSTEL_TYPES,
    locale ?? "en",
  );
  const hostelFormats = settings.toSelectOptions(
    settings.SETTINGS.HOSTEL_FORMATS,
    locale ?? "en",
  );
  const priceOptions = settings.toSelectOptions(
    settings.SETTINGS.PRICE_OPTIONS,
    locale ?? "en",
  );
  const regionsOptions = settings.toSelectOptions(
    settings.SETTINGS.REGION_OPTIONS,
    locale ?? "en",
  );
  const bedOptions = settings.toSelectOptions(
    settings.SETTINGS.BED_OPTIONS,
    locale ?? "en",
  );
  const kindOptions = settings.toSelectOptions(
    settings.SETTINGS.KIND_OPTIONS,
    locale ?? "en",
  );

  React.useEffect(() => {
    if (!selectedRegion || selectedRegion === "0") {
      setTownshipOptions([]);
      form.setValue("township", "0");
      return;
    }

    const fetchTownships = async () => {
      setLoadingTownships(true);
      try {
        const res = await fetch(`/api/townships?regionId=${selectedRegion}`);
        const data: Township[] = await res.json();

        const options = data.map((t) => ({
          value: t.id.toString(),
          label: locale === "my" ? t.name_mm : t.name_en || t.name_mm,
        }));

        setTownshipOptions(options);
        form.setValue("township", "0"); // reset when region changes
      } catch (err) {
        console.error("Failed to fetch townships", err);
      } finally {
        setLoadingTownships(false);
      }
    };

    fetchTownships();
  }, [selectedRegion, locale, form]);

  // Helper function to filter options dynamically
  const filterOptions = (
    options: settings.OutputOption[],
    locale: "en" | "my",
    exclude: Record<string, string>,
  ) => {
    const labelToExclude = exclude[locale];
    return options.filter((option) => option.label !== labelToExclude);
  };
  // Generate filtered options
  const generateFilteredOptions = (
    options: settings.OutputOption[],
    locale: "en" | "my",
  ) => ({
    exclude: (excludeLabels: Record<string, string>) =>
      filterOptions(options, locale, excludeLabels),
  });
  // Filtered options
  const bedOptionsFiltered = generateFilteredOptions(
    bedOptions,
    locale ?? "en",
  );
  const priceOptionsFiltered = generateFilteredOptions(
    priceOptions,
    locale ?? "en",
  );

  // Final options excluding "Min" and "Max"
  const minBedOptions = bedOptionsFiltered.exclude({
    en: "Max Bed",
    my: "အိပ်ခန်း (အများဆုံး)",
  });
  const maxBedOptions = bedOptionsFiltered.exclude({
    en: "Min Bed",
    my: "အိပ်ခန်း (အနည်းဆုံး)",
  });
  const minPriceOptions = priceOptionsFiltered.exclude({
    en: "Price (To)",
    my: "ဈေးနှုန်း (အတွင်း)",
  });
  const maxPriceOptions = priceOptionsFiltered.exclude({
    en: "Price (From)",
    my: "ဈေးနှုန်း (မှ)",
  });

  // Form submit handler
  const onSubmit = (data: propertySearch.PropertySearchForm) => {
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value && value !== "0") {
        params.set(key, value);
      }
    });
    router.push({
      pathname: "/search",
      query: { features: "true", ...Object.fromEntries(params) },
    });
  };

  return (
    <div className={cn("w-full max-w-7xl mx-auto", className)}>
      <form_1.Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-card border rounded-2xl shadow-lg"
        >
          {/* ROW 1 */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4 p-4 md:p-6 border-b border-border/50 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Search */}
            <form_1.FormField
              control={form.control}
              name="q"
              render={({ field }) => (
                <form_1.FormItem className="col-span-1 md:col-span-2">
                  <form_1.FormControl>
                    <inputGroup.InputGroup className="w-full h-12 md:h-14">
                      <inputGroup.InputGroupInput
                        {...field}
                        placeholder={
                          translations
                            ? translations["keywordPlaceholder"]
                            : "Enter keyword or ad number"
                        }
                        className="h-12 md:h-14 placeholder:text-foreground"
                      />
                      {field.value ? (
                        <inputGroup.InputGroupAddon align="inline-end">
                          <inputGroup.InputGroupButton
                            aria-label="Close"
                            title="Close"
                            size="icon-xs"
                            onClick={() => {
                              field.onChange("");
                            }}
                          >
                            <X />
                          </inputGroup.InputGroupButton>
                        </inputGroup.InputGroupAddon>
                      ) : null}
                    </inputGroup.InputGroup>
                  </form_1.FormControl>
                </form_1.FormItem>
              )}
            />

            {/* Type */}
            <form_1.FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <form_1.FormItem className="h-12 md:h-14 col-span-1 md:col-span-1">
                  <SelectOptionElement options={kindOptions} field={field} />
                </form_1.FormItem>
              )}
            />

            {/* Region */}
            <form_1.FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <form_1.FormItem className="h-12 md:h-14 col-span-1 md:col-span-1">
                  <SelectOptionElement options={regionsOptions} field={field} />
                </form_1.FormItem>
              )}
            />

            {/* Township (placeholder) */}
            <form_1.FormField
              control={form.control}
              name="township"
              render={({ field }) => (
                <form_1.FormItem className="h-12 md:h-14 col-span-1 md:col-span-1">
                  <select.Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={
                      !selectedRegion ||
                      selectedRegion === "0" ||
                      loadingTownships
                    }
                  >
                    <select.SelectTrigger size="custom">
                      <select.SelectValue
                        placeholder={
                          loadingTownships ? "Loading..." : "Select township"
                        }
                      />
                    </select.SelectTrigger>
                    <select.SelectContent>
                      <select.SelectItem value="0">
                        Select township
                      </select.SelectItem>
                      {townshipOptions.map((option) => (
                        <select.SelectItem
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </select.SelectItem>
                      ))}
                    </select.SelectContent>
                  </select.Select>
                </form_1.FormItem>
              )}
            />
          </div>

          {/* ROW 2 */}
          <div
            className={cn(
              "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 p-4 md:p-6 transition-all duration-500 ease-in-out overflow-hidden",
              showAdvanced
                ? "max-h-[2000px] opacity-100 animate-in slide-in-from-top-2 fade-in"
                : "max-h-0 p-0 md:max-h-[2000px] md:opacity-100 md:animate-in md:slide-in-from-top-2 md:fade-in",
            )}
          >
            {/* Property / Hostel */}
            {isHostel ? (
              <>
                <form_1.FormField
                  control={form.control}
                  name="hostelType"
                  render={({ field }) => (
                    <form_1.FormItem className="h-12 md:h-14 col-span-1 md:col-span-1">
                      <SelectOptionElement
                        options={hostelTypes}
                        field={field}
                      />
                    </form_1.FormItem>
                  )}
                />

                <form_1.FormField
                  control={form.control}
                  name="hostelFormat"
                  render={({ field }) => (
                    <form_1.FormItem className="h-12 md:h-14 col-span-1 md:col-span-1">
                      <SelectOptionElement
                        options={hostelFormats}
                        field={field}
                      />
                    </form_1.FormItem>
                  )}
                />
              </>
            ) : (
              <form_1.FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <form_1.FormItem className="h-12 md:h-14 col-span-1 md:col-span-1">
                    <SelectOptionElement
                      options={propertyTypes}
                      field={field}
                    />
                  </form_1.FormItem>
                )}
              />
            )}

            {!isHostel && (
              <>
                <form_1.FormField
                  control={form.control}
                  name="minBed"
                  render={({ field }) => (
                    <form_1.FormItem className="h-12 md:h-14 col-span-1 md:col-span-1">
                      <SelectOptionElement
                        options={minBedOptions}
                        field={field}
                      />
                    </form_1.FormItem>
                  )}
                />

                <form_1.FormField
                  control={form.control}
                  name="maxBed"
                  render={({ field }) => (
                    <form_1.FormItem className="h-12 md:h-14 col-span-1 md:col-span-1">
                      <SelectOptionElement
                        options={maxBedOptions}
                        field={field}
                      />
                    </form_1.FormItem>
                  )}
                />
              </>
            )}

            <form_1.FormField
              control={form.control}
              name="priceFrom"
              render={({ field }) => (
                <form_1.FormItem className="h-12 md:h-14 col-span-1 md:col-span-1">
                  <SelectOptionElement
                    options={minPriceOptions}
                    field={field}
                  />
                </form_1.FormItem>
              )}
            />

            <form_1.FormField
              control={form.control}
              name="priceTo"
              render={({ field }) => (
                <form_1.FormItem className="h-12 md:h-14 col-span-1 md:col-span-1">
                  <SelectOptionElement
                    options={maxPriceOptions}
                    field={field}
                  />
                </form_1.FormItem>
              )}
            />
          </div>

          {/* Mobile Advanced Toggle & Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 p-4 md:p-6 border-% border-border/50 bg-muted/30">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="md:hidden w-full sm:w-auto order-2 sm:order-1"
            >
              {showAdvanced
                ? translations
                  ? translations["hideAdvancedFilters"]
                  : "Hide Advanced Filters"
                : translations
                  ? translations["showAdvancedFilters"]
                  : "Show Advanced Filters"}
            </Button>
            <Button type="submit" className="w-full h-12 md:h-14">
              <Search className="mr-2 h-5 w-5" />
              {translations ? translations["search"] : "Search"}
            </Button>
          </div>
        </form>
      </form_1.Form>
    </div>
  );
}
