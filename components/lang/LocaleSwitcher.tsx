"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface LocaleSwitcherProps {
    className?: string;
    size?: "sm" | "default" | "custom";
}

const LocaleSwitcher = ({ className, size = "default" }: LocaleSwitcherProps) => {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const switchLocale = (newLocale: string) => {
        if (newLocale !== locale) {
            router.replace(pathname, { locale: newLocale });
            router.refresh();
        }
    };
    return (
        <Select
            value={locale}
            onValueChange={switchLocale}
        >
            <SelectTrigger className={cn("w-32", className)} size={size}>
                <SelectValue placeholder="en" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="en" className="border-0">English</SelectItem>
                <SelectItem value="my" className="border-0">Myanmar</SelectItem>
            </SelectContent>
        </Select>
    );
};

export default LocaleSwitcher;
