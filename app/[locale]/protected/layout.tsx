"use client";

import React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAppContext } from "@/context/AppContext";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const appContext = useAppContext();
  const router = appContext?.router;
  // Check if the user is authenticated
  const { checkAuth } = appContext!;
  const [authenticated, setAuthenticated] = React.useState<boolean | null>(null); // null for initial loading state

  React.useEffect(() => {
    const checkAuthentication = async () => {
      if (!checkAuth) return;
      const authState = await checkAuth();
      if (!authState) {
        router?.push("/auth/login"); // Redirect to login if not authenticated
      } else {
        setAuthenticated(true); // Set authenticated to true if user is authenticated
      }
    };

    checkAuthentication(); // Perform the authentication check once
  }, [checkAuth, router]);

  // Show a loading state while checking authentication
  if (authenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
