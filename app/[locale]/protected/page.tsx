"use client";
import React from "react";
import { useRouter } from "@/i18n/navigation";

export default function ProtectedPage() {
  // redirect user to the dashboard page if they access /protected directly
  const router = useRouter();

  React.useEffect(() => {
    router.replace("/protected/dashboard");
  }, [router]);

  return (
    <div className="flex w-[calc(100vw-16rem)] h-screen justify-center items-center">
      <h1>Redirecting to Dashboard...</h1>
    </div>
  );
}
