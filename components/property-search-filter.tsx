"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface PropertySearchFilterProps {
  className?: string;
}

export function PropertySearchFilter({ className }: PropertySearchFilterProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [type, setType] = React.useState("sale");
  const [region, setRegion] = React.useState("0");
  const [township, setTownship] = React.useState("0");
  const [propertyType, setPropertyType] = React.useState("0");
  const [hostelType, setHostelType] = React.useState("0");
  const [hostelFormat, setHostelFormat] = React.useState("0");
  const [minBed, setMinBed] = React.useState("0");
  const [maxBed, setMaxBed] = React.useState("0");
  const [priceFrom, setPriceFrom] = React.useState("0");
  const [priceTo, setPriceTo] = React.useState("0");
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const isHostel = type === "hostels";

  const propertyTypes = [
    { value: "0", label: "အမျိုးအစားအားလုံး" },
    { value: "1", label: "တိုက်ခန်း" },
    { value: "8", label: "မီနီကွန်ဒို" },
    { value: "2", label: "ကွန်ဒို" },
    { value: "3", label: "လုံးချင်းအိမ်" },
    { value: "4", label: "မြေကွက် ၊ ခြံကွက်" },
    { value: "5", label: "ဆိုင်ခန်း ၊ ရုံးခန်း" },
    { value: "6", label: "စက်မှု့ဇုန်" },
    { value: "7", label: "ဟိုတယ် ၊ စားသောက်ဆိုင်" },
  ];

  const hostelTypes = [
    { value: "0", label: "အဆောင်အမျိုးအစား အားလုံး" },
    { value: "1", label: "အမျိုးသားအဆောင်" },
    { value: "2", label: "အမျိုးသမီးအဆောင်" },
    { value: "3", label: "အိမ်ထောင်သည်အဆောင်" },
  ];

  const hostelFormats = [
    { value: "0", label: "အဆောင်ပုံစံ အားလုံး" },
    { value: "1", label: "Hall" },
    { value: "2", label: "ထပ်ခိုး ခန်း" },
    { value: "3", label: "အိမ်ထောင်သည် အိပ်ခန်း" },
    { value: "4", label: "၁ ယောက်အိပ်ခန်း" },
    { value: "5", label: "၂ ယောက်အိပ်ခန်း" },
    { value: "6", label: "၃ ယောက်အိပ်ခန်း" },
    { value: "7", label: "၄ ယောက်အိပ်ခန်း" },
    { value: "24", label: "၅ ယောက်နှင့်အထက် အိပ်ခန်း" },
  ];

  const regions = [
    { value: "0", label: "တိုင်းနှင့်ပြည်နယ်အားလုံး" },
    { value: "1", label: "ရန်ကုန်တိုင်းဒေသကြီး" },
    { value: "2", label: "မန္တလေးတိုင်းဒေသကြီး" },
    { value: "15", label: "နေပြည်တော်" },
    { value: "3", label: "ပဲခူးတိုင်းဒေသကြီး" },
    { value: "4", label: "ဧရာဝတီတိုင်းဒေသကြီး" },
    { value: "5", label: "မကွေးတိုင်းဒေသကြီး" },
    { value: "6", label: "စစ်ကိုင်းတိုင်းဒေသကြီး" },
    { value: "7", label: "တနင်္သာရီတိုင်းဒေသကြီး" },
    { value: "8", label: "ရှမ်းပြည်နယ်" },
    { value: "9", label: "ကရင်ပြည်နယ်" },
    { value: "10", label: "မွန်ပြည်နယ်" },
    { value: "11", label: "ရခိုင်ပြည်နယ်" },
    { value: "12", label: "ချင်းပြည်နယ်" },
    { value: "13", label: "ကချင်ပြည်နယ်" },
    { value: "14", label: "ကယားပြည်နယ်" },
  ];

  const bedOptions = [
    { value: "0", label: "Min Bed" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
  ];

  const priceOptions = [
    { value: "0", label: "ဈေးနှုန်း (မှ)" },
    { value: "100", label: "100 (သိန်း)" },
    { value: "200", label: "200 (သိန်း)" },
    { value: "300", label: "300 (သိန်း)" },
    { value: "400", label: "400 (သိန်း)" },
    { value: "500", label: "500 (သိန်း)" },
    { value: "600", label: "600 (သိန်း)" },
    { value: "700", label: "700 (သိန်း)" },
    { value: "800", label: "800 (သိန်း)" },
    { value: "900", label: "900 (သိန်း)" },
    { value: "1000", label: "1000 (သိန်း)" },
    { value: "1500", label: "1500 (သိန်း)" },
    { value: "2000", label: "2000 (သိန်း)" },
    { value: "2500", label: "2500 (သိန်း)" },
    { value: "3000", label: "3000 (သိန်း)" },
    { value: "3500", label: "3500 (သိန်း)" },
    { value: "4000", label: "4000 (သိန်း)" },
    { value: "4500", label: "4500 (သိန်း)" },
    { value: "5000", label: "5000 (သိန်း)" },
    { value: "6000", label: "6000 (သိန်း)" },
    { value: "7000", label: "7000 (သိန်း)" },
    { value: "8000", label: "8000 (သိန်း)" },
    { value: "9000", label: "9000 (သိန်း)" },
    { value: "10000", label: "10000 (သိန်း)" },
    { value: "20000", label: "20000 (သိန်း)" },
    { value: "30000", label: "30000 (သိန်း)" },
    { value: "40000", label: "40000 (သိန်း)" },
    { value: "50000", label: "50000 (သိန်း)" },
    { value: "75000", label: "75000 (သိန်း)" },
    { value: "100000", label: "100000 (သိန်း)" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Build search URL
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (type && type !== "sale") params.set("type", type);
    if (region && region !== "0") params.set("region", region);
    if (township && township !== "0") params.set("township", township);
    if (propertyType && propertyType !== "0")
      params.set("property_type", propertyType);
    if (minBed && minBed !== "0") params.set("minBed", minBed);
    if (maxBed && maxBed !== "0") params.set("maxBed", maxBed);
    if (priceFrom && priceFrom !== "0") params.set("price_from", priceFrom);
    if (priceTo && priceTo !== "0") params.set("price_to", priceTo);

    // Navigate to search page
    window.location.href = `/search?${params.toString()}`;
  };

  return (
    <div
      className={cn(
        "w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500",
        className
      )}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden backdrop-blur-sm bg-opacity-95 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
      >
        {/* First Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 p-4 md:p-6 border-b border-border/50 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Search Input */}
          <div className="md:col-span-1">
            <div className="relative group">
              <Input
                type="text"
                name="q"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="စာသား (သို့) ကြော်ငြာနံပါတ်"
                className="w-full h-12 md:h-14 pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20 group-hover:border-primary/50"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Type Select */}
          <div className="md:col-span-1">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-12 md:h-14 transition-all duration-200 hover:border-primary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">ရောင်းရန်အိမ်ခြံမြေများ</SelectItem>
                <SelectItem value="rent">ငှားရန်အိမ်ခြံမြေများ</SelectItem>
                <SelectItem value="new_launch">ကြိုပွိုင့်များ</SelectItem>
                <SelectItem value="hostels">အဆောင်များ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Region Select */}
          <div className="md:col-span-1">
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="h-12 md:h-14 transition-all duration-200 hover:border-primary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region.value} value={region.value}>
                    {region.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Township Select */}
          <div className="md:col-span-1">
            <Select value={township} onValueChange={setTownship}>
              <SelectTrigger className="h-12 md:h-14 transition-all duration-200 hover:border-primary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">မြို့နယ်အားလုံး</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Second Row - Advanced Filters */}
        <div
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 p-4 md:p-6 transition-all duration-500 ease-in-out overflow-hidden",
            showAdvanced
              ? "max-h-[2000px] opacity-100 animate-in slide-in-from-top-2 fade-in"
              : "max-h-0 p-0 md:max-h-[2000px] md:opacity-100 md:animate-in md:slide-in-from-top-2 md:fade-in"
          )}
        >
          {/* Property Type or Hostel Type */}
          {isHostel ? (
            <>
              <div>
                <Select
                  value={hostelType}
                  onValueChange={setHostelType}
                  disabled={!isHostel}
                >
                  <SelectTrigger className="h-12 md:h-14 transition-all duration-200 hover:border-primary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {hostelTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select
                  value={hostelFormat}
                  onValueChange={setHostelFormat}
                  disabled={!isHostel}
                >
                  <SelectTrigger className="h-12 md:h-14 transition-all duration-200 hover:border-primary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {hostelFormats.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <div className="md:col-span-1 lg:col-span-1">
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="h-12 md:h-14 transition-all duration-200 hover:border-primary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Min Bed */}
          {!isHostel && (
            <div>
              <Select value={minBed} onValueChange={setMinBed}>
                <SelectTrigger className="h-12 md:h-14 transition-all duration-200 hover:border-primary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bedOptions.map((bed) => (
                    <SelectItem key={bed.value} value={bed.value}>
                      {bed.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Max Bed */}
          {!isHostel && (
            <div>
              <Select value={maxBed} onValueChange={setMaxBed}>
                <SelectTrigger className="h-12 md:h-14 transition-all duration-200 hover:border-primary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bedOptions.map((bed) => (
                    <SelectItem key={bed.value} value={bed.value}>
                      {bed.label.replace("Min", "Max")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Price From */}
          <div>
            <Select value={priceFrom} onValueChange={setPriceFrom}>
              <SelectTrigger className="h-12 md:h-14 transition-all duration-200 hover:border-primary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priceOptions.map((price) => (
                  <SelectItem key={price.value} value={price.value}>
                    {price.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price To */}
          <div>
            <Select value={priceTo} onValueChange={setPriceTo}>
              <SelectTrigger className="h-12 md:h-14 transition-all duration-200 hover:border-primary/50">
                <SelectValue placeholder="ဈေးနှုန်း (အတွင်း)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">ဈေးနှုန်း (အတွင်း)</SelectItem>
                {priceOptions
                  .filter((p) => p.value !== "0")
                  .map((price) => (
                    <SelectItem key={`to-${price.value}`} value={price.value}>
                      {price.label.replace("(မှ)", "(အတွင်း)")}
                    </SelectItem>
                  ))}
                <SelectItem value="max">100000 (သိန်း) နှင့်အထက်</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mobile Advanced Toggle & Submit Button */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 p-4 md:p-6 border-t border-border/50 bg-muted/30">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="md:hidden w-full sm:w-auto order-2 sm:order-1"
          >
            {showAdvanced ? "ပိတ်ရန်" : "အဆင့်မြင့် စစ်ထုတ်မှု"}
          </Button>
          <Button
            type="submit"
            className="group w-full sm:flex-1 h-12 md:h-14 text-base md:text-lg font-semibold bg-primary hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] order-1 sm:order-2"
          >
            <Search className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
            ရှာဖွေပါ
          </Button>
        </div>
      </form>
    </div>
  );
}

