import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

// Simple centered spinner shown while data is being fetched.
export default function Loading() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
      <CircularProgress />
    </Box>
  );
}
