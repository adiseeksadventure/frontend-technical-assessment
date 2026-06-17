"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuthStore } from "@/store/authStore";

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Users", href: "/dashboard/users" },
  { label: "Products", href: "/dashboard/products" },
];

// Shared layout for every page under /dashboard.
// Renders the top navigation bar + a logout button, then the page content.
// (Route protection itself is handled server-side in proxy.js.)
export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const handleLogout = async () => {
    clearAuth(); // clear our Zustand/localStorage copy
    await signOut({ redirect: false }); // clear the NextAuth session
    router.replace("/login");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static">
        <Toolbar sx={{ flexWrap: "wrap", gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mr: { sm: 2 } }}>
            Admin
          </Typography>

          <Box sx={{ display: "flex", flexGrow: 1, gap: 0.5 }}>
            {navLinks.map((link) => {
              // A link is "active" if the path matches it (Users/Products also
              // match their detail pages).
              const active =
                link.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(link.href);
              return (
                <Button
                  key={link.href}
                  component={Link}
                  href={link.href}
                  color="inherit"
                  sx={{ fontWeight: active ? 700 : 400, opacity: active ? 1 : 0.85 }}
                >
                  {link.label}
                </Button>
              );
            })}
          </Box>

          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
}
