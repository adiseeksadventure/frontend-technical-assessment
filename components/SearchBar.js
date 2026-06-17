"use client";

import { memo, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

// Reusable search input with built-in debouncing.
//
// Performance: we keep the typed text in local state and only call `onSearch`
// 400ms after the user stops typing. This avoids firing an API request on
// every keystroke. Wrapped in React.memo so it doesn't re-render when the
// parent re-renders for unrelated reasons (e.g. new data arriving).
function SearchBar({ placeholder = "Search...", onSearch }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const id = setTimeout(() => onSearch(value), 400);
    return () => clearTimeout(id); // cancel the previous timer on each keystroke
  }, [value, onSearch]);

  return (
    <TextField
      fullWidth
      size="small"
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}

export default memo(SearchBar);
