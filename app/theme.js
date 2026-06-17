import { createTheme } from "@mui/material/styles";

// A single, simple MUI theme used across the whole app.
// Keeping it in one place makes it easy to tweak colors/spacing later.
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" },
    background: { default: "#f4f6f8" },
  },
  shape: { borderRadius: 10 },
});

export default theme;
