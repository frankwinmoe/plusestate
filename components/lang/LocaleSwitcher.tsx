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

const LocaleSwitcher = () => {
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
            <SelectTrigger className="w-32">
                <SelectValue placeholder="en" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="my">Myanmar</SelectItem>
            </SelectContent>
        </Select>
    );
};

export default LocaleSwitcher;
