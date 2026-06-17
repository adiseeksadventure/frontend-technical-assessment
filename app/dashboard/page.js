"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory2";

const sections = [
  { title: "Users", description: "Browse, search and view users.", href: "/dashboard/users", icon: PeopleIcon },
  { title: "Products", description: "Browse, filter and view products.", href: "/dashboard/products", icon: InventoryIcon },
];

export default function DashboardHome() {
  const { data: session } = useSession();

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Welcome{session?.user?.name ? `, ${session.user.name}` : ""} 👋
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Choose a section to get started.
      </Typography>

      {/* Responsive 2-column grid that collapses to 1 column on small screens. */}
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
        }}
      >
        {sections.map(({ title, description, href, icon: Icon }) => (
          <Card key={href}>
            <CardActionArea component={Link} href={href}>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, py: 4 }}>
                <Icon color="primary" sx={{ fontSize: 48 }} />
                <Box>
                  <Typography variant="h6">{title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {description}
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
