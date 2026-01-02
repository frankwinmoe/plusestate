//app/protected/listings/[code]/page.tsx

"use client";

import { useParams } from "next/navigation";

export default function PropertyDetailsPage() {
  const { code } = useParams<{ code: string }>();

  console.log("Listing code:", code);

  return <div>ListingViewPage: {code}</div>;
}
