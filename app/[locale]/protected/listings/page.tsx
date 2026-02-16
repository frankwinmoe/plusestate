"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Loader from "@/components/customs/loader";
import SidebarHeader from "@/components/customs/sidebar-header";
import { getAllListing } from "@/lib/helpers";
import { Listing, ListingStatus } from "@/lib/types/database";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { TableToolbar } from "./table-toolbar";

const breadcrumb = [
  { title: "Dashboard", href: "/protected" },
  { title: "Listings", href: "/protected/listings" },
];

const PAGE_SIZE = 10;

export default function ListingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // -----------------------------
  // Read from URL
  // -----------------------------
  const page = Number(searchParams.get("page") ?? 1);
  const search = searchParams.get("search") ?? "";
  const status = (searchParams.get("status") as ListingStatus | "all") ?? "all";
  const featured =
    (searchParams.get("featured") as "all" | "true" | "false") ?? "all";

  // -----------------------------
  // Data state
  // -----------------------------
  const [loading, setLoading] = React.useState(true);
  const [listings, setListings] = React.useState<Listing[]>([]);
  const [total, setTotal] = React.useState(0);

  // -----------------------------
  // Fetch whenever params change
  // -----------------------------
  React.useEffect(() => {
    setLoading(true);

    getAllListing({
      page,
      pageSize: PAGE_SIZE,
      status: status === "all" ? undefined : status,
      search,
      featured,
    })
      .then((res) => {
        setListings(res.data);
        setTotal(res.total);
      })
      .finally(() => setLoading(false));
  }, [page, search, status, featured]);

  // -----------------------------
  // URL helper
  // -----------------------------
  function updateParams(next: Record<string, string | number | undefined>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(next).forEach(([key, value]) => {
      if (!value || value === "all" || value === 1) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    router.push(`?${params.toString()}`);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SidebarHeader breadcrumb={breadcrumb} />
      <div className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <TableToolbar
          total={total}
          search={search}
          status={status}
          featured={featured}
          onSearchChange={(v) => updateParams({ search: v, page: 1 })}
          onStatusChange={(v) => updateParams({ status: v, page: 1 })}
          onFeaturedChange={(v) => updateParams({ featured: v, page: 1 })}
          onReset={() => router.push("/protected/listings")}
        />

        {loading ? (
          <div className="flex h-[calc(100vh-64px)] items-center justify-center">
            <Loader loadingText="Loading Listings..." />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={listings}
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            onPageChange={(p) => updateParams({ page: p })}
          />
        )}
        </div>
      </div>
    </div>
  );
}
