// hooks/usePriceFormatter.ts
import { useLocale } from "next-intl";

export const usePriceFormatter = () => {
  const locale = useLocale();

  const toMyanmarDigits = (value: string) => {
    const map = ["၀", "၁", "၂", "၃", "၄", "၅", "၆", "၇", "၈", "၉"];
    return value.replace(/\d/g, (d) => map[Number(d)]);
  };

  const formatPrice = (amount: number, unitLabel?: string) => {
    if (!amount) {
      return locale === "my" ? "စျေးနှုန်းမေးမြန်းရန်" : "Price Inquiry";
    }

    const isMyanmar = locale === "my";
    const isLakhs = amount >= 100000;

    const formatted = amount.toLocaleString("en-US");
    const converted = isMyanmar ? toMyanmarDigits(formatted) : formatted;
    if (isLakhs) {
      const lakhsAmount = amount / 100000;
      const lakhsFormatted = lakhsAmount.toLocaleString("en-US", {
        maximumFractionDigits: 2,
      });
      const lakhsConverted = isMyanmar
        ? toMyanmarDigits(lakhsFormatted)
        : lakhsFormatted;
      return isMyanmar
        ? `${lakhsConverted} သိန်း`
        : `${lakhsConverted} Lakhs ${unitLabel || "MMK"}`;
    }
    
    // Fallbacks
    if (isMyanmar) {
      return `${converted} သိန်း`;
    }

    return `${converted} ${unitLabel || "MMK"}`;
  };

  return { formatPrice };
};
