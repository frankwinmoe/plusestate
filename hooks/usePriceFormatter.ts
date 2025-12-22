// hooks/usePriceFormatter.ts
import { useLocale } from "next-intl";

export const usePriceFormatter = () => {
    const locale = useLocale();

    const convertToMyanmarNumerals = (numberString: string) => {
        const myanmarDigits = ["၀", "၁", "၂", "၃", "၄", "၅", "၆", "၇", "၈", "၉"];
        return numberString.replace(/\d/g, (digit) => myanmarDigits[parseInt(digit, 10)]);
    };

    const formatPrice = (amount: number, unitLabel?: string) => {
        if (!amount) return "Price Inquiry";
        let formatUnit = "en-US";
        if (locale === "my") formatUnit = "my-MM";
        const formatted = amount.toLocaleString(formatUnit);
        const converted = locale === "my" ? convertToMyanmarNumerals(formatted) : formatted;
        return locale === "my" ? `${converted} ${unitLabel || "ကျပ်"}` : `${converted} ${unitLabel || "MMK"}`;
    };

    return { formatPrice };
};
