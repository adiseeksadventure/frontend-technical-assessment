"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Loading from "@/components/Loading";
import { apiGet } from "@/lib/api";

// Small helper to render a "Label: value" line.
function Field({ label, value }) {
  return (
    <Box sx={{ display: "flex", gap: 1, py: 0.5 }}>
      <Typography variant="body2" sx={{ minWidth: 110, color: "text.secondary" }}>
        {label}
      </Typography>
      <Typography variant="body2">{value ?? "—"}</Typography>
    </Box>
  );
}

export default function UserDetailPage() {
  const { id } = useParams(); // works synchronously in Client Components
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    apiGet(`/users/${id}`)
      .then((data) => active && setUser(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <Box>
      <Button component={Link} href="/dashboard/users" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        Back to Users
      </Button>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Loading />
      ) : user ? (
        <Paper sx={{ p: { xs: 2, sm: 4 } }}>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <Avatar src={user.image} alt={user.firstName} sx={{ width: 80, height: 80 }} />
            <Box>
              <Typography variant="h5" fontWeight={600}>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography color="text.secondary">@{user.username}</Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Details, in a responsive 2-column grid */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: { xs: 0, sm: 4 } }}>
            <Box>
              <Typography variant="subtitle2" sx={{ mt: 1, mb: 0.5 }}>Personal</Typography>
              <Field label="Email" value={user.email} />
              <Field label="Phone" value={user.phone} />
              <Field label="Gender" value={user.gender} />
              <Field label="Age" value={user.age} />
              <Field label="Birth date" value={user.birthDate} />
              <Field label="Blood group" value={user.bloodGroup} />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ mt: 1, mb: 0.5 }}>Company</Typography>
              <Field label="Name" value={user.company?.name} />
              <Field label="Title" value={user.company?.title} />
              <Field label="Department" value={user.company?.department} />

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Address</Typography>
              <Field label="Street" value={user.address?.address} />
              <Field label="City" value={user.address?.city} />
              <Field label="State" value={user.address?.state} />
              <Field label="Country" value={user.address?.country} />
            </Box>
          </Box>
        </Paper>
      ) : null}
    </Box>
  );
}
