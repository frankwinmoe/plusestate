"use client";

import React from "react";
import Loader from "@/components/customs/loader";
import SidebarHeader from "@/components/customs/sidebar-header";
import { getAllListing } from "@/lib/helpers";
import { Listing, ListingStatus } from "@/lib/types/database";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { TableToolbar } from "./table-toolbar";

const breadcrumb = [
  { title: "Dashboard", href: "/protected" },
  { title: "Listings", href: "/protected/listings" },
];

export default function Listings() {
  const [loading, setLoading] = React.useState(true);
  const [listings, setListings] = React.useState<Listing[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<ListingStatus | "all">(
    "published",
  );
  const [featured, setFeatured] = React.useState<"all" | "true" | "false">(
    "all",
  );

  const pageSize = 10;

  React.useEffect(() => {
    setLoading(true);

    getAllListing({
      page,
      pageSize,
      status: status === "all" ? undefined : status,
      search,
      featured,
    })
      .then((res) => {
        setListings(res.data);
        setTotal(res.total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, status, search, featured]);

  return (
    <div>
      <SidebarHeader breadcrumb={breadcrumb} />

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <TableToolbar
          total={total}
          search={search}
          status={status}
          featured={featured}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onFeaturedChange={setFeatured}
          onReset={() => {
            setSearch("");
            setStatus("all");
            setFeatured("all");
            setPage(1);
          }}
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
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
