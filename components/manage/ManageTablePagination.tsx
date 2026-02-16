import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

type Props = {
  locale: string;
  tableSlug: string;
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  search: string | null;
};

function buildHref(
  locale: string,
  tableSlug: string,
  page: number,
  pageSize: number,
  search: string | null
): string {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));
  if (search) params.set("search", search);
  return `/${locale}/protected/${tableSlug}?${params.toString()}`;
}

export function ManageTablePagination({
  locale,
  tableSlug,
  page,
  totalPages,
  total,
  pageSize,
  search,
}: Props) {
  const delta = 1;
  const pageNumbers: number[] = [];
  const start = Math.max(1, page - delta);
  const end = Math.min(totalPages, page + delta);
  for (let i = start; i <= end; i++) {
    pageNumbers.push(i);
  }

  const prevHref = buildHref(locale, tableSlug, page - 1, pageSize, search);
  const nextHref = buildHref(locale, tableSlug, page + 1, pageSize, search);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{page}</span> of{" "}
        <span className="font-medium text-foreground">{totalPages}</span>
        <span className="hidden sm:inline"> ({total} items)</span>
      </p>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={page > 1 ? prevHref : undefined}
              className={cn(page <= 1 && "pointer-events-none opacity-50")}
              aria-disabled={page <= 1}
            />
          </PaginationItem>
          {start > 1 && (
            <>
              <PaginationItem>
                <PaginationLink href={buildHref(locale, tableSlug, 1, pageSize, search)} isActive={page === 1}>
                  1
                </PaginationLink>
              </PaginationItem>
              {start > 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}
          {pageNumbers.map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                href={buildHref(locale, tableSlug, p, pageSize, search)}
                isActive={page === p}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}
          {end < totalPages && (
            <>
              {end < totalPages - 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  href={buildHref(locale, tableSlug, totalPages, pageSize, search)}
                  isActive={page === totalPages}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
          <PaginationItem>
            <PaginationNext
              href={page < totalPages ? nextHref : undefined}
              className={cn(page >= totalPages && "pointer-events-none opacity-50")}
              aria-disabled={page >= totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
