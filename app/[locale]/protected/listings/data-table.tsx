"use client";

import * as reactTable from "@tanstack/react-table";
import * as React from "react";
import * as pagination from "@/components/ui/pagination";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";

interface DataTableProps<TData> {
  columns: reactTable.ColumnDef<TData>[];
  data: TData[];
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function DataTable<TData>({
  columns,
  data,
  page,
  pageSize,
  total,
  onPageChange,
}: DataTableProps<TData>) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const table = reactTable.useReactTable({
    data,
    columns,
    manualPagination: true,
    pageCount: totalPages,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize,
      },
    },
    getCoreRowModel: reactTable.getCoreRowModel(),
  });

  /**
   * Create a smart page range:
   * - Always shows current page
   * - Shows ±1 page around current
   * - Max 5 pages
   */
  const pageNumbers = React.useMemo(() => {
    const delta = 1;
    const range: number[] = [];

    const start = Math.max(1, page - delta);
    const end = Math.min(totalPages, page + delta);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  }, [page, totalPages]);

  return (
    <div className="rounded-xl border bg-background shadow-sm">
      {/* ---------------- Table ---------------- */}
      <div className="relative overflow-x-auto p-1">
        <Table>
          <TableHeader className="bg-muted/40">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-11 text-xs font-bold uppercase tracking-wide text-muted-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : reactTable.flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 text-sm">
                      {reactTable.flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-sm text-muted-foreground"
                >
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ---------------- Pagination ---------------- */}
      <div className="flex items-center justify-between border-t px-4 py-3">
        <pagination.Pagination>
          <pagination.PaginationContent>
            {/* Previous */}
            <pagination.PaginationItem>
              <pagination.PaginationPrevious
                onClick={() => onPageChange(page - 1)}
                className={cn(page === 1 && "pointer-events-none opacity-50")}
              />
            </pagination.PaginationItem>

            {/* Page Numbers */}
            {pageNumbers.map((p) => (
              <pagination.PaginationItem key={p}>
                <pagination.PaginationLink
                  isActive={page === p}
                  onClick={() => onPageChange(p)}
                >
                  {p}
                </pagination.PaginationLink>
              </pagination.PaginationItem>
            ))}

            {/* Next */}
            <pagination.PaginationItem>
              <pagination.PaginationNext
                onClick={() => onPageChange(page + 1)}
                className={cn(
                  page === totalPages && "pointer-events-none opacity-50",
                )}
              />
            </pagination.PaginationItem>
          </pagination.PaginationContent>
        </pagination.Pagination>

        {/* Page info */}
        <div className="min-w-fit text-sm text-muted-foreground">
          Page <span className="font-medium text-foreground">{page}</span> of{" "}
          <span className="font-medium text-foreground">{totalPages}</span>
        </div>
      </div>
    </div>
  );
}
