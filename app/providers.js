"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import AuthSync from "@/components/AuthSync";

// Client-side providers shared by the whole app:
// - SessionProvider: makes the NextAuth session available via useSession()
// - ThemeProvider + CssBaseline: applies our MUI theme and base styles
// - AuthSync: copies the NextAuth token into our Zustand auth store
export default function Providers({ children }) {
  return (
    <SessionProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthSync />
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
