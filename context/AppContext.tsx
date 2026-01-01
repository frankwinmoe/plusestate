"use client";

import { useRouter } from "@/i18n/navigation";
import { createContext, useContext } from "react";
import { usePathname } from "@/i18n/navigation";
import Navbar from "@/components/customs/navbar";

import { createClient } from "@/lib/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";

// Define context type
type AppContextType = {
  supabase: SupabaseClient;
  router: ReturnType<typeof useRouter>;
  isProtected: boolean;
  checkAuth?: () => Promise<boolean>;
};
// Create context
export const AppContext = createContext<AppContextType | undefined>(undefined);
// Create hook to use context
export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = (props: { children: React.ReactNode }) => {
  // Initialize router and pathname
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const checkAuth = async (): Promise<boolean> => {
    const { data } = await supabase.auth.getUser();
    return data.user !== null;
  };

  // Determine if the current route is protected
  const isProtected = pathname.includes("/protected");

  // Provide context value
  const value = { supabase, router, isProtected, checkAuth };

  // Render
  return (
    <AppContext.Provider value={value}>
      {!isProtected && (
        <header className="w-full">
          <Navbar />
        </header>
      )}
      <main className="min-h-screen flex flex-col items-center">
        <div className="flex-1 w-full flex flex-col items-center">
          {props.children}
        </div>
      </main>
    </AppContext.Provider>
  );
};
