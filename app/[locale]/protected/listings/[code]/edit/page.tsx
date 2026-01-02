//app/protected/listings/[code]/edit/page.tsx

"use client";

import { useParams } from "next/navigation";

export default function PropertyEditPage() {
  const { code } = useParams<{ code: string }>();

  console.log("Listing code:", code);

  return <div>ListingEditPage: {code}</div>;
}
