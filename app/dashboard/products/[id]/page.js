"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Rating from "@mui/material/Rating";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Loading from "@/components/Loading";
import { apiGet } from "@/lib/api";

function Spec({ label, value }) {
  return (
    <Box sx={{ display: "flex", gap: 1, py: 0.5 }}>
      <Typography variant="body2" sx={{ minWidth: 120, color: "text.secondary" }}>
        {label}
      </Typography>
      <Typography variant="body2">{value ?? "—"}</Typography>
    </Box>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageIndex, setImageIndex] = useState(0); // current carousel image

  useEffect(() => {
    let active = true;
    setLoading(true);
    apiGet(`/products/${id}`)
      .then((data) => {
        if (!active) return;
        setProduct(data);
        setImageIndex(0);
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  const images = product?.images?.length ? product.images : product ? [product.thumbnail] : [];
  const showPrev = () => setImageIndex((i) => (i - 1 + images.length) % images.length);
  const showNext = () => setImageIndex((i) => (i + 1) % images.length);

  return (
    <Box>
      <Button component={Link} href="/dashboard/products" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        Back to Products
      </Button>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Loading />
      ) : product ? (
        <Paper sx={{ p: { xs: 2, sm: 4 } }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 4 }}>
            {/* Image carousel */}
            <Box>
              <Box
                sx={{
                  position: "relative",
                  bgcolor: "#fff",
                  borderRadius: 2,
                  border: "1px solid #eee",
                  height: 320,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 2,
                }}
              >
                <Box
                  component="img"
                  src={images[imageIndex]}
                  alt={product.title}
                  sx={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                />
                {images.length > 1 && (
                  <>
                    <IconButton
                      onClick={showPrev}
                      sx={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", bgcolor: "rgba(255,255,255,0.8)" }}
                    >
                      <ChevronLeftIcon />
                    </IconButton>
                    <IconButton
                      onClick={showNext}
                      sx={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", bgcolor: "rgba(255,255,255,0.8)" }}
                    >
                      <ChevronRightIcon />
                    </IconButton>
                  </>
                )}
              </Box>

              {/* Thumbnails */}
              {images.length > 1 && (
                <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
                  {images.map((img, idx) => (
                    <Box
                      key={idx}
                      component="img"
                      src={img}
                      alt={`${product.title} ${idx + 1}`}
                      onClick={() => setImageIndex(idx)}
                      sx={{
                        width: 56,
                        height: 56,
                        objectFit: "contain",
                        bgcolor: "#fff",
                        borderRadius: 1,
                        border: idx === imageIndex ? "2px solid" : "1px solid #ddd",
                        borderColor: idx === imageIndex ? "primary.main" : "#ddd",
                        cursor: "pointer",
                        p: 0.5,
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>

            {/* Details */}
            <Box>
              <Typography variant="h4" fontWeight={600} gutterBottom>
                {product.title}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, flexWrap: "wrap" }}>
                <Chip label={product.category} size="small" sx={{ textTransform: "capitalize" }} />
                {product.brand && <Chip label={product.brand} size="small" variant="outlined" />}
                <Rating value={product.rating} precision={0.1} size="small" readOnly />
                <Typography variant="body2" color="text.secondary">
                  ({product.rating})
                </Typography>
              </Box>

              <Typography variant="h4" color="primary" sx={{ my: 1 }}>
                ${product.price}
                {product.discountPercentage ? (
                  <Typography component="span" variant="body2" color="success.main" sx={{ ml: 1 }}>
                    {product.discountPercentage}% off
                  </Typography>
                ) : null}
              </Typography>

              <Typography color="text.secondary" sx={{ mb: 2 }}>
                {product.description}
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Specifications</Typography>
              <Spec label="Stock" value={product.stock} />
              <Spec label="Availability" value={product.availabilityStatus} />
              <Spec label="SKU" value={product.sku} />
              <Spec label="Weight" value={product.weight ? `${product.weight} g` : null} />
              <Spec
                label="Dimensions"
                value={
                  product.dimensions
                    ? `${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} cm`
                    : null
                }
              />
              <Spec label="Warranty" value={product.warrantyInformation} />
              <Spec label="Shipping" value={product.shippingInformation} />
              <Spec label="Return policy" value={product.returnPolicy} />
            </Box>
          </Box>
        </Paper>
      ) : null}
    </Box>
  );
}
