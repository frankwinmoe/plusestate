"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ClientAuthControls from "./client-auth-controls";

export function AuthButton() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  return <ClientAuthControls user={user} />;
}
