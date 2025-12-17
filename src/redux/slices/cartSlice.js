import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Helper function to load cart from localStorage
const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem("cart");

  if (!storedCart || storedCart === "undefined") {
    return { products: [] };
  }

  try {
    return JSON.parse(storedCart);
  } catch (error) {
    console.warn("Failed to parse cart from storage, resetting:", error);
    return { products: [] };
  }
};

// Helper function to save cart to localStorage
const saveCartToStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Fetch cart for user or guest
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ userId, guestId }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        {
          params: {
            userId, // optional, include only if you have a user
            guestId, // optional, include only if you have a guest
          },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// Add an item to the cart for user or guest
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { userId, guestId, productId, quantity, size, color },
    { rejectWithValue }
  ) => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/cart`;

      const payload = {
        userId,
        guestId,
        productId,
        quantity,
        size,
        color,
      };

      console.log("Adding to cart payload:", payload); // debug

      const res = await axios.post(url, payload);

      console.log("Add to cart response:", res.data);
      return res.data; // should return updated cart
    } catch (error) {
      console.error(
        "Add to cart error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to add item to cart"
      );
    }
  }
);

// Update the quantity (and optionally size/color) of an item in the cart
export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async (
    { userId, guestId, productId, quantity, size, color },
    { rejectWithValue }
  ) => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/cart`;

      const res = await axios.put(url, {
        userId,
        guestId,
        productId,
        quantity,
        size,
        color,
      });
      return res.data; // should return updated cart
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update cart item"
      );
    }
  }
);
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ userId, guestId, productId, size, color }, { rejectWithValue }) => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/cart`;
      const res = await axios.delete(url, {
        // Fixed: await axios (space added)
        data: {
          userId,
          guestId,
          productId,
          size,
          color,
        },
      });
      return res.data; // backend returns updated cart
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove item from cart"
      );
    }
  }
);

// Merge guest cart into user cart
export const mergeCart = createAsyncThunk(
  "cart/mergeCart",
  async ({ user, guestId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken"); // get token if needed
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`;

      const res = await axios.post(
        url,
        { user, guestId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data; // returns merged cart
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to merge guest cart"
      );
    }
  }
);

// =================================================================================

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: loadCartFromStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cart = { products: [] };
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    // fetchCart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to Fetch Cart";
      });

    // addToCart
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to add to Cart";
      });

    // updateCartItemQuantity
    builder
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to update item quantity";
      });

    // removeFromCart
    builder
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "failed to remove item";
      });

    // mergeCart
    builder
      .addCase(mergeCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mergeCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "failed to mearge cart";
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
