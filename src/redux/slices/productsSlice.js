import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔹 Fetch all products with filters
export const fetchProductsByFilters = createAsyncThunk(
  "products/fetchByFilters",
  async (
    {
      collection,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      limit,
    },
    { rejectWithValue }
  ) => {
    // Add rejectWithValue
    try {
      const query = new URLSearchParams();

      if (collection) query.append("collection", collection);
      if (size) query.append("size", size);
      if (color) query.append("color", color);
      if (gender) query.append("gender", gender);
      if (minPrice) query.append("minPrice", minPrice);
      if (maxPrice) query.append("maxPrice", maxPrice);
      if (sortBy) query.append("sortBy", sortBy);
      if (search) query.append("search", search);
      if (category) query.append("category", category);
      if (material) query.append("material", material);
      if (brand) query.append("brand", brand);
      if (limit) query.append("limit", limit);

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`
      );

      return res.data;
    } catch (error) {
      console.error(
        "Fetch products error:",
        error.response?.data || error.message
      ); // Log details
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

// 🔹 Fetch single product by ID
export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (id, { rejectWithValue }) => {
    // Add rejectWithValue
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
      );

      return res.data;
    } catch (error) {
      console.error(
        "Fetch product details error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product details"
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    // Add rejectWithValue
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      console.error(
        "Update product error:",
        error.response?.data || error.message
      ); // Log details (e.g., "Validation error: Price must be positive")
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product"
      );
    }
  }
);

export const fetchSimilarProducts = createAsyncThunk(
  "products/fetchSimilarProducts",
  async ({ id }, { rejectWithValue }) => {
    // Add rejectWithValue
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`
      );
      return res.data;
    } catch (error) {
      console.error(
        "Fetch similar products error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch similar products"
      );
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    selectedProduct: null,
    similarProducts: [],
    loading: false,
    error: null,
    similarLoading: false, // Add missing fields
    similarError: null,
    filters: {
      category: "all",
      size: "",
      color: "",
      gender: "",
      brand: "",
      minPrice: 0,
      maxPrice: 0,
      sortBy: "",
      search: "",
      material: "",
      collection: "all",
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: "all",
        size: "",
        color: "",
        gender: "",
        brand: "",
        minPrice: 0,
        maxPrice: 0,
        sortBy: "",
        search: "",
        material: "",
        collection: "all",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetching products by filters
      .addCase(fetchProductsByFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.products = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProductsByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message; // Use payload if rejectWithValue used
      })

      // Handle fetching single product details
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Handle updating product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        // Optional: Update selectedProduct if editing the viewed one
        if (state.selectedProduct?._id === action.payload._id) {
          state.selectedProduct = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message; // Use payload
      })

      // Handle similar products
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.similarLoading = true;
        state.similarError = null;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.similarLoading = false;
        state.similarProducts = action.payload;
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.similarLoading = false;
        state.similarError = action.payload || action.error.message;
      });
  },
});

export const { setFilters, clearFilters } = productSlice.actions;
export default productSlice.reducer;
