"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  ClientAuthControlsDesktop,
  ClientAuthControlsMobile,
} from "./client-auth-controls";
import type { User } from "@supabase/supabase-js";

interface AuthButtonProps {
  mobile?: boolean;
}

export function AuthButton({ mobile }: AuthButtonProps) {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 1. Get initial user (important on first load / refresh)
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // 2. Listen for auth changes (login / logout / refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // 3. Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  if (mobile) {
    return <ClientAuthControlsMobile user={user!} />;
  }
  return <ClientAuthControlsDesktop user={user!} />;
}
