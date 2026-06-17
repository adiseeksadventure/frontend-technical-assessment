"use client";

import { memo } from "react";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";

// Pagination control built on MUI's <Pagination />.
// We work with 0-based page numbers in the stores, but MUI is 1-based,
// so we convert at the boundary. Memoized to avoid needless re-renders.
function PaginationControls({ page, total, pageSize, onPageChange }) {
  const pageCount = Math.ceil(total / pageSize);
  if (pageCount <= 1) return null;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
      <Pagination
        count={pageCount}
        page={page + 1}
        onChange={(_, value) => onPageChange(value - 1)}
        color="primary"
        shape="rounded"
      />
    </Box>
  );
}

export default memo(PaginationControls);
