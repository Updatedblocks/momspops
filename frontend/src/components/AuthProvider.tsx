"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useSettingsStore, type ProfileData } from "@/store/useSettingsStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useSettingsStore((s) => s.setUser);
  const setProfile = useSettingsStore((s) => s.setProfile);
  const clearAuth = useSettingsStore((s) => s.clearAuth);

  // ── Extract profile from session metadata ──
  const profileFromSession = (session: {
    user: { email?: string; user_metadata?: Record<string, unknown> };
  }): ProfileData => {
    const meta = session.user.user_metadata ?? {};
    return {
      fullName: (meta.full_name as string) ?? "",
      displayName:
        (meta.full_name as string)?.split(" ")[0] ??
        (meta.name as string) ??
        "",
      email: session.user.email ?? "",
      avatarUrl: (meta.avatar_url as string) ?? "",
      bio: "",
      echo_balance: 50,
      tier: "echoes",
    };
  };

  useEffect(() => {
    const supabase = createClient();

    // ── Hydrate on mount (page reload / first paint) ──
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
          isAuthenticated: true,
        });
        setProfile(profileFromSession(session));
      } else {
        clearAuth();
      }
    });

    // ── Subscribe to future changes (sign-in, sign-out, token refresh) ──
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
          isAuthenticated: true,
        });
        setProfile(profileFromSession(session));
      } else {
        clearAuth();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, clearAuth]);

  return <>{children}</>;
}
