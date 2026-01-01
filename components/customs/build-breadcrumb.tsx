import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import React from "react";

export interface BuildBreadcrumbProps {
    breadcrumb: Array<{ title: string; href?: string }>;
}

export function BuildBreadcrumb({ breadcrumb }: BuildBreadcrumbProps) {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumb.length > 0 &&
                    breadcrumb.map((item, index) => (
                        <React.Fragment key={index}>
                            <BreadcrumbItem>
                                {item.href ? (
                                    <BreadcrumbLink href={item.href}>{item.title}</BreadcrumbLink>
                                ) : (
                                    <span>{item.title}</span>
                                )}
                            </BreadcrumbItem>
                            {index < breadcrumb.length - 1 && (
                                <BreadcrumbSeparator className="hidden md:block" />
                            )}
                        </React.Fragment>
                    ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
