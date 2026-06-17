"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/authStore";

// Bridges NextAuth -> Zustand.
// Whenever the NextAuth session changes, we copy the token + user into our
// Zustand auth store (which also persists them to localStorage). This keeps
// the assignment's requirement of "store the token in Zustand state" while
// still using NextAuth as the source of truth for authentication.
export default function AuthSync() {
  const { data: session, status } = useSession();
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      setAuth({ token: session.accessToken, user: session.user });
    } else if (status === "unauthenticated") {
      clearAuth();
    }
  }, [status, session, setAuth, clearAuth]);

  return null; // this component renders nothing
}
