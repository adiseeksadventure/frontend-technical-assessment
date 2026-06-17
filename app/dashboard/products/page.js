"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Rating from "@mui/material/Rating";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import SearchBar from "@/components/SearchBar";
import PaginationControls from "@/components/PaginationControls";
import Loading from "@/components/Loading";
import { useProductsStore, PAGE_SIZE } from "@/store/productsStore";

export default function ProductsPage() {
  const router = useRouter();
  const { products, total, categories, loading, error, fetchProducts, fetchCategories } =
    useProductsStore();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  // Load the category list once (for the filter dropdown).
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Re-fetch whenever page / search / category changes.
  useEffect(() => {
    fetchProducts(page, search, category);
  }, [page, search, category, fetchProducts]);

  // Stable handlers (useCallback) so the memoized children don't re-render.
  const handleSearch = useCallback((value) => {
    setSearch(value);
    setPage(0);
  }, []);

  const handleCategory = useCallback((event) => {
    setCategory(event.target.value);
    setPage(0);
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Products
      </Typography>

      {/* Filters: search + category. Stack on mobile, row on desktop. */}
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <SearchBar placeholder="Search products..." onSearch={handleSearch} />
        </Box>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            label="Category"
            value={category}
            onChange={handleCategory}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.slug} value={cat.slug}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Loading />
      ) : products.length === 0 ? (
        <Typography color="text.secondary">No products found.</Typography>
      ) : (
        <>
          {/* Responsive grid: 1 / 2 / 3 / 4 columns as the screen grows. */}
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
            }}
          >
            {products.map((product) => (
              <Card key={product.id}>
                <CardActionArea
                  onClick={() => router.push(`/dashboard/products/${product.id}`)}
                  sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }}
                >
                  <CardMedia
                    component="img"
                    image={product.thumbnail}
                    alt={product.title}
                    sx={{ height: 160, objectFit: "contain", bgcolor: "#fff", p: 1 }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: 48,
                      }}
                    >
                      {product.title}
                    </Typography>
                    <Chip label={product.category} size="small" sx={{ my: 1, textTransform: "capitalize" }} />
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Typography variant="h6" color="primary">
                        ${product.price}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Rating value={product.rating} precision={0.1} size="small" readOnly />
                        <Typography variant="caption" color="text.secondary">
                          {product.rating}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>

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
