import { Listing, ListingStatus } from "@/lib/types/database";

interface GetListingsParams {
  page?: number;
  pageSize?: number;
  status?: ListingStatus;
  search?: string;
  featured?: "all" | "true" | "false";
}

interface GetListingsResponse {
  data: Listing[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function getAllListing({
  page = 1,
  pageSize = 10,
  status,
  search,
  featured,
}: GetListingsParams = {}): Promise<GetListingsResponse> {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("pageSize", String(pageSize));

  if (status) params.set("status", status);
  if (search) params.set("search", search);
  if (featured && featured !== "all") {
    params.set("featured", featured); // "true" | "false"
  }

  const res = await fetch(`/api/listings?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch listings");
  }

  const json = await res.json();

  return {
    data: json.data,
    total: json.meta.total,
    page: json.meta.page,
    pageSize: json.meta.pageSize,
    totalPages: json.meta.totalPages,
  };
}
