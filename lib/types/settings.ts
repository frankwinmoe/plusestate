

// Define a common interface for all options
export interface Option {
    value: string;
    label_mm: string;
    label_en: string;
    regionId?: number;
    sortOrder?: number;
    
}

const propertyTypes: Option[] = [
    { value: "0", label_mm: "အမျိုးအစားအားလုံး", label_en: "All Property Types" },
    { value: "1", label_mm: "တိုက်ခန်း", label_en: "Apartment" },
    { value: "8", label_mm: "မီနီကွန်ဒို", label_en: "Mini Condo" },
    { value: "2", label_mm: "ကွန်ဒို", label_en: "Condominium" },
    { value: "3", label_mm: "လုံးချင်းအိမ်", label_en: "Detached House" },
    { value: "4", label_mm: "မြေကွက် ၊ ခြံကွက်", label_en: "Land / Plot" },
    { value: "5", label_mm: "ဆိုင်ခန်း ၊ ရုံးခန်း", label_en: "Shop / Office" },
    { value: "6", label_mm: "စက်မှု့ဇုန်", label_en: "Industrial Zone" },
    { value: "7", label_mm: "ဟိုတယ် ၊ စားသောက်ဆိုင်", label_en: "Hotel / Restaurant" },
];

const kindOptions: Option[] = [
    { value: "sale", label_mm: "ရောင်းရန်အိမ်ခြံမြေများ", label_en: "All Properties for Sale" },
    { value: "rent", label_mm: "ငှားရန်အိမ်ခြံမြေများ", label_en: "For Rent" },
    { value: "new_launch", label_mm: "ကြိုပွိုင့်များ", label_en: "New Launches" },
    { value: "hostels", label_mm: "အဆောင်များ", label_en: "Hostels" },
];

const hostelTypes: Option[] = [
    { value: "0", label_mm: "အဆောင်အမျိုးအစား အားလုံး", label_en: "All Hostel Types" },
    { value: "1", label_mm: "အမျိုးသားအဆောင်", label_en: "Male Hostel" },
    { value: "2", label_mm: "အမျိုးသမီးအဆောင်", label_en: "Female Hostel" },
    { value: "3", label_mm: "အိမ်ထောင်သည်အဆောင်", label_en: "Married Hostel" },
];

const hostelFormats: Option[] = [
    { value: "0", label_mm: "အဆောင်ပုံစံ အားလုံး", label_en: "All Hostel Formats" },
    { value: "1", label_mm: "ခန်းမ", label_en: "Hall" },
    { value: "2", label_mm: "ထပ်ခိုး ခန်း", label_en: "Loft Room" },
    { value: "3", label_mm: "အိမ်ထောင်သည် အိပ်ခန်း", label_en: "Married Room" },
    { value: "4", label_mm: "၁ ယောက်အိပ်ခန်း", label_en: "Single Room" },
    { value: "5", label_mm: "၂ ယောက်အိပ်ခန်း", label_en: "Double Room" },
    { value: "6", label_mm: "၃ ယောက်အိပ်ခန်း", label_en: "Triple Room" },
    { value: "7", label_mm: "၄ ယောက်အိပ်ခန်း", label_en: "Quad Room" },
    { value: "24", label_mm: "၅ ယောက်နှင့်အထက် အိပ်ခန်း", label_en: "5+ Person Room" },
];

const priceOptions: Option[] = [
    { value: "0", label_mm: "ဈေးနှုန်း (မှ)", label_en: "Price (From)" },
    { value: "0", label_mm: "ဈေးနှုန်း (အတွင်း)", label_en: "Price (To)" },
    { value: "100", label_mm: "100 (သိန်း)", label_en: "100 Lakhs" },
    { value: "300", label_mm: "300 (သိန်း)", label_en: "300 Lakhs" },
    { value: "500", label_mm: "500 (သိန်း)", label_en: "500 Lakhs" },
    { value: "800", label_mm: "800 (သိန်း)", label_en: "800 Lakhs" },
    { value: "1000", label_mm: "1,000 (သိန်း)", label_en: "1,000 Lakhs" },
    { value: "1500", label_mm: "1,500 (သိန်း)", label_en: "1,500 Lakhs" },
    { value: "2000", label_mm: "2,000 (သိန်း)", label_en: "2,000 Lakhs" },
    { value: "3000", label_mm: "3,000 (သိန်း)", label_en: "3,000 Lakhs" },
    { value: "5000", label_mm: "5,000 (သိန်း)", label_en: "5,000 Lakhs" },
    { value: "10000", label_mm: "10,000 (သိန်း)", label_en: "1 Crore" },
    { value: "20000", label_mm: "20,000 (သိန်း)", label_en: "2 Crore" },
    { value: "50000", label_mm: "50,000 (သိန်း)", label_en: "5 Crore" },
    { value: "100000", label_mm: "100,000 (သိန်း)", label_en: "10 Crore" },
];

const regionOptions: Option[] = [
    { value: "0", label_mm: "တိုင်းနှင့်ပြည်နယ်အားလုံး", label_en: "All Regions" },
    { value: "1", label_mm: "ရန်ကုန်မြို့", label_en: "Yangon" },
    { value: "2", label_mm: "မန္တလေးမြို့", label_en: "Mandalay" },
    { value: "3", label_mm: "နေပြည်တော်", label_en: "Naypyidaw" },
    { value: "4", label_mm: "ပဲခူးတိုင်းဒေသကြီး", label_en: "Bago Region" },
    { value: "5", label_mm: "ဧရာဝတီတိုင်းဒေသကြီး", label_en: "Ayeyarwady Region" },
    { value: "6", label_mm: "မကွေးတိုင်းဒေသကြီး", label_en: "Magway Region" },
    { value: "7", label_mm: "စစ်ကိုင်းတိုင်းဒေသကြီး", label_en: "Sagaing Region" },
    { value: "8", label_mm: "တနင်္သာရီတိုင်းဒေသကြီး", label_en: "Tanintharyi Region" },
    { value: "9", label_mm: "ရှမ်းပြည်နယ်", label_en: "Shan State" },
    { value: "10", label_mm: "ကရင်ပြည်နယ်", label_en: "Kayin State" },
    { value: "11", label_mm: "မွန်ပြည်နယ်", label_en: "Mon State" },
    { value: "12", label_mm: "ရခိုင်ပြည်နယ်", label_en: "Rakhine State" },
    { value: "13", label_mm: "ချင်းပြည်နယ်", label_en: "Chin State" },
    { value: "14", label_mm: "ကချင်ပြည်နယ်", label_en: "Kachin State" },
    { value: "15", label_mm: "ကယားပြည်နယ်", label_en: "Kayah State" },
    { value: "16", label_mm: "အခြားတိုင်းဒေသကြီး/ပြည်နယ်များ", label_en: "Other Regions" },
];

const bedOptions: Option[] = [
    { value: "0", label_mm: "အိပ်ခန်း (အနည်းဆုံး)", label_en: "Min Bed" },
    { value: "0", label_mm: "အိပ်ခန်း (အများဆုံး)", label_en: "Max Bed" },
    { value: "1", label_mm: "အိပ်ခန်း ၁ လုံး", label_en: "1 Bedroom" },
    { value: "2", label_mm: "အိပ်ခန်း ၂ လုံး", label_en: "2 Bedrooms" },
    { value: "3", label_mm: "အိပ်ခန်း ၃ လုံး", label_en: "3 Bedrooms" },
    { value: "4", label_mm: "အိပ်ခန်း ၄ လုံး", label_en: "4 Bedrooms" },
    { value: "5", label_mm: "အိပ်ခန်း ၅ လုံးနှင့်အထက်", label_en: "5+ Bedrooms" },
];

const townshipOptions: Option[] = [
    { value: "0", label_mm: "မြို့နယ် အားလုံး", label_en: "All Townships" },
    // Add more township options as needed
];

export const SETTINGS = {
    PROPERTY_TYPES: propertyTypes,
    HOSTEL_TYPES: hostelTypes,
    HOSTEL_FORMATS: hostelFormats,
    PRICE_OPTIONS: priceOptions,
    REGION_OPTIONS: regionOptions,
    BED_OPTIONS: bedOptions,
    KIND_OPTIONS: kindOptions,
    TOWNSHIP_OPTIONS: townshipOptions,
};


export interface OutputOption {
    value: string;
    label: string;
}

// Helper functions
export const toSelectOptions = (
    items: Option[],
    locale: "en" | "my"
) =>
    items.map(({ value, label_en, label_mm }) => ({
        value,
        label: locale === "en" ? label_en : label_mm,
    }));
