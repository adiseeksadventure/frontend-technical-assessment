"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Avatar from "@mui/material/Avatar";
import Alert from "@mui/material/Alert";
import SearchBar from "@/components/SearchBar";
import PaginationControls from "@/components/PaginationControls";
import Loading from "@/components/Loading";
import { useUsersStore, PAGE_SIZE } from "@/store/usersStore";

export default function UsersPage() {
  const router = useRouter();
  const { users, total, loading, error, fetchUsers } = useUsersStore();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

  // Re-fetch whenever the page or search term changes.
  useEffect(() => {
    fetchUsers(page, search);
  }, [page, search, fetchUsers]);

  // useCallback keeps these handlers stable so the memoized SearchBar /
  // PaginationControls don't re-render on every parent render.
  const handleSearch = useCallback((value) => {
    setSearch(value);
    setPage(0); // jump back to the first page on a new search
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Users
      </Typography>

      <Box sx={{ maxWidth: 400, mb: 3 }}>
        <SearchBar placeholder="Search users..." onSearch={handleSearch} />
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Loading />
      ) : users.length === 0 ? (
        <Typography color="text.secondary">No users found.</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            {/* The table scrolls horizontally on small screens. */}
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Company</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => router.push(`/dashboard/users/${user.id}`)}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar src={user.image} alt={user.firstName} />
                        {user.firstName} {user.lastName}
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell sx={{ textTransform: "capitalize" }}>{user.gender}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.company?.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <PaginationControls
            page={page}
            total={total}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </Box>
  );
}
